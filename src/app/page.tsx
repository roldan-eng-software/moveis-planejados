import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="bg-white border-b border-stone-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="text-xl font-bold text-primary">Móveis Planejados</div>
          <Link href="/handler/sign-in">
            <Button variant="outline">Entrar</Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 bg-gradient-to-b from-primary-light to-white">
        <div className="max-w-6xl mx-auto px-6 py-24 flex flex-col items-center justify-center text-center gap-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary leading-tight">
            Sistema de Gestão para Móveis Planejados
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl">
            Simplifique a gestão do seu negócio com orçamentos rápidos, controle de produção e análise financeira em tempo real.
          </p>
          <div className="flex gap-4 pt-6">
            <Link href="/handler/sign-up">
              <Button className="bg-primary hover:bg-primary-hover">Começar Agora</Button>
            </Link>
            <Link href="/handler/sign-in">
              <Button variant="outline">Fazer Login</Button>
            </Link>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-primary">Funcionalidades</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-6 border border-stone-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-primary">Orçamentos</h3>
              <p className="text-text-secondary">Crie e gerencie orçamentos com facilidade, com templates e cálculos automáticos.</p>
            </div>
            <div className="p-6 border border-stone-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-primary">Produção</h3>
              <p className="text-text-secondary">Acompanhe o status de cada projeto em produção com controle de etapas.</p>
            </div>
            <div className="p-6 border border-stone-200 rounded-lg">
              <h3 className="text-xl font-semibold mb-3 text-primary">Financeiro</h3>
              <p className="text-text-secondary">Controle receitas, despesas e gere relatórios financeiros detalhados.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-8 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <p>&copy; 2026 Móveis Planejados. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
