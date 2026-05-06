"use client";

import { useState } from "react";
import { Building2, HardHat, User } from "lucide-react";

type Role = "CLIENT" | "PROFESSIONAL";

interface RoleCard {
  role: Role;
  icon: React.ElementType;
  title: string;
  description: string;
}

const roles: RoleCard[] = [
  {
    role: "CLIENT",
    icon: User,
    title: "Sou cliente",
    description: "Quero solicitar um projeto de arquitetura ou reforma para minha propriedade.",
  },
  {
    role: "PROFESSIONAL",
    icon: HardHat,
    title: "Sou profissional",
    description: "Sou arquiteto, engenheiro ou designer e quero receber projetos e usar a IA.",
  },
];

export default function OnboardingPage() {
  const [selected, setSelected] = useState<Role | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleContinue() {
    if (!selected) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: selected }),
      });
      if (res.ok) {
        // Hard reload garante sessão fresca antes de entrar no dashboard
        window.location.href = "/dashboard";
      } else {
        const data = await res.json();
        setError(data.error ?? "Erro ao salvar. Tente novamente.");
      }
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-6">
      <div className="w-full max-w-lg">
        <div className="flex items-center gap-2 mb-10 justify-center">
          <Building2 className="h-7 w-7 text-primary-600" />
          <span className="text-2xl font-bold">ArqIA</span>
        </div>
        <h1 className="text-3xl font-bold text-center mb-2 text-zinc-900 dark:text-zinc-50">
          Bem-vindo(a)!
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-center mb-8">
          Como você usará a plataforma?
        </p>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {roles.map(({ role, icon: Icon, title, description }) => (
            <button
              key={role}
              onClick={() => setSelected(role)}
              className={`p-6 rounded-2xl border-2 text-left transition-all ${
                selected === role
                  ? "border-primary-600 bg-primary-50 dark:bg-primary-950/30"
                  : "border-border bg-surface hover:border-zinc-300 dark:hover:border-zinc-600"
              }`}
            >
              <Icon
                className={`h-8 w-8 mb-3 ${
                  selected === role ? "text-primary-600" : "text-zinc-500"
                }`}
              />
              <div className="font-semibold text-zinc-900 dark:text-zinc-50 mb-1">{title}</div>
              <div className="text-sm text-zinc-600 dark:text-zinc-400">{description}</div>
            </button>
          ))}
        </div>
        <button
          onClick={handleContinue}
          disabled={!selected || loading}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition-colors"
        >
          {loading ? "Configurando..." : "Continuar"}
        </button>
        {error && <p className="text-sm text-red-500 text-center mt-3">{error}</p>}
      </div>
    </div>
  );
}
