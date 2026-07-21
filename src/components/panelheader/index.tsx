import { Link, useLocation } from "react-router"
import { FiGrid, FiPlusCircle, FiList, FiLogOut } from "react-icons/fi"
import { UserAuth } from "../../contexts/AuthContext"
import toast from "react-hot-toast"

export default function DashboardHeader() {
    const { signOut } = UserAuth()
    const { pathname } = useLocation()

    async function handleSignout() {
        const confirmed = await new Promise((resolve) => {
            toast.custom((t) => (
                <div className="bg-white p-4 rounded-lg shadow-lg border border-border-subtle">
                    <p className="font-medium text-on-background mb-3">Deseja realmente sair?</p>
                    <div className="flex gap-2 justify-end">
                        <button
                            className="px-3 py-1.5 bg-gray-200 rounded-lg text-sm font-medium cursor-pointer hover:bg-gray-300 transition-colors"
                            onClick={() => { toast.dismiss(t.id); resolve(false) }}
                        >
                            Cancelar
                        </button>
                        <button
                            className="px-3 py-1.5 bg-red-500 text-white rounded-lg text-sm font-medium cursor-pointer hover:bg-red-600 transition-colors"
                            onClick={() => { toast.dismiss(t.id); resolve(true) }}
                        >
                            Sim, sair
                        </button>
                    </div>
                </div>
            ), { duration: Infinity })
        })

        if (confirmed) {
            await signOut()
        }
    }

    const isDashboard = pathname === "/dashboard"
    const isNew = pathname === "/dashboard/new"
    const isVendas = pathname === "/dashboard/vendas"

    return (
        <div className="w-full bg-red-500 rounded-lg mb-4 shadow-sm">
            <div className="flex items-center justify-between h-14 sm:h-16 px-4 sm:px-6">
                <div className="flex items-center gap-1 sm:gap-2">
                    <Link
                        to="/dashboard"
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isDashboard
                                ? "bg-white/40 text-white"
                                : "text-white/70 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <FiGrid size={18} />
                        <span className="hidden sm:inline">Dashboard</span>
                    </Link>
                    <Link
                        to="/dashboard/new"
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isNew
                                ? "bg-white/40 text-white"
                                : "text-white/70 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <FiPlusCircle size={16} />
                        <span className="hidden sm:inline">Cadastrar carro</span>
                    </Link>
                    <Link
                        to="/dashboard/vendas"
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            isVendas
                                ? "bg-white/40 text-white"
                                : "text-white/70 hover:text-white hover:bg-white/5"
                        }`}
                    >
                        <FiList size={16} />
                        <span className="hidden sm:inline">Pedidos de Venda</span>
                    </Link>
                </div>

                <button
                    onClick={handleSignout}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                >
                    <FiLogOut size={16} />
                    <span className="hidden sm:inline">Sair</span>
                </button>
            </div>
        </div>
    )
}
