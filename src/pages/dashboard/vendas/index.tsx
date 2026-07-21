import { useEffect, useState } from "react"
import { supabase } from "../../../services/supabaseClient"
import Container from "../../../components/container"
import DashboardHeader from "../../../components/panelheader"
import { FiMessageSquare } from "react-icons/fi"

interface SellRequest {
  id: string
  nome: string
  telefone: string
  email: string
  marca: string
  modelo: string
  ano: string
  km: string
  preco: string
  mensagem: string | null
  status: string
  created_at: string
}

const statusLabels: Record<string, string> = {
  pending: "Pendente",
  contacted: "Contatado",
  completed: "Concluído",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  contacted: "bg-blue-100 text-blue-800 border-blue-300",
  completed: "bg-green-100 text-green-800 border-green-300",
}

export default function Vendas() {
  const [requests, setRequests] = useState<SellRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState("")

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    let query = supabase
      .from("sell_requests")
      .select("*")
      .order("created_at", { ascending: false })

    if (filterStatus) {
      query = query.eq("status", filterStatus)
    }

    const { data } = await query
    if (data) setRequests(data as SellRequest[])
    setLoading(false)
  }

  useEffect(() => {
    loadRequests()
  }, [filterStatus])

  async function handleStatusChange(id: string, newStatus: string) {
    const { error } = await supabase
      .from("sell_requests")
      .update({ status: newStatus })
      .eq("id", id)

    if (!error) {
      setRequests(prev =>
        prev.map(r => (r.id === id ? { ...r, status: newStatus } : r))
      )
    }
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  function formatPrice(price: string) {
    return Number(price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  return (
    <Container>
      <div className="min-h-[calc(100vh-64px)] flex flex-col">
        <DashboardHeader />

        <div className="flex-1 flex flex-col gap-6">
          <div className="bg-white rounded-lg p-4 flex items-center justify-between shadow-sm border border-zinc-200">
            <h1 className="text-lg font-bold text-zinc-800">Pedidos de Venda</h1>
            <div className="flex items-center gap-2">
              <label className="text-sm text-zinc-500">Filtrar:</label>
              <select
                className="border border-zinc-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="">Todos</option>
                <option value="pending">Pendente</option>
                <option value="contacted">Contatado</option>
                <option value="completed">Concluído</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin h-8 w-8 border-4 border-zinc-800 border-t-transparent rounded-full" />
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-zinc-500 bg-white rounded-lg shadow-sm border border-zinc-200">
              <FiMessageSquare size={64} className="mb-4 text-zinc-300" />
              <p className="text-lg font-medium mb-1">Nenhum pedido de venda</p>
              <p className="text-sm">Quando alguém solicitar uma venda, aparecerá aqui.</p>
            </div>
          ) : (
            <div className="overflow-x-auto bg-white rounded-lg shadow-sm border border-zinc-200">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-200">
                    <th className="text-left px-4 py-3 font-semibold text-zinc-700">Data</th>
                    <th className="text-left px-4 py-3 font-semibold text-zinc-700">Nome</th>
                    <th className="text-left px-4 py-3 font-semibold text-zinc-700">Telefone</th>
                    <th className="text-left px-4 py-3 font-semibold text-zinc-700">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-zinc-700">Veículo</th>
                    <th className="text-left px-4 py-3 font-semibold text-zinc-700">Ano/KM</th>
                    <th className="text-left px-4 py-3 font-semibold text-zinc-700">Preço</th>
                    <th className="text-left px-4 py-3 font-semibold text-zinc-700">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-zinc-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req.id} className="border-b border-zinc-100 hover:bg-zinc-50 transition-colors">
                      <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">{formatDate(req.created_at)}</td>
                      <td className="px-4 py-3 font-medium text-zinc-800">{req.nome}</td>
                      <td className="px-4 py-3">
                        <a
                          href={`https://wa.me/55${req.telefone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-zinc-600 hover:text-red-500 transition-colors"
                          title="Abrir WhatsApp"
                        >
                          {req.telefone}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${req.email}`} className="text-zinc-600 hover:text-red-500 transition-colors">
                          {req.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-zinc-800">{req.marca} {req.modelo}</td>
                      <td className="px-4 py-3 text-zinc-600 whitespace-nowrap">{req.ano} / {req.km} km</td>
                      <td className="px-4 py-3 text-zinc-800 font-semibold">{formatPrice(req.preco)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${statusColors[req.status] || "bg-gray-100 text-gray-800"}`}>
                          {statusLabels[req.status] || req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className="border border-zinc-300 rounded px-2 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-red-400"
                          value={req.status}
                          onChange={e => handleStatusChange(req.id, e.target.value)}
                        >
                          <option value="pending">Pendente</option>
                          <option value="contacted">Contatado</option>
                          <option value="completed">Concluído</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Container>
  )
}
