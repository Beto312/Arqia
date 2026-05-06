"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserMenu } from "./user-menu";
import {
  Building2,
  LayoutDashboard,
  FolderOpen,
  Sparkles,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/projects", icon: FolderOpen, label: "Projetos" },
  { href: "/dashboard/generate", icon: Sparkles, label: "Gerar com IA" },
  { href: "/marketplace", icon: Users, label: "Profissionais" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/settings", icon: Settings, label: "Configurações" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 border-r border-zinc-200 dark:border-zinc-800 bg-surface flex flex-col">
      <div className="p-5 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Building2 className="h-6 w-6 text-primary-600" />
          <span className="text-lg font-bold tracking-tight">ArqIA</span>
        </Link>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {navItems.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === href
                ? "bg-primary-50 dark:bg-primary-950/40 text-primary-700 dark:text-primary-400"
                : "text-zinc-600 dark:text-zinc-400 hover:bg-primary-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-border">
        <UserMenu />
      </div>
    </aside>
  );
}
