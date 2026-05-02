import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { UserRole } from "@prisma/client";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const clerkUser = await currentUser();
  if (!clerkUser) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { role } = await req.json();
  if (!["CLIENT", "PROFESSIONAL"].includes(role)) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  const name = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim();

  await db.user.upsert({
    where: { clerkId: userId },
    create: {
      clerkId: userId,
      email,
      name: name || null,
      avatarUrl: clerkUser.imageUrl,
      role: role as UserRole,
      profile: { create: {} },
      subscription: { create: { plan: "free" } },
    },
    update: {
      role: role as UserRole,
    },
  });

  return NextResponse.json({ ok: true });
}
