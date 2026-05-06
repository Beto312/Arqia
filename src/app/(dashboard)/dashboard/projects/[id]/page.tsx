import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { FloorPlanViewer } from "@/components/editor/floor-plan-viewer";
import { ProjectTimeline } from "@/components/projects/project-timeline";
import { Clock, MapPin, Ruler, AlertTriangle } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user: supabaseUser } } = await supabase.auth.getUser();
  if (!supabaseUser) redirect("/sign-in");

  const user = await db.user.findUnique({ where: { supabaseId: supabaseUser.id } });
  if (!user) redirect("/onboarding");

  const project = await db.project.findFirst({
    where: {
      id,
      OR: [{ clientId: user.id }, { professionalId: user.id }],
    },
    include: {
      floorPlans: { orderBy: { version: "desc" }, take: 1 },
      generations: { orderBy: { createdAt: "desc" }, take: 3 },
      client: { select: { name: true, email: true } },
    },
  });

  if (!project) notFound();

  const latestPlan = project.floorPlans[0];

  const statusLabels: Record<string, string> = {
    BRIEFING: "Briefing",
    GENERATING: "Gerando com IA",
    AI_REVIEW: "Revisão de IA",
    PROFESSIONAL_REVIEW: "Revisão Profissional",
    APPROVED: "Aprovado",
    EXECUTIVE_PROJECT: "Projeto Executivo",
    DELIVERED: "Entregue",
  };

  const briefing = project.briefing as Record<string, unknown> | null;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">{project.name}</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {new Date(project.updatedAt).toLocaleDateString("pt-BR")}
            </span>
            {project.totalArea && (
              <span className="flex items-center gap-1.5">
                <Ruler className="h-3.5 w-3.5" />
                {project.totalArea}m²
              </span>
            )}
            {project.city && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {project.city}, {project.state}
              </span>
            )}
          </div>
        </div>
        <span className="text-sm font-medium px-3 py-1.5 bg-primary-100 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400 rounded-full">
          {statusLabels[project.status] || project.status}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Main: Floor plan */}
        <div className="col-span-2 space-y-5">
          {project.status === "GENERATING" ? (
            <div className="bg-surface border border-border rounded-2xl p-12 text-center">
              <div className="h-12 w-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-zinc-600 dark:text-zinc-400 font-medium">Gerando planta baixa com IA...</p>
              <p className="text-zinc-400 text-sm mt-1">Isso pode levar alguns segundos.</p>
            </div>
          ) : latestPlan ? (
            <div className="bg-surface border border-border rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Planta Baixa</h2>
                <span className="text-xs text-zinc-400">Versão {latestPlan.version}</span>
              </div>
              <FloorPlanViewer svgData={latestPlan.svgData} planId={latestPlan.id} />
              {/* AI disclaimer */}
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 border-t border-amber-100 dark:border-amber-900 flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-400">
                  Anteprojeto gerado por IA — exige validação e ART/RRT para execução da obra.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-surface border border-border rounded-2xl p-12 text-center text-zinc-500">
              Nenhuma planta gerada ainda.
            </div>
          )}

          {/* Metadata cards */}
          {latestPlan?.metadata && (() => {
            const meta = latestPlan.metadata as {
              observations?: string[];
              warnings?: string[];
            };
            return (
              <div className="grid grid-cols-2 gap-4">
                {meta.observations && meta.observations.length > 0 && (
                  <div className="bg-surface border border-border rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-2">
                      Observações da IA
                    </h3>
                    <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                      {meta.observations.map((o, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-primary-500 mt-0.5">•</span> {o}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {meta.warnings && meta.warnings.length > 0 && (
                  <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-100 dark:border-amber-800 rounded-xl p-4">
                    <h3 className="text-sm font-semibold text-amber-900 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                      <AlertTriangle className="h-4 w-4" /> Alertas
                    </h3>
                    <ul className="text-sm text-amber-800 dark:text-amber-400 space-y-1">
                      {meta.warnings.map((w, i) => (
                        <li key={i}>• {w}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })()}
        </div>

        {/* Sidebar: timeline + briefing */}
        <div className="space-y-4">
          <ProjectTimeline status={project.status} />

          {briefing && (
            <div className="bg-surface border border-border rounded-xl p-4">
              <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-3">Briefing</h3>
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Área</dt>
                  <dd className="font-medium">{String(briefing.totalArea)}m²</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Pavimentos</dt>
                  <dd className="font-medium">{String(briefing.floors)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-zinc-500">Estilo</dt>
                  <dd className="font-medium">{String(briefing.style)}</dd>
                </div>
              </dl>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
