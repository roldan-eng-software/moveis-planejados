"use client";

import { useUser } from "@stackframe/stack";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEffect, useState, Suspense } from "react";

interface DashboardData {
  clientsCount: number;
  quotesCount: number;
  productionsCount: number;
  monthlyRevenue: number;
}

function DashboardContent() {
  const user = useUser({ or: "redirect" });
  const [data, setData] = useState<DashboardData>({
    clientsCount: 0,
    quotesCount: 0,
    productionsCount: 0,
    monthlyRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/dashboard");
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold text-primary">Bem-vindo ao Dashboard</h1>
        <p className="text-text-secondary mt-2">
          Olá, {user?.displayName || user?.primaryEmail}! Aqui você pode gerenciar seu negócio.
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-text-secondary">Clientes Ativos</p>
                <p className="text-3xl font-bold text-primary mt-2">{data.clientsCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-text-secondary">Orçamentos Pendentes</p>
                <p className="text-3xl font-bold text-primary mt-2">{data.quotesCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-text-secondary">Em Produção</p>
                <p className="text-3xl font-bold text-primary mt-2">{data.productionsCount}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <p className="text-sm text-text-secondary">Faturamento (Este Mês)</p>
                <p className="text-3xl font-bold text-primary mt-2">{formatCurrency(data.monthlyRevenue)}</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>Seu último histórico de atividades</CardDescription>
            </CardHeader>
            <CardContent>
              {data.clientsCount === 0 && data.quotesCount === 0 && data.productionsCount === 0 ? (
                <p className="text-text-secondary text-center py-8">
                  Nenhuma atividade ainda. Comece adicionando seus primeiros clientes!
                </p>
              ) : (
                <p className="text-text-secondary text-center py-8">Dados carregados com sucesso.</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <DashboardContent />
    </Suspense>
  );
}
