"use client";

import { useUser } from "@stackframe/stack";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@stackframe/stack";
import { ReactNode } from "react";
import { Suspense } from "react";

const navItems = [
  { label: "Dashboard", href: "/app/dashboard" },
  { label: "Orçamentos", href: "/app/orcamentos" },
  { label: "Clientes", href: "/app/clientes" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex bg-background">
      <aside className="w-64 bg-white border-r border-stone-200 flex flex-col">
        <div className="p-6 border-b border-stone-200">
          <h1 className="text-lg font-bold text-primary">Móveis Planejados</h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`block px-4 py-2 rounded-lg transition-colors ${
                pathname === item.href
                  ? "bg-primary-light text-primary font-medium"
                  : "text-text-primary hover:bg-stone-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-stone-200 space-y-3">
          <Suspense fallback={<div>Loading...</div>}>
            <UserInfo />
          </Suspense>
          <UserButton />
        </div>
      </aside>

      <main className="flex-1 flex flex-col">
        <div className="bg-white border-b border-stone-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text-primary">
              {navItems.find((item) => item.href === pathname)?.label || "App"}
            </h2>
          </div>
        </div>

        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}

function UserInfo() {
  const user = useUser({ or: "redirect" });
  
  return (
    <div className="text-sm">
      <p className="text-text-secondary text-xs">Usuário</p>
      <p className="font-medium text-text-primary truncate">{user?.displayName || user?.primaryEmail}</p>
    </div>
  );
}
