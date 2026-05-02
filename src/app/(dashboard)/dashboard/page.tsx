import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { db } from "@/lib/db";
import { FolderOpen, Sparkles, ArrowRight, Clock } from "lucide-react";

export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      clientProjects: {
        orderBy: { updatedAt: "desc" },
        take: 5,
      },
      subscription: true,
    },
  });

  if (!user) redirect("/onboarding");

  const projects = user.clientProjects;

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
    BRIEFING: "bg-zinc-100 text-zinc-700",
    GENERATING: "bg-blue-100 text-blue-700",
    AI_REVIEW: "bg-yellow-100 text-yellow-700",
    PROFESSIONAL_REVIEW: "bg-orange-100 text-orange-700",
    APPROVED: "bg-green-100 text-green-700",
    EXECUTIVE_PROJECT: "bg-violet-100 text-violet-700",
    DELIVERED: "bg-emerald-100 text-emerald-700",
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">
          Olá, {user.name?.split(" ")[0] || "bem-vindo"}!
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400 mt-1">
          Gerencie seus projetos e gere novos com IA.
        </p>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <Link
          href="/dashboard/generate"
          className="flex items-center gap-4 p-5 bg-violet-600 hover:bg-violet-700 rounded-2xl text-white transition-colors group"
        >
          <Sparkles className="h-8 w-8" />
          <div>
            <div className="font-semibold">Novo projeto com IA</div>
            <div className="text-violet-200 text-sm">Descreva e gere em minutos</div>
          </div>
          <ArrowRight className="h-5 w-5 ml-auto group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/dashboard/projects"
          className="flex items-center gap-4 p-5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 rounded-2xl text-zinc-900 dark:text-zinc-100 transition-colors group"
        >
          <FolderOpen className="h-8 w-8 text-zinc-500" />
          <div>
            <div className="font-semibold">Meus projetos</div>
            <div className="text-zinc-500 text-sm">{projects.length} projeto(s)</div>
          </div>
          <ArrowRight className="h-5 w-5 ml-auto text-zinc-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Recent projects */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Projetos recentes</h2>
          <Link href="/dashboard/projects" className="text-sm text-violet-600 hover:text-violet-700">
            Ver todos
          </Link>
        </div>
        {projects.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <Sparkles className="h-12 w-12 text-zinc-300 dark:text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-500 dark:text-zinc-400 mb-4">Nenhum projeto ainda.</p>
            <Link
              href="/dashboard/generate"
              className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium px-5 py-2.5 rounded-lg transition-colors text-sm"
            >
              <Sparkles className="h-4 w-4" />
              Criar primeiro projeto
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {projects.map((p) => (
              <Link
                key={p.id}
                href={`/dashboard/projects/${p.id}`}
                className="flex items-center gap-4 p-4 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-xl hover:border-zinc-200 dark:hover:border-zinc-700 transition-colors"
              >
                <div className="h-10 w-10 bg-violet-100 dark:bg-violet-950/40 rounded-lg flex items-center justify-center">
                  <FolderOpen className="h-5 w-5 text-violet-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-zinc-900 dark:text-zinc-50 truncate">{p.name}</div>
                  <div className="text-sm text-zinc-500 flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3" />
                    {new Date(p.updatedAt).toLocaleDateString("pt-BR")}
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full ${
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
    </div>
  );
}
