import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Role = "CLIENT" | "PROFESSIONAL";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();
  if (!supabaseUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role } = await req.json() as { role: Role };
  if (!["CLIENT", "PROFESSIONAL"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const { error } = await supabase.auth.updateUser({ data: { role } });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db");
      const email = supabaseUser.email ?? "";
      const name = (supabaseUser.user_metadata?.full_name as string | undefined) ?? "";
      await db.user.upsert({
        where: { supabaseId: supabaseUser.id },
        create: {
          supabaseId: supabaseUser.id,
          email,
          name: name || null,
          role,
          profile: { create: {} },
          subscription: { create: { plan: "free" } },
        },
        update: { role },
      });
    } catch {
      // banco não configurado, ignora
    }
  }

  return NextResponse.json({ ok: true });
}
