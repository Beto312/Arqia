import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const supabase = await createClient();
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();
  if (!supabaseUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { role } = await req.json();
  if (!["CLIENT", "PROFESSIONAL"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  // Salva role no user_metadata do Supabase (funciona sem banco externo)
  const { error } = await supabase.auth.updateUser({ data: { role } });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Tenta salvar no Prisma se o banco estiver configurado
  if (process.env.DATABASE_URL) {
    try {
      const { db } = await import("@/lib/db");
      const { UserRole } = await import("@prisma/client");
      const email = supabaseUser.email ?? "";
      const name = (supabaseUser.user_metadata?.full_name as string | undefined) ?? "";
      await db.user.upsert({
        where: { supabaseId: supabaseUser.id },
        create: {
          supabaseId: supabaseUser.id,
          email,
          name: name || null,
          role: role as typeof UserRole[keyof typeof UserRole],
          profile: { create: {} },
          subscription: { create: { plan: "free" } },
        },
        update: { role: role as typeof UserRole[keyof typeof UserRole] },
      });
    } catch {
      // banco não configurado ainda, ignora
    }
  }

  return NextResponse.json({ ok: true });
}
