import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { generateFloorPlan } from "@/lib/ai/orchestrator";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();
  if (!supabaseUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await db.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const { projectName, totalArea, floors, style, terrainWidth, terrainDepth, rooms, observations } = body;

  const project = await db.project.create({
    data: {
      name: projectName || `Projeto ${new Date().toLocaleDateString("pt-BR")}`,
      clientId: user.id,
      totalArea,
      status: "GENERATING",
      briefing: { totalArea, floors, style, terrainWidth, terrainDepth, rooms, observations },
    },
  });

  const generation = await db.aIGeneration.create({
    data: {
      projectId: project.id,
      type: "FLOOR_PLAN",
      promptInput: JSON.stringify({ totalArea, floors, style, rooms, observations }),
      status: "processing",
      modelUsed: "claude-sonnet-4-6",
    },
  });

  try {
    const result = await generateFloorPlan({
      totalArea,
      floors,
      style,
      terrainWidth,
      terrainDepth,
      rooms,
      observations,
    });

    await db.floorPlan.create({
      data: {
        projectId: project.id,
        svgData: result.svgData,
        metadata: JSON.parse(JSON.stringify({
          rooms: result.rooms,
          observations: result.observations,
          warnings: result.warnings,
        })),
      },
    });

    await db.aIGeneration.update({
      where: { id: generation.id },
      data: {
        status: "completed",
        rawOutput: result as unknown as object,
        completedAt: new Date(),
      },
    });

    await db.project.update({
      where: { id: project.id },
      data: { status: "AI_REVIEW" },
    });

    return NextResponse.json({ projectId: project.id, ok: true });
  } catch (err) {
    await db.aIGeneration.update({
      where: { id: generation.id },
      data: {
        status: "failed",
        errorMessage: String(err),
        completedAt: new Date(),
      },
    });

    await db.project.update({
      where: { id: project.id },
      data: { status: "BRIEFING" },
    });

    return NextResponse.json({ error: "Generation failed" }, { status: 500 });
  }
}
