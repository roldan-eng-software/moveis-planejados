"use client";

export const dynamic = 'force-dynamic';

import { useUser } from "@stackframe/stack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, Send, FileText, MoreVertical } from "lucide-react";
import Link from "next/link";

interface Quote {
  id: string;
  number: string;
  title: string;
  status: string;
  total: number;
  createdAt: string;
  client?: {
    id: string;
    name: string;
    phone: string;
  };
  environments: {
    id: string;
    name: string;
  }[];
}

export default function OrcamentosPage() {
  const user = useUser({ or: "redirect" });
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    fetchQuotes();
  }, [statusFilter]);

  async function fetchQuotes() {
    try {
      const url = statusFilter 
        ? `/api/quotes?status=${statusFilter}` 
        : "/api/quotes";
      const response = await fetch(url);
      if (response.ok) {
        const result = await response.json();
        setQuotes(result.quotes || []);
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Tem certeza que deseja excluir este orçamento?")) return;
    
    try {
      const response = await fetch(`/api/quotes/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchQuotes();
      }
    } catch (error) {
      console.error("Error deleting quote:", error);
    }
  }

  const filteredQuotes = quotes.filter((quote) =>
    quote.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
    quote.client?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("pt-BR");
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      DRAFT: "Rascunho",
      PENDING: "Pendente",
      APPROVED: "Aprovado",
      REJECTED: "Rejeitado",
      EXPIRED: "Expirado",
      CANCELLED: "Cancelado",
    };
    return labels[status] || status;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      DRAFT: "bg-gray-100 text-gray-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      APPROVED: "bg-green-100 text-green-800",
      REJECTED: "bg-red-100 text-red-800",
      EXPIRED: "bg-orange-100 text-orange-800",
      CANCELLED: "bg-red-100 text-red-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-primary">Orçamentos</h1>
          <p className="text-text-secondary">Gerencie seus orçamentos e propostas</p>
        </div>
        <Link href="/app/orcamentos/novo">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Novo Orçamento
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-text-secondary">Total de Orçamentos</p>
            <p className="text-2xl font-bold text-primary">{quotes.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-text-secondary">Pendentes</p>
            <p className="text-2xl font-bold text-yellow-600">
              {quotes.filter(q => q.status === "PENDING").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-text-secondary">Aprovados</p>
            <p className="text-2xl font-bold text-green-600">
              {quotes.filter(q => q.status === "APPROVED").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-sm text-text-secondary">Valor Total</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(quotes.reduce((sum, q) => sum + parseFloat(q.total.toString()), 0))}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 flex-col sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar orçamentos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Todos os status</option>
              <option value="DRAFT">Rascunho</option>
              <option value="PENDING">Pendente</option>
              <option value="APPROVED">Aprovado</option>
              <option value="REJECTED">Rejeitado</option>
              <option value="EXPIRED">Expirado</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <div className="text-center py-8">Carregando...</div>
      ) : filteredQuotes.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 mx-auto text-text-secondary mb-4" />
            <p className="text-text-secondary">
              {searchTerm || statusFilter 
                ? "Nenhum orçamento encontrado." 
                : "Nenhum orçamento ainda. Crie seu primeiro orçamento!"}
            </p>
            {!searchTerm && !statusFilter && (
              <Link href="/app/orcamentos/novo">
                <Button className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Criar Orçamento
                </Button>
              </Link>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-stone-200">
                <th className="text-left p-4 font-medium text-text-secondary">Nº</th>
                <th className="text-left p-4 font-medium text-text-secondary">Título</th>
                <th className="text-left p-4 font-medium text-text-secondary">Cliente</th>
                <th className="text-left p-4 font-medium text-text-secondary">Ambientes</th>
                <th className="text-left p-4 font-medium text-text-secondary">Status</th>
                <th className="text-left p-4 font-medium text-text-secondary">Valor</th>
                <th className="text-left p-4 font-medium text-text-secondary">Data</th>
                <th className="text-right p-4 font-medium text-text-secondary">Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuotes.map((quote) => (
                <tr key={quote.id} className="border-b border-stone-100 hover:bg-stone-50">
                  <td className="p-4 font-medium">{quote.number}</td>
                  <td className="p-4">{quote.title}</td>
                  <td className="p-4">{quote.client?.name || "Sem cliente"}</td>
                  <td className="p-4">
                    <div className="flex gap-1 flex-wrap">
                      {quote.environments.slice(0, 2).map((env) => (
                        <span key={env.id} className="text-xs bg-stone-100 px-2 py-1 rounded">
                          {env.name}
                        </span>
                      ))}
                      {quote.environments.length > 2 && (
                        <span className="text-xs text-text-secondary">
                          +{quote.environments.length - 2}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-block text-xs px-2 py-1 rounded-full ${getStatusColor(quote.status)}`}>
                      {getStatusLabel(quote.status)}
                    </span>
                  </td>
                  <td className="p-4 font-medium">{formatCurrency(quote.total)}</td>
                  <td className="p-4 text-text-secondary">{formatDate(quote.createdAt)}</td>
                  <td className="p-4">
                    <div className="flex justify-end gap-1">
                      <Link href={`/app/orcamentos/${quote.id}`}>
                        <Button variant="ghost" size="sm" className="p-1">
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Link href={`/app/orcamentos/${quote.id}/editar`}>
                        <Button variant="ghost" size="sm" className="p-1">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      {quote.status === "DRAFT" && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-1 text-blue-500"
                          title="Enviar orçamento"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-1 text-red-500"
                        onClick={() => handleDelete(quote.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
