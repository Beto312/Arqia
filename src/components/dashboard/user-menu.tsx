"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

export function UserMenu() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setEmail(data.user.email ?? "");
    });
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/sign-in");
    router.refresh();
  }

  const initial = email.charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2 w-full">
      <div className="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
        {initial}
      </div>
      <span className="text-sm text-zinc-600 dark:text-zinc-400 truncate flex-1">{email}</span>
      <button
        onClick={handleSignOut}
        className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
        title="Sair"
      >
        <LogOut className="h-4 w-4" />
      </button>
    </div>
  );
}
