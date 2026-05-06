export const dynamic = "force-dynamic";
import { db } from "@/lib/db";
import { Star, MapPin, Award } from "lucide-react";
import Link from "next/link";

export default async function MarketplacePage() {
  const professionals = await db.user.findMany({
    where: { role: "PROFESSIONAL" },
    include: { profile: true },
    take: 20,
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-surface border-b border-border">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Profissionais Habilitados
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Arquitetos, engenheiros e designers verificados prontos para revisar e assinar seu projeto.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        {professionals.length === 0 ? (
          <div className="text-center py-20 text-zinc-500">
            Nenhum profissional cadastrado ainda.
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-5">
            {professionals.map((pro) => (
              <div
                key={pro.id}
                className="bg-surface border border-border rounded-2xl p-6 hover:border-primary-200 dark:hover:border-primary-800 transition-colors"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="h-12 w-12 bg-primary-100 dark:bg-primary-950/40 rounded-full flex items-center justify-center text-lg font-bold text-primary-700 dark:text-primary-400">
                    {(pro.name || pro.email)[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="font-semibold text-zinc-900 dark:text-zinc-50">
                      {pro.name || "Profissional"}
                    </div>
                    <div className="text-sm text-zinc-500 flex items-center gap-1 mt-0.5">
                      <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                      {pro.profile?.rating.toFixed(1) || "0.0"} ({pro.profile?.reviewCount || 0} avaliações)
                    </div>
                  </div>
                </div>
                {pro.profile?.specialties && pro.profile.specialties.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {pro.profile.specialties.slice(0, 3).map((s) => (
                      <span
                        key={s}
                        className="text-xs bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 px-2.5 py-0.5 rounded-full"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                )}
                {pro.profile?.city && (
                  <div className="text-sm text-zinc-500 flex items-center gap-1 mb-3">
                    <MapPin className="h-3.5 w-3.5" />
                    {pro.profile.city}, {pro.profile.state}
                  </div>
                )}
                {(pro.profile?.creaNumber || pro.profile?.cabNumber) && (
                  <div className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mb-4">
                    <Award className="h-3.5 w-3.5" />
                    {pro.profile.creaNumber ? `CREA ${pro.profile.creaNumber}` : ""}
                    {pro.profile.cabNumber ? `CAU ${pro.profile.cabNumber}` : ""}
                  </div>
                )}
                <Link
                  href={`/marketplace/${pro.id}`}
                  className="block text-center w-full border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-950/30 font-medium py-2 rounded-lg text-sm transition-colors"
                >
                  Ver perfil
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
