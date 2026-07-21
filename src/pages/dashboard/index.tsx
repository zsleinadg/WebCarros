import { useEffect, useState } from "react"
import { Link } from "react-router"
import Container from "../../components/container"
import DashboardHeader from "../../components/panelheader"

import { FiTrash2, FiEdit2, FiPlusCircle } from "react-icons/fi"
import { supabase } from "../../services/supabaseClient"
import { type CarProps } from "../../types/car"
import { UserAuth } from "../../contexts/AuthContext"


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
        if (!window.confirm("Deseja realmente excluir este carro e todas as suas imagens?")) return

        try {
            const { data: car, error: fetchError } = await supabase
                .from("cars")
                .select("images")
                .eq("id", id)
                .single()

            if (fetchError) {
                console.error("Erro ao buscar carro antes de deletar: ", fetchError)
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
                }
            }

            const { error: deleteError } = await supabase
                .from("cars")
                .delete()
                .eq("id", id)

            if (deleteError) {
                console.error("Erro ao deletar carro no DB: ", deleteError)
                return
            }

            setCars((prev) => prev.filter((car) => car.id !== id))
        }
        catch (error) {
            console.error("Erro inesperado: ", error)
        }
    }

    function handleImageLoad(id: string) {
        setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
    }


    return (
        <Container>
            <div className="min-h-[calc(100vh-64px)] flex flex-col">
            <DashboardHeader />

            <main className="flex-1 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 content-start">

                {loading ? (
                    <div className="col-span-full flex justify-center py-16">
                        <div className="animate-spin h-8 w-8 border-4 border-zinc-800 border-t-transparent rounded-full" />
                    </div>
                ) : cars.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center py-16 text-zinc-500">
                        <span className="material-symbols-outlined text-6xl mb-4" style={{ fontSize: 64 }}>directions_car</span>
                        <p className="text-lg font-medium mb-1">Nenhum carro cadastrado</p>
                        <p className="text-sm mb-6">Clique em "Cadastrar carro" para começar.</p>
                        <Link
                            to="/dashboard/new"
                            className="inline-flex items-center gap-2 bg-red-500 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                            <FiPlusCircle size={18} />
                            Cadastrar carro
                        </Link>
                    </div>
                ) : (
                    cars.map((car) => (
                        <section key={car.id} className="w-full bg-white rounded-lg relative">
                            <div>

                                <Link
                                    to={`/dashboard/edit/${car.id}`}
                                    className="absolute bg-white p-2 rounded-2xl opacity-45 cursor-pointer                                     hover:scale-105 hover:opacity-65 left-2 top-2"
                                >
                                    <FiEdit2 size={24} color="#000" />
                                </Link>
                                <button
                                    onClick={() => handleDeleteCar(car.id)}
                                    className="absolute bg-white p-2 rounded-2xl opacity-45 cursor-pointer                                     hover:scale-105 hover:opacity-65 right-2 top-2"
                                >
                                    <FiTrash2 size={24} color="#000" />
                                </button>
                                <div 
                                style={{display: loadImages.includes(car.id) ? "none" : "block"}}
                                className=" w-full rounded-lg mb-2 max-h-70 bg-slate-200"></div>
                                <img
                                    className="w-full rounded-lg mb-2 max-h-70 h-70 object-cover"
                                    src={car.images?.[0]?.url || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80"}
                                    alt="Imagem do carro"
                                    onLoad={() => handleImageLoad(car.id)}
                                    style={{display: loadImages.includes(car.id) ? "block" : "none"}}
                                />
                            </div>

                            <p className=" font-bold mt-1 px-2 mb-2">{car.name}</p>

                            <div className=" flex flex-col px-2">
                                <span className="text-zinc-700">
                                    Ano {car.year} | {car.km} km
                                </span>
                                <strong className=" font-bold mt-4">
                                    {(Number(car?.price).toLocaleString("pt-BR", {style:"currency", currency:"BRL"}))}
                                </strong>
                            </div>

                            <div className=" w-full h-px bg-slate-200 my-2"></div>
                            <div className=" px-2 pb-2 ">
                                <span>
                                    {car.city}
                                </span>
                            </div>
                        </section>
                    ))
                )}

            </main>
            </div>
        </Container>
    )
}