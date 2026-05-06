"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function SignUpPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    // Se confirmação de e-mail estiver desativada no Supabase, a sessão já existe
    if (data.session) {
      router.push("/onboarding");
      router.refresh();
    } else {
      setDone(true);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-6">
        <div className="w-full max-w-sm text-center">
          <Building2 className="h-10 w-10 text-primary-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-50 mb-2">Confirme seu e-mail</h1>
          <p className="text-zinc-500 text-sm">
            Enviamos um link de confirmação para <strong>{email}</strong>. Acesse seu e-mail e clique no
            link para ativar sua conta.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <Building2 className="h-7 w-7 text-primary-600" />
          <span className="text-2xl font-bold">ArqIA</span>
        </div>
        <h1 className="text-2xl font-bold text-center mb-1 text-zinc-900 dark:text-zinc-50">Criar conta</h1>
        <p className="text-zinc-500 text-center mb-6 text-sm">É rápido e gratuito</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Nome completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              E-mail
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3.5 py-2.5 rounded-xl border border-border bg-surface text-zinc-900 dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-colors text-sm"
          >
            {loading ? "Criando conta..." : "Criar conta"}
          </button>
        </form>
        <p className="text-center text-sm text-zinc-500 mt-6">
          Já tem conta?{" "}
          <Link href="/sign-in" className="text-primary-600 hover:text-primary-700 font-medium">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}
