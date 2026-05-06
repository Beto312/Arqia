import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { FolderOpen, Plus, Clock, Ruler } from "lucide-react";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();
  if (!supabaseUser) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) redirect("/onboarding");

  const projects = await db.project.findMany({
    where: {
      OR: [{ clientId: user.id }, { professionalId: user.id }],
    },
    orderBy: { updatedAt: "desc" },
    include: {
      floorPlans: { take: 1 },
      _count: { select: { generations: true } },
    },
  });

  const statusLabels: Record<string, string> = {
    BRIEFING: "Briefing",
    GENERATING: "Gerando",
    AI_REVIEW: "Revisão IA",
    PROFESSIONAL_REVIEW: "Revisão Profissional",
    APPROVED: "Aprovado",
    EXECUTIVE_PROJECT: "Projeto Executivo",
    DELIVERED: "Entregue",
  };

  const statusColors: Record<string, string> = {
    BRIEFING: "bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
    GENERATING: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    AI_REVIEW: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    PROFESSIONAL_REVIEW: "bg-orange-100 text-orange-700",
    APPROVED: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    EXECUTIVE_PROJECT: "bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400",
    DELIVERED: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Meus Projetos</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1">{projects.length} projeto(s) no total</p>
        </div>
        <Link
          href="/dashboard/generate"
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
        >
          <Plus className="h-4 w-4" />
          Novo projeto
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-border">
          <FolderOpen className="h-14 w-14 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
          <p className="text-zinc-500 dark:text-zinc-400 mb-5">Nenhum projeto ainda.</p>
          <Link
            href="/dashboard/generate"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
          >
            <Plus className="h-4 w-4" />
            Criar primeiro projeto
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {projects.map((p: (typeof projects)[number]) => (
            <Link
              key={p.id}
              href={`/dashboard/projects/${p.id}`}
              className="flex items-center gap-5 p-5 bg-surface border border-border rounded-2xl hover:border-primary-200 dark:hover:border-primary-800 transition-colors group"
            >
              <div className="h-12 w-12 bg-primary-50 dark:bg-primary-950/40 rounded-xl flex items-center justify-center shrink-0">
                <FolderOpen className="h-6 w-6 text-primary-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-zinc-900 dark:text-zinc-50 group-hover:text-primary-700 dark:group-hover:text-primary-400 transition-colors truncate">
                  {p.name}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-zinc-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {new Date(p.updatedAt).toLocaleDateString("pt-BR")}
                  </span>
                  {p.totalArea && (
                    <span className="flex items-center gap-1">
                      <Ruler className="h-3.5 w-3.5" />
                      {p.totalArea}m²
                    </span>
                  )}
                  <span>{p._count.generations} geração(ões)</span>
                </div>
              </div>
              <span
                className={`text-xs font-medium px-3 py-1.5 rounded-full shrink-0 ${
                  statusColors[p.status] || "bg-zinc-100 text-zinc-600"
                }`}
              >
                {statusLabels[p.status] || p.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
