import Link from "next/link";
import { ArrowRight, Building2, Cpu, Users, FileText, Star, CheckCircle2 } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      {/* Nav */}
      <header className="border-b border-zinc-100 dark:border-zinc-800">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-violet-600" />
            <span className="text-xl font-bold tracking-tight">ArqIA</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-600 dark:text-zinc-400">
            <Link href="#features" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Funcionalidades</Link>
            <Link href="#how-it-works" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Como Funciona</Link>
            <Link href="/marketplace" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Profissionais</Link>
            <Link href="/pricing" className="hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors">Planos</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link
              href="/sign-in"
              className="text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Entrar
            </Link>
            <Link
              href="/sign-up"
              className="text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Começar grátis
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-violet-50 dark:bg-violet-950/30 text-violet-700 dark:text-violet-400 text-xs font-semibold px-3 py-1.5 rounded-full mb-8 border border-violet-200 dark:border-violet-800">
          <Cpu className="h-3.5 w-3.5" />
          Powered by Claude AI
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-6 leading-tight">
          Projetos de arquitetura
          <br />
          <span className="text-violet-600">gerados por IA</span>
        </h1>
        <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Descreva sua obra em linguagem natural. A ArqIA gera plantas baixas,
          esquemas estruturais e renders de interiores em minutos — revisados por
          profissionais habilitados.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-base"
          >
            Gerar meu projeto agora
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-300 dark:hover:border-zinc-600 text-zinc-700 dark:text-zinc-300 font-semibold px-8 py-4 rounded-xl transition-colors text-base"
          >
            <Users className="h-4 w-4" />
            Encontrar profissionais
          </Link>
        </div>
        {/* Social proof */}
        <div className="mt-12 flex items-center justify-center gap-6 text-sm text-zinc-500 dark:text-zinc-500">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            Sem necessidade de CAD
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            NBR 15575 respeitada
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            ART/RRT inclusa no plano Pro
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-zinc-50 dark:bg-zinc-900/50 py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
              Tudo que seu projeto precisa
            </h2>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Da descrição ao projeto executivo, em uma única plataforma.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((f) => (
              <div
                key={f.title}
                className="bg-white dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-100 dark:border-zinc-800 hover:border-violet-200 dark:hover:border-violet-800 transition-colors"
              >
                <div className="h-12 w-12 bg-violet-50 dark:bg-violet-950/50 rounded-xl flex items-center justify-center mb-6">
                  <f.icon className="h-6 w-6 text-violet-600" />
                </div>
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50 mb-2">{f.title}</h3>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 mb-4">
              Como funciona
            </h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div key={step.title} className="text-center">
                <div className="h-12 w-12 bg-violet-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {i + 1}
                </div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-50 mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-violet-600 py-20">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Pronto para começar seu projeto?
          </h2>
          <p className="text-violet-200 text-lg mb-8">
            Crie sua conta gratuitamente e gere seu primeiro anteprojeto em minutos.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center gap-2 bg-white text-violet-700 font-bold px-8 py-4 rounded-xl hover:bg-violet-50 transition-colors text-base"
          >
            Criar conta gratuita
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-100 dark:border-zinc-800 py-12">
        <div className="mx-auto max-w-7xl px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-violet-600" />
            <span className="font-bold">ArqIA</span>
          </div>
          <p className="text-sm text-zinc-500">
            © 2026 ArqIA. Projetos gerados por IA exigem ART/RRT para execução.
          </p>
          <div className="flex gap-6 text-sm text-zinc-500">
            <Link href="/privacy" className="hover:text-zinc-700 dark:hover:text-zinc-300">Privacidade</Link>
            <Link href="/terms" className="hover:text-zinc-700 dark:hover:text-zinc-300">Termos</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Building2,
    title: "Planta Baixa 2D com IA",
    description:
      "Descreva sua residência ou comercial em texto. A IA gera plant baixa com cotas, paredes, portas e mobiliário em SVG editável, respeitando normas NBR.",
  },
  {
    icon: FileText,
    title: "Esquema Estrutural",
    description:
      "A partir da planta, o sistema sugere posicionamento de pilares, vigas e lajes como anteprojeto. Exporta em PDF com disclaimer técnico.",
  },
  {
    icon: Star,
    title: "Renders de Interiores",
    description:
      "Escolha o estilo decorativo e veja renders fotorrealistas de cada cômodo. Ambientação 3D navegável integrada.",
  },
  {
    icon: Users,
    title: "Marketplace de Profissionais",
    description:
      "Conecte-se a arquitetos, engenheiros e designers verificados. A IA faz o matching automático por estilo e escopo do projeto.",
  },
  {
    icon: Cpu,
    title: "Revisão Profissional",
    description:
      "Todo projeto passa por revisão e assinatura de profissional habilitado com ART/RRT, garantindo conformidade para execução.",
  },
  {
    icon: CheckCircle2,
    title: "Exportação Completa",
    description:
      "Entregamos PDF, DWG, IFC para BIM, memorial descritivo e lista de materiais com estimativa SINAPI/CUB.",
  },
];

const steps = [
  {
    title: "Descreva seu projeto",
    description: "Informe área, cômodos, estilo e necessidades em linguagem natural.",
  },
  {
    title: "IA gera os artefatos",
    description: "Planta 2D, esquema estrutural e renders são gerados automaticamente.",
  },
  {
    title: "Profissional revisa",
    description: "Um arquiteto ou engenheiro habilitado revisa e valida o projeto.",
  },
  {
    title: "Entrega completa",
    description: "Receba o pacote completo com todos os documentos para execução.",
  },
];
