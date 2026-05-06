import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  status: string;
}

const stages = [
  { key: "BRIEFING", label: "Briefing" },
  { key: "GENERATING", label: "Geração IA" },
  { key: "AI_REVIEW", label: "Revisão IA" },
  { key: "PROFESSIONAL_REVIEW", label: "Revisão Profissional" },
  { key: "APPROVED", label: "Aprovado" },
  { key: "EXECUTIVE_PROJECT", label: "Projeto Executivo" },
  { key: "DELIVERED", label: "Entregue" },
];

const stageOrder = stages.map((s) => s.key);

export function ProjectTimeline({ status }: Props) {
  const currentIdx = stageOrder.indexOf(status);

  return (
    <div className="bg-surface border border-border rounded-xl p-4">
      <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50 mb-4">Progresso</h3>
      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const isDone = idx < currentIdx;
          const isCurrent = idx === currentIdx;
          const isPending = idx > currentIdx;
          return (
            <div key={stage.key} className="flex items-center gap-3">
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : isCurrent ? (
                  status === "GENERATING" ? (
                    <Loader2 className="h-5 w-5 text-primary-600 animate-spin" />
                  ) : (
                    <div className="h-5 w-5 rounded-full border-2 border-primary-600 bg-primary-100 dark:bg-primary-950/40" />
                  )
                ) : (
                  <Circle className="h-5 w-5 text-zinc-300 dark:text-zinc-600" />
                )}
              </div>
              <span
                className={cn(
                  "text-sm",
                  isDone && "text-emerald-600 dark:text-emerald-400",
                  isCurrent && "text-primary-700 dark:text-primary-400 font-semibold",
                  isPending && "text-zinc-400 dark:text-zinc-600"
                )}
              >
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
