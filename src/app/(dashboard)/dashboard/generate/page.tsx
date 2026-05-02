"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RoomSpec {
  type: string;
  count: number;
  notes: string;
}

interface Briefing {
  projectName: string;
  totalArea: number;
  floors: number;
  style: string;
  terrainWidth: number;
  terrainDepth: number;
  rooms: RoomSpec[];
  observations: string;
}

const STYLES = [
  "Contemporâneo",
  "Moderno",
  "Minimalista",
  "Clássico",
  "Rústico",
  "Industrial",
  "Escandinavo",
  "Tropical",
];

const ROOM_TYPES = [
  { value: "bedroom", label: "Quarto" },
  { value: "master_bedroom", label: "Suíte" },
  { value: "bathroom", label: "Banheiro" },
  { value: "kitchen", label: "Cozinha" },
  { value: "living_room", label: "Sala de Estar" },
  { value: "dining_room", label: "Sala de Jantar" },
  { value: "laundry", label: "Lavanderia" },
  { value: "garage", label: "Garagem" },
  { value: "balcony", label: "Varanda" },
  { value: "office", label: "Escritório" },
  { value: "storage", label: "Depósito" },
];

export default function GeneratePage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [briefing, setBriefing] = useState<Briefing>({
    projectName: "",
    totalArea: 100,
    floors: 1,
    style: "Contemporâneo",
    terrainWidth: 10,
    terrainDepth: 25,
    rooms: [
      { type: "living_room", count: 1, notes: "" },
      { type: "kitchen", count: 1, notes: "" },
      { type: "bedroom", count: 2, notes: "" },
      { type: "bathroom", count: 1, notes: "" },
    ],
    observations: "",
  });

  function addRoom() {
    setBriefing((b) => ({
      ...b,
      rooms: [...b.rooms, { type: "bedroom", count: 1, notes: "" }],
    }));
  }

  function removeRoom(idx: number) {
    setBriefing((b) => ({
      ...b,
      rooms: b.rooms.filter((_, i) => i !== idx),
    }));
  }

  function updateRoom(idx: number, field: keyof RoomSpec, value: string | number) {
    setBriefing((b) => ({
      ...b,
      rooms: b.rooms.map((r, i) => (i === idx ? { ...r, [field]: value } : r)),
    }));
  }

  async function handleGenerate() {
    setLoading(true);
    try {
      const res = await fetch("/api/projects/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(briefing),
      });
      const data = await res.json();
      if (data.projectId) {
        router.push(`/dashboard/projects/${data.projectId}`);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-6 w-6 text-violet-600" />
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50">Gerar projeto com IA</h1>
        </div>
        <p className="text-zinc-500 dark:text-zinc-400">
          Preencha o briefing e a IA gerará sua planta baixa automaticamente.
        </p>
      </div>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2, 3].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                step === s
                  ? "bg-violet-600 text-white"
                  : step > s
                  ? "bg-emerald-500 text-white"
                  : "bg-zinc-200 dark:bg-zinc-700 text-zinc-500"
              )}
            >
              {s}
            </div>
            {s < 3 && (
              <div
                className={cn(
                  "h-0.5 w-16 transition-colors",
                  step > s ? "bg-emerald-500" : "bg-zinc-200 dark:bg-zinc-700"
                )}
              />
            )}
          </div>
        ))}
        <span className="ml-2 text-sm text-zinc-500">
          {step === 1 && "Informações básicas"}
          {step === 2 && "Cômodos"}
          {step === 3 && "Revisão e geração"}
        </span>
      </div>

      {/* Step 1: Basic info */}
      {step === 1 && (
        <div className="space-y-5 bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Nome do projeto
            </label>
            <input
              type="text"
              placeholder="Ex: Casa Família Silva"
              value={briefing.projectName}
              onChange={(e) => setBriefing((b) => ({ ...b, projectName: e.target.value }))}
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Área total (m²)
              </label>
              <input
                type="number"
                min={30}
                max={2000}
                value={briefing.totalArea}
                onChange={(e) =>
                  setBriefing((b) => ({ ...b, totalArea: Number(e.target.value) }))
                }
                className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Pavimentos
              </label>
              <select
                value={briefing.floors}
                onChange={(e) =>
                  setBriefing((b) => ({ ...b, floors: Number(e.target.value) }))
                }
                className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                <option value={1}>Térrea (1 pavimento)</option>
                <option value={2}>Sobrado (2 pavimentos)</option>
                <option value={3}>3 pavimentos</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Largura do terreno (m)
              </label>
              <input
                type="number"
                min={5}
                value={briefing.terrainWidth}
                onChange={(e) =>
                  setBriefing((b) => ({ ...b, terrainWidth: Number(e.target.value) }))
                }
                className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
                Profundidade do terreno (m)
              </label>
              <input
                type="number"
                min={10}
                value={briefing.terrainDepth}
                onChange={(e) =>
                  setBriefing((b) => ({ ...b, terrainDepth: Number(e.target.value) }))
                }
                className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
              Estilo arquitetônico
            </label>
            <div className="flex flex-wrap gap-2">
              {STYLES.map((s) => (
                <button
                  key={s}
                  onClick={() => setBriefing((b) => ({ ...b, style: s }))}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium border transition-colors",
                    briefing.style === s
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-white dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:border-zinc-300"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Rooms */}
      {step === 2 && (
        <div className="space-y-4">
          {briefing.rooms.map((room, idx) => (
            <div
              key={idx}
              className="flex items-start gap-3 bg-white dark:bg-zinc-900 p-4 rounded-xl border border-zinc-100 dark:border-zinc-800"
            >
              <select
                value={room.type}
                onChange={(e) => updateRoom(idx, "type", e.target.value)}
                className="flex-1 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              >
                {ROOM_TYPES.map((rt) => (
                  <option key={rt.value} value={rt.value}>
                    {rt.label}
                  </option>
                ))}
              </select>
              <div className="flex items-center gap-2">
                <span className="text-sm text-zinc-500">Qtd:</span>
                <input
                  type="number"
                  min={1}
                  max={10}
                  value={room.count}
                  onChange={(e) => updateRoom(idx, "count", Number(e.target.value))}
                  className="w-16 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 text-center"
                />
              </div>
              <input
                type="text"
                placeholder="Observações..."
                value={room.notes}
                onChange={(e) => updateRoom(idx, "notes", e.target.value)}
                className="flex-1 border border-zinc-200 dark:border-zinc-700 rounded-lg px-3 py-2 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button
                onClick={() => removeRoom(idx)}
                className="p-2 text-zinc-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
          <button
            onClick={addRoom}
            className="flex items-center gap-2 text-sm text-violet-600 hover:text-violet-700 font-medium px-4 py-2.5 border-2 border-dashed border-violet-200 dark:border-violet-800 rounded-xl w-full justify-center transition-colors"
          >
            <Plus className="h-4 w-4" />
            Adicionar cômodo
          </button>
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 space-y-5">
          <h2 className="font-semibold text-zinc-900 dark:text-zinc-50">Resumo do briefing</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-zinc-500">Projeto:</span>{" "}
              <span className="font-medium text-zinc-900 dark:text-zinc-100">
                {briefing.projectName || "Sem nome"}
              </span>
            </div>
            <div>
              <span className="text-zinc-500">Área:</span>{" "}
              <span className="font-medium">{briefing.totalArea}m²</span>
            </div>
            <div>
              <span className="text-zinc-500">Pavimentos:</span>{" "}
              <span className="font-medium">{briefing.floors}</span>
            </div>
            <div>
              <span className="text-zinc-500">Estilo:</span>{" "}
              <span className="font-medium">{briefing.style}</span>
            </div>
            <div>
              <span className="text-zinc-500">Terreno:</span>{" "}
              <span className="font-medium">
                {briefing.terrainWidth}m × {briefing.terrainDepth}m
              </span>
            </div>
          </div>
          <div>
            <div className="text-sm text-zinc-500 mb-2">Cômodos:</div>
            <div className="flex flex-wrap gap-2">
              {briefing.rooms.map((r, i) => {
                const label = ROOM_TYPES.find((rt) => rt.value === r.type)?.label || r.type;
                return (
                  <span
                    key={i}
                    className="bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 text-xs font-medium px-3 py-1 rounded-full border border-violet-100 dark:border-violet-800"
                  >
                    {r.count}x {label}
                  </span>
                );
              })}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Observações adicionais (opcional)
            </label>
            <textarea
              rows={3}
              placeholder="Ex: varanda nos fundos, piscina, acessibilidade, etc."
              value={briefing.observations}
              onChange={(e) => setBriefing((b) => ({ ...b, observations: e.target.value }))}
              className="w-full border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none"
            />
          </div>
          <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 text-sm text-amber-800 dark:text-amber-400">
            <strong>Aviso:</strong> A planta gerada por IA é um anteprojeto. Para execução da obra, é
            necessária validação e assinatura de profissional habilitado com ART/RRT.
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setStep((s) => s - 1)}
          disabled={step === 1}
          className="flex items-center gap-2 text-sm font-medium text-zinc-600 dark:text-zinc-400 disabled:opacity-30 disabled:cursor-not-allowed hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            Próximo
            <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors text-sm"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Gerando planta...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Gerar planta baixa
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
