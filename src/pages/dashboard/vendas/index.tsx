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
    <div className="w-full min-h-screen" style={{ background: "var(--bg-main)" }}>
      <Container>
        <div className="min-h-[calc(100vh-64px)] flex flex-col gap-6">
          <DashboardHeader />

          <div
            className="rounded-lg p-4 flex items-center justify-between shadow-sm"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
          >
            <h1 className="text-lg font-bold text-white">Pedidos de Venda</h1>
            <div className="flex items-center gap-2">
              <label className="text-sm" style={{ color: "var(--text-secondary)" }}>Filtrar:</label>
              <select
                className="rounded-lg px-3 py-1.5 text-sm outline-none"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
              >
                <option value="" style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}>Todos</option>
                <option value="pending" style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}>Pendente</option>
                <option value="contacted" style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}>Contatado</option>
                <option value="completed" style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}>Concluído</option>
              </select>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin h-8 w-8 border-4 rounded-full" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
            </div>
          ) : requests.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-16 rounded-lg shadow-sm"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", color: "var(--text-secondary)" }}
            >
              <FiMessageSquare size={64} className="mb-4" style={{ color: "var(--text-muted)" }} />
              <p className="text-lg font-medium mb-1 text-white">Nenhum pedido de venda</p>
              <p className="text-sm">Quando alguém solicitar uma venda, aparecerá aqui.</p>
            </div>
          ) : (
            <div
              className="overflow-x-auto rounded-lg shadow-sm"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
            >
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: "var(--border-default)" }}>
                    <th className="text-left px-4 py-3 font-semibold text-white">Data</th>
                    <th className="text-left px-4 py-3 font-semibold text-white">Nome</th>
                    <th className="text-left px-4 py-3 font-semibold text-white">Telefone</th>
                    <th className="text-left px-4 py-3 font-semibold text-white">Email</th>
                    <th className="text-left px-4 py-3 font-semibold text-white">Veículo</th>
                    <th className="text-left px-4 py-3 font-semibold text-white">Ano/KM</th>
                    <th className="text-left px-4 py-3 font-semibold text-white">Preço</th>
                    <th className="text-left px-4 py-3 font-semibold text-white">Status</th>
                    <th className="text-left px-4 py-3 font-semibold text-white">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr
                      key={req.id}
                      className="border-b transition-colors"
                      style={{ borderColor: "var(--border-default)" }}
                    >
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>{formatDate(req.created_at)}</td>
                      <td className="px-4 py-3 font-medium text-white">{req.nome}</td>
                      <td className="px-4 py-3">
                        <a
                          href={`https://wa.me/55${req.telefone.replace(/\D/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="transition-colors"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {req.telefone}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${req.email}`} className="transition-colors" style={{ color: "var(--text-secondary)" }}>
                          {req.email}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-white">{req.marca} {req.modelo}</td>
                      <td className="px-4 py-3 whitespace-nowrap" style={{ color: "var(--text-secondary)" }}>{req.ano} / {req.km} km</td>
                      <td className="px-4 py-3 font-semibold" style={{ color: "var(--accent)" }}>{formatPrice(req.preco)}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold border ${
                            req.status === "pending" ? "bg-yellow-900/30 text-yellow-400 border-yellow-600/50" :
                            req.status === "contacted" ? "bg-blue-900/30 text-blue-400 border-blue-600/50" :
                            req.status === "completed" ? "bg-green-900/30 text-green-400 border-green-600/50" :
                            "bg-gray-800 text-gray-400 border-gray-600"
                          }`}
                        >
                          {statusLabels[req.status] || req.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          className="rounded px-2 py-1 text-xs outline-none"
                          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                          value={req.status}
                          onChange={e => handleStatusChange(req.id, e.target.value)}
                        >
                          <option value="pending" style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}>Pendente</option>
                          <option value="contacted" style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}>Contatado</option>
                          <option value="completed" style={{ background: "var(--bg-main)", color: "var(--text-primary)" }}>Concluído</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>
    </div>
  )
}
