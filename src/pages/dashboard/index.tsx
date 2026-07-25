import { useEffect, useState } from "react"
import { Link } from "react-router"
import Container from "../../components/container"
import DashboardHeader from "../../components/panelheader"

import { FiTrash2, FiEdit2, FiPlusCircle } from "react-icons/fi"
import { supabase } from "../../services/supabaseClient"
import { type CarProps } from "../../types/car"
import { UserAuth } from "../../contexts/AuthContext"
import toast from "react-hot-toast"


export default function Dashboard() {
    const [cars, setCars] = useState<CarProps[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = UserAuth()
    const [loadImages, setLoadImages] = useState<string[]>([])


    useEffect(() => {

        async function loadCars() {
            if (!user?.id) return

            const { data, error } = await supabase
                .from("cars")
                .select("*")
                .eq("user_id", user.id)
                .order("created_at", { ascending: false })

            if (error) {
                console.error("Erro ao buscar carros: ", error)
                return
            }

            setCars(data as CarProps[])
        }

        setLoading(false)
        loadCars()
    }, [user?.id])

    async function handleDeleteCar(id: string) {
        const confirmed = await new Promise<boolean>((resolve) => {
            toast.custom((t) => (
                <div className="p-4 rounded-lg shadow-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                    <p className="font-medium text-white mb-3">Deseja realmente excluir este carro e todas as suas imagens?</p>
                    <div className="flex gap-2 justify-end">
                        <button
                            className="px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors"
                            style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}
                            onClick={() => { toast.remove(t.id); resolve(false) }}
                        >
                            Cancelar
                        </button>
                        <button
                            className="px-3 py-1.5 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors"
                            style={{ background: "var(--accent)" }}
                            onClick={() => { toast.remove(t.id); resolve(true) }}
                        >
                            Sim, excluir
                        </button>
                    </div>
                </div>
            ), { duration: Infinity })
        })

        if (!confirmed) return

        try {
            const { data: car, error: fetchError } = await supabase
                .from("cars")
                .select("images")
                .eq("id", id)
                .single()

            if (fetchError) {
                console.error("Erro ao buscar carro antes de deletar: ", fetchError)
                toast.error("Erro ao buscar carro")
                return
            }

            if (car?.images && car.images.length > 0) {
                const pathsToDelete = car.images.map((img: any) => img.path)

                const { error: storageError } = await supabase
                    .storage
                    .from("images")
                    .remove(pathsToDelete)

                if (storageError) {
                    console.error("Erro ao deletar imagens: ", storageError)
                    toast.error("Erro ao deletar imagens do servidor")
                }
            }

            const { error: deleteError } = await supabase
                .from("cars")
                .delete()
                .eq("id", id)

            if (deleteError) {
                console.error("Erro ao deletar carro no DB: ", deleteError)
                toast.error("Erro ao excluir o carro")
                return
            }

            setCars((prev) => prev.filter((car) => car.id !== id))
            toast.success("Carro excluído com sucesso!")
        }
        catch (error) {
            console.error("Erro inesperado: ", error)
            toast.error("Erro inesperado ao excluir o carro")
        }
    }

    function handleImageLoad(id: string) {
        setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
    }


    return (
        <div className="w-full" style={{ background: "var(--bg-main)" }}>
            <Container>
                <div className="min-h-[calc(100vh-64px)] flex flex-col">
                    <DashboardHeader />

                    <main className="flex-1 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 content-start">

                        {loading ? (
                            <div className="col-span-full flex justify-center py-16">
                                <div className="animate-spin h-8 w-8 border-4 rounded-full" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
                            </div>
                        ) : cars.length === 0 ? (
                            <div className="col-span-full flex flex-col items-center justify-center py-16" style={{ color: "var(--text-secondary)" }}>
                                <span className="material-symbols-outlined text-6xl mb-4" style={{ fontSize: 64, color: "var(--text-muted)" }}>directions_car</span>
                                <p className="text-lg font-medium mb-1" style={{ color: "var(--text-primary)" }}>Nenhum carro cadastrado</p>
                                <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>Clique em "Cadastrar carro" para começar.</p>
                                <Link
                                    to="/dashboard/new"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors text-white"
                                    style={{ background: "var(--accent)" }}
                                >
                                    <FiPlusCircle size={18} />
                                    Cadastrar carro
                                </Link>
                            </div>
                        ) : (
                            cars.map((car) => (
                                <section
                                    key={car.id}
                                    className="w-full rounded-xl overflow-hidden transition-all duration-300 relative"
                                    style={{
                                        background: "linear-gradient(145deg, var(--bg-elevated), var(--bg-card))",
                                        border: "1px solid var(--border-light)",
                                        boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                                    }}
                                    onMouseEnter={(e) => {
                                        const el = e.currentTarget
                                        el.style.transform = "translateY(-4px)"
                                        el.style.borderColor = "rgba(233,0,63,0.45)"
                                        el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.35)"
                                    }}
                                    onMouseLeave={(e) => {
                                        const el = e.currentTarget
                                        el.style.transform = "translateY(0)"
                                        el.style.borderColor = "var(--border-light)"
                                        el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)"
                                    }}
                                >
                                    <div>
                                        <Link
                                            to={`/dashboard/edit/${car.id}`}
                                            className="absolute p-2 rounded-2xl opacity-45 cursor-pointer hover:scale-105 hover:opacity-65 left-2 top-2 transition-all"
                                            style={{ background: "var(--bg-card)" }}
                                        >
                                            <FiEdit2 size={24} style={{ color: "var(--accent)" }} />
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteCar(car.id)}
                                            className="absolute p-2 rounded-2xl opacity-45 cursor-pointer hover:scale-105 hover:opacity-65 right-2 top-2 transition-all"
                                            style={{ background: "var(--bg-card)" }}
                                        >
                                            <FiTrash2 size={24} style={{ color: "var(--accent)" }} />
                                        </button>
                                        <div
                                            className="w-full rounded-lg mb-2 max-h-70 h-70"
                                            style={{
                                                display: loadImages.includes(car.id) ? "none" : "block",
                                                background: "var(--bg-secondary)"
                                            }}
                                        />
                                        <img
                                            className="w-full rounded-lg mb-2 max-h-70 h-70 object-cover"
                                            src={car.images?.[0]?.url || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80"}
                                            alt="Imagem do carro"
                                            onLoad={() => handleImageLoad(car.id)}
                                            style={{ display: loadImages.includes(car.id) ? "block" : "none" }}
                                        />
                                    </div>

                                    <p className="font-bold mt-1 px-2 mb-2 text-white">{car.name}</p>

                                    <div className="flex flex-col px-2">
                                        <span style={{ color: "var(--text-secondary)" }}>
                                            Ano {car.year} | {car.km} km
                                        </span>
                                        <strong className="font-bold mt-4" style={{ color: "var(--accent)" }}>
                                            {(Number(car?.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))}
                                        </strong>
                                    </div>

                                    <div className="w-full h-px my-2" style={{ background: "var(--border-default)" }} />
                                    <div className="px-2 pb-2">
                                        <span style={{ color: "var(--text-secondary)" }}>
                                            {car.city}
                                        </span>
                                    </div>
                                </section>
                            ))
                        )}

                    </main>
                </div>
            </Container>
        </div>
    )
}
