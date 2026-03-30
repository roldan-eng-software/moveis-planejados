"use client";

export const dynamic = 'force-dynamic';

import { useUser } from "@stackframe/stack";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Plus, Trash2, Save, ArrowLeft, Package, Home, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
}

interface QuoteItem {
  id: string;
  name: string;
  description: string;
  category: string;
  quantity: number;
  unit: string;
  unitCost: number;
  unitPrice: number;
  totalCost: number;
  totalPrice: number;
  marginPercent: number;
}

interface QuoteEnvironment {
  id: string;
  name: string;
  description: string;
  items: QuoteItem[];
  isExpanded: boolean;
}

const ENVIRONMENT_TYPES = [
  { value: "cozinha", label: "Cozinha" },
  { value: "quarto", label: "Quarto" },
  { value: "sala", label: "Sala" },
  { value: "banheiro", label: "Banheiro" },
  { value: "escritorio", label: "Escritório" },
  { value: "lavanderia", label: "Lavanderia" },
  { value: "varanda", label: "Varanda" },
  { value: "outro", label: "Outro" },
];

const DEFAULT_TEMPLATES: Record<string, any[]> = {
  cozinha: [
    { name: "Bandejas", category: "Estrutura", unitCost: 150, unitPrice: 280 },
    { name: "Portas de abrir", category: "Portas", unitCost: 200, unitPrice: 380 },
    { name: "Portas de correr (par)", category: "Portas", unitCost: 350, unitPrice: 650 },
    { name: "Gavetas", category: "Gavetas", unitCost: 120, unitPrice: 220 },
    { name: "Prateleiras", category: "Prateleiras", unitCost: 80, unitPrice: 150 },
    { name: "Nichos", category: "Nichos", unitCost: 100, unitPrice: 190 },
    { name: "Puxadores (pç)", category: "Acessórios", unitCost: 15, unitPrice: 35 },
    { name: "Corrediças", category: "Ferragens", unitCost: 45, unitPrice: 85 },
    { name: "Dobradiças", category: "Ferragens", unitCost: 12, unitPrice: 25 },
    { name: "Divisórias para gavetas", category: "Organização", unitCost: 25, unitPrice: 50 },
    { name: "Porta-talheres", category: "Organização", unitCost: 35, unitPrice: 70 },
    { name: "Porta-panos", category: "Organização", unitCost: 30, unitPrice: 60 },
  ],
  quarto: [
    { name: "Armário de casal", category: "Estrutura", unitCost: 800, unitPrice: 1500 },
    { name: "Armário de solteiro", category: "Estrutura", unitCost: 500, unitPrice: 950 },
    { name: "Guarda-roupa de casal", category: "Estrutura", unitCost: 1200, unitPrice: 2200 },
    { name: "Cama com baú", category: "Estrutura", unitCost: 700, unitPrice: 1300 },
    { name: "Criado-mudo", category: "Móvel", unitCost: 180, unitPrice: 350 },
    { name: "Penteadeira", category: "Móvel", unitCost: 350, unitPrice: 650 },
    { name: "Nichos decorativos", category: "Nichos", unitCost: 80, unitPrice: 150 },
    { name: "Estantes", category: "Estrutura", unitCost: 250, unitPrice: 480 },
    { name: "Porta de correr", category: "Portas", unitCost: 400, unitPrice: 750 },
    { name: "Espelhos", category: "Acessórios", unitCost: 100, unitPrice: 200 },
  ],
  sala: [
    { name: "Painel de TV", category: "Estrutura", unitCost: 350, unitPrice: 650 },
    { name: "Estante de sala", category: "Estrutura", unitCost: 500, unitPrice: 950 },
    { name: "Mesa de centro", category: "Móvel", unitCost: 280, unitPrice: 520 },
    { name: "Mesa lateral", category: "Móvel", unitCost: 150, unitPrice: 280 },
    { name: "Rack", category: "Estrutura", unitCost: 400, unitPrice: 750 },
    { name: "Armário de TV", category: "Estrutura", unitCost: 450, unitPrice: 850 },
    { name: "Porta de correr", category: "Portas", unitCost: 350, unitPrice: 650 },
    { name: "Nichos", category: "Nichos", unitCost: 80, unitPrice: 150 },
    { name: "Prateleiras", category: "Prateleiras", unitCost: 60, unitPrice: 120 },
  ],
  banheiro: [
    { name: "Armário de banheiro", category: "Estrutura", unitCost: 400, unitPrice: 750 },
    { name: "Gabinete", category: "Estrutura", unitCost: 350, unitPrice: 650 },
    { name: "Espelheira", category: "Acessórios", unitCost: 100, unitPrice: 190 },
    { name: "Nichos", category: "Nichos", unitCost: 80, unitPrice: 150 },
    { name: "Portas", category: "Portas", unitCost: 180, unitPrice: 350 },
    { name: "Gavetas", category: "Gavetas", unitCost: 120, unitPrice: 220 },
  ],
  escritorio: [
    { name: "Escrivaninha", category: "Móvel", unitCost: 350, unitPrice: 650 },
    { name: "Mesa de escritório", category: "Móvel", unitCost: 400, unitPrice: 750 },
    { name: "Armário de escritório", category: "Estrutura", unitCost: 450, unitPrice: 850 },
    { name: "Estante", category: "Estrutura", unitCost: 300, unitPrice: 550 },
    { name: "Prateleiras", category: "Prateleiras", unitCost: 60, unitPrice: 120 },
    { name: "Gaveteiro", category: "Organização", unitCost: 150, unitPrice: 280 },
    { name: "Porta de correr", category: "Portas", unitCost: 300, unitPrice: 550 },
  ],
};

export default function NovoOrcamentoPage() {
  const router = useRouter();
  const user = useUser({ or: "redirect" });
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    clientId: "",
    title: "",
    validityDate: "",
    notes: "",
    terms: "",
    marginPercent: 30,
    discountPercent: 0,
  });

  const [environments, setEnvironments] = useState<QuoteEnvironment[]>([]);

  useEffect(() => {
    fetchClients();
  }, []);

  async function fetchClients() {
    try {
      const response = await fetch("/api/clients");
      if (response.ok) {
        const result = await response.json();
        setClients(result.clients || []);
      }
    } catch (error) {
      console.error("Error fetching clients:", error);
    } finally {
      setLoading(false);
    }
  }

  function addEnvironment(type?: string) {
    const newEnv: QuoteEnvironment = {
      id: `env-${Date.now()}`,
      name: type ? ENVIRONMENT_TYPES.find(t => t.value === type)?.label || "Novo Ambiente" : "Novo Ambiente",
      description: "",
      items: [],
      isExpanded: true,
    };
    setEnvironments([...environments, newEnv]);
  }

  function removeEnvironment(envId: string) {
    setEnvironments(environments.filter(e => e.id !== envId));
  }

  function toggleEnvironment(envId: string) {
    setEnvironments(environments.map(e => 
      e.id === envId ? { ...e, isExpanded: !e.isExpanded } : e
    ));
  }

  function addItem(envId: string, template?: any) {
    const newItem: QuoteItem = {
      id: `item-${Date.now()}`,
      name: template?.name || "Novo item",
      description: template?.description || "",
      category: template?.category || "",
      quantity: 1,
      unit: "un",
      unitCost: template?.unitCost || 0,
      unitPrice: template?.unitPrice || 0,
      totalCost: template?.unitCost || 0,
      totalPrice: template?.unitPrice || 0,
      marginPercent: formData.marginPercent,
    };
    
    setEnvironments(environments.map(e => 
      e.id === envId 
        ? { ...e, items: [...e.items, newItem] }
        : e
    ));
  }

  function updateItem(envId: string, itemId: string, field: string, value: any) {
    setEnvironments(environments.map(e => {
      if (e.id !== envId) return e;
      
      const updatedItems = e.items.map(item => {
        if (item.id !== itemId) return item;
        
        const updated = { ...item, [field]: value };
        
        if (field === "quantity" || field === "unitPrice" || field === "unitCost") {
          updated.totalPrice = (parseFloat(updated.quantity.toString()) || 0) * (parseFloat(updated.unitPrice.toString()) || 0);
          updated.totalCost = (parseFloat(updated.quantity.toString()) || 0) * (parseFloat(updated.unitCost.toString()) || 0);
        }
        
        return updated;
      });
      
      return { ...e, items: updatedItems };
    }));
  }

  function removeItem(envId: string, itemId: string) {
    setEnvironments(environments.map(e => 
      e.id === envId 
        ? { ...e, items: e.items.filter(i => i.id !== itemId) }
        : e
    ));
  }

  function applyTemplate(envId: string, templateType: string) {
    const templates = DEFAULT_TEMPLATES[templateType] || [];
    const items: QuoteItem[] = templates.map((template, index) => ({
      id: `item-${Date.now()}-${index}`,
      name: template.name,
      description: "",
      category: template.category,
      quantity: 1,
      unit: "un",
      unitCost: template.unitCost,
      unitPrice: template.unitPrice,
      totalCost: template.unitCost,
      totalPrice: template.unitPrice,
      marginPercent: formData.marginPercent,
    }));
    
    setEnvironments(environments.map(e => 
      e.id === envId 
        ? { ...e, name: ENVIRONMENT_TYPES.find(t => t.value === templateType)?.label || e.name, items: [...e.items, ...items] }
        : e
    ));
  }

  const calculateTotals = () => {
    let subtotal = 0;
    let totalCost = 0;
    
    environments.forEach(env => {
      env.items.forEach(item => {
        subtotal += item.totalPrice;
        totalCost += item.totalCost;
      });
    });
    
    const discountValue = subtotal * (parseFloat(formData.discountPercent.toString()) || 0) / 100;
    const total = subtotal - discountValue;
    const profit = total - totalCost;
    const profitMargin = total > 0 ? (profit / total) * 100 : 0;
    
    return { subtotal, totalCost, discountValue, total, profit, profitMargin };
  };

  const totals = calculateTotals();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        ...formData,
        environments: environments.map(env => ({
          name: env.name,
          description: env.description,
          items: env.items.map(item => ({
            name: item.name,
            description: item.description,
            category: item.category,
            quantity: item.quantity,
            unit: item.unit,
            unitCost: item.unitCost,
            unitPrice: item.unitPrice,
            marginPercent: item.marginPercent,
          })),
        })),
      };

      const response = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        router.push("/app/orcamentos");
      } else {
        const error = await response.json();
        alert(error.error || "Erro ao criar orçamento");
      }
    } catch (error) {
      console.error("Error creating quote:", error);
      alert("Erro ao criar orçamento");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="p-8 text-center">Carregando...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <Link href="/app/orcamentos">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-primary">Novo Orçamento</h1>
            <p className="text-text-secondary">Crie um novo orçamento detalhado</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/app/orcamentos">
            <Button type="button" variant="outline">Cancelar</Button>
          </Link>
          <Button type="submit" disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Salvando..." : "Salvar Orçamento"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Orçamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Cliente *
                </label>
                <select
                  value={formData.clientId}
                  onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>
                      {client.name} {client.phone ? `(${client.phone})` : ""}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Título do Orçamento *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ex: Reforma Cozinha + Quarto"
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Validade
                  </label>
                  <input
                    type="date"
                    value={formData.validityDate}
                    onChange={(e) => setFormData({ ...formData, validityDate: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-1">
                    Margem Padrão (%)
                  </label>
                  <input
                    type="number"
                    value={formData.marginPercent}
                    onChange={(e) => setFormData({ ...formData, marginPercent: parseFloat(e.target.value) || 0 })}
                    min="0"
                    max="100"
                    className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Ambientes</CardTitle>
                <div className="flex gap-2">
                  <select
                    onChange={(e) => {
                      if (e.target.value) {
                        addEnvironment(e.target.value);
                        e.target.value = "";
                      }
                    }}
                    className="px-3 py-1 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    value=""
                  >
                    <option value="">Adicionar ambiente...</option>
                    {ENVIRONMENT_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <Button type="button" variant="outline" size="sm" onClick={() => addEnvironment()}>
                    <Plus className="w-4 h-4 mr-1" />
                    Manual
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {environments.length === 0 ? (
                <p className="text-center text-text-secondary py-8">
                  Nenhum ambiente adicionado. Adicione ambientes para incluir itens no orçamento.
                </p>
              ) : (
                environments.map((env, envIndex) => (
                  <div key={env.id} className="border border-stone-200 rounded-lg">
                    <div 
                      className="flex items-center justify-between p-4 bg-stone-50 cursor-pointer"
                      onClick={() => toggleEnvironment(env.id)}
                    >
                      <div className="flex items-center gap-2">
                        {env.isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                        <Home className="w-5 h-5 text-primary" />
                        <span className="font-medium">{env.name}</span>
                        <span className="text-sm text-text-secondary">
                          ({env.items.length} {env.items.length === 1 ? "item" : "itens"})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-primary">
                          {formatCurrency(env.items.reduce((sum, item) => sum + item.totalPrice, 0))}
                        </span>
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="sm" 
                          className="p-1 text-red-500"
                          onClick={(e) => { e.stopPropagation(); removeEnvironment(env.id); }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {env.isExpanded && (
                      <div className="p-4 space-y-4">
                        <div className="flex gap-4">
                          <div className="flex-1">
                            <input
                              type="text"
                              value={env.name}
                              onChange={(e) => {
                                const newEnvs = [...environments];
                                newEnvs[envIndex].name = e.target.value;
                                setEnvironments(newEnvs);
                              }}
                              placeholder="Nome do ambiente"
                              className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                          </div>
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                applyTemplate(env.id, e.target.value);
                                e.target.value = "";
                              }
                            }}
                            className="px-3 py-2 border border-stone-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                            value=""
                          >
                            <option value="">Aplicar template...</option>
                            {ENVIRONMENT_TYPES.map(type => (
                              <option key={type.value} value={type.value}>{type.label}</option>
                            ))}
                          </select>
                        </div>

                        {env.items.length > 0 && (
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b border-stone-200">
                                  <th className="text-left p-2">Item</th>
                                  <th className="text-left p-2">Categoria</th>
                                  <th className="text-left p-2 w-20">Qtd</th>
                                  <th className="text-left p-2 w-20">Unit.</th>
                                  <th className="text-right p-2 w-28">Custo</th>
                                  <th className="text-right p-2 w-28">Preço</th>
                                  <th className="text-right p-2 w-28">Total</th>
                                  <th className="p-2 w-10"></th>
                                </tr>
                              </thead>
                              <tbody>
                                {env.items.map((item, itemIndex) => (
                                  <tr key={item.id} className="border-b border-stone-100">
                                    <td className="p-2">
                                      <input
                                        type="text"
                                        value={item.name}
                                        onChange={(e) => updateItem(env.id, item.id, "name", e.target.value)}
                                        className="w-full px-2 py-1 border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                      />
                                    </td>
                                    <td className="p-2">
                                      <input
                                        type="text"
                                        value={item.category}
                                        onChange={(e) => updateItem(env.id, item.id, "category", e.target.value)}
                                        className="w-full px-2 py-1 border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                      />
                                    </td>
                                    <td className="p-2">
                                      <input
                                        type="number"
                                        value={item.quantity}
                                        onChange={(e) => updateItem(env.id, item.id, "quantity", parseFloat(e.target.value) || 0)}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-2 py-1 border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                      />
                                    </td>
                                    <td className="p-2">
                                      <select
                                        value={item.unit}
                                        onChange={(e) => updateItem(env.id, item.id, "unit", e.target.value)}
                                        className="w-full px-2 py-1 border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                                      >
                                        <option value="un">un</option>
                                        <option value="m">m</option>
                                        <option value="m²">m²</option>
                                        <option value="m³">m³</option>
                                        <option value="pç">pç</option>
                                        <option value="kit">kit</option>
                                      </select>
                                    </td>
                                    <td className="p-2">
                                      <input
                                        type="number"
                                        value={item.unitCost}
                                        onChange={(e) => updateItem(env.id, item.id, "unitCost", parseFloat(e.target.value) || 0)}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-2 py-1 border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-primary text-right"
                                      />
                                    </td>
                                    <td className="p-2">
                                      <input
                                        type="number"
                                        value={item.unitPrice}
                                        onChange={(e) => updateItem(env.id, item.id, "unitPrice", parseFloat(e.target.value) || 0)}
                                        min="0"
                                        step="0.01"
                                        className="w-full px-2 py-1 border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-primary text-right"
                                      />
                                    </td>
                                    <td className="p-2 text-right font-medium">
                                      {formatCurrency(item.totalPrice)}
                                    </td>
                                    <td className="p-2">
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="p-1 text-red-500"
                                        onClick={() => removeItem(env.id, item.id)}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </Button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}

                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => addItem(env.id)}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Adicionar Item
                        </Button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Observações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Observações Internas
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  rows={3}
                  placeholder="Notas internas sobre este orçamento..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-primary mb-1">
                  Termos e Condições
                </label>
                <textarea
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                  rows={3}
                  placeholder="Condições de pagamento, prazo de entrega, etc..."
                  className="w-full px-3 py-2 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Resumo do Orçamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-text-secondary">Subtotal</span>
                <span className="font-medium">{formatCurrency(totals.subtotal)}</span>
              </div>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-text-secondary">Desconto (%)</span>
                <input
                  type="number"
                  value={formData.discountPercent}
                  onChange={(e) => setFormData({ ...formData, discountPercent: parseFloat(e.target.value) || 0 })}
                  min="0"
                  max="100"
                  className="w-20 px-2 py-1 border border-stone-200 rounded text-right focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              
              {totals.discountValue > 0 && (
                <div className="flex justify-between text-sm text-red-500">
                  <span>Desconto</span>
                  <span>-{formatCurrency(totals.discountValue)}</span>
                </div>
              )}
              
              <div className="border-t border-stone-200 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(totals.total)}</span>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Custo Total</span>
                  <span>{formatCurrency(totals.totalCost)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Lucro</span>
                  <span className={totals.profit >= 0 ? "text-green-600" : "text-red-600"}>
                    {formatCurrency(totals.profit)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Margem</span>
                  <span className={totals.profitMargin >= 0 ? "text-green-600" : "text-red-600"}>
                    {totals.profitMargin.toFixed(1)}%
                  </span>
                </div>
              </div>

              <div className="border-t border-stone-200 pt-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-text-secondary">Ambientes</p>
                    <p className="font-medium">{environments.length}</p>
                  </div>
                  <div>
                    <p className="text-text-secondary">Itens Total</p>
                    <p className="font-medium">
                      {environments.reduce((sum, env) => sum + env.items.length, 0)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
