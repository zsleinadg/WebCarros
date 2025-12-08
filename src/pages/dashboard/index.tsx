import { useEffect, useState } from "react"
import Container from "../../components/container"
import DashboardHeader from "../../components/panelheader"

import { FiTrash2 } from "react-icons/fi"
import { supabase } from "../../services/supabaseClient"
import { type CarProps } from "../../types/car"
import { UserAuth } from "../../contexts/AuthContext"


export default function Dashboard() {
    const [cars, setCars] = useState<CarProps[]>([])
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
            <DashboardHeader />

            <main className=" grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

                {cars.map((car) => (
                    <section key={car.id} className="w-full bg-white rounded-lg relative">
                        <div>

                            <button
                                onClick={() => handleDeleteCar(car.id)}
                                className="absolute bg-white p-2 rounded-2xl opacity-45 cursor-pointer hover:scale-103 hover:opacity-65 right-2 top-2"
                            >
                                <FiTrash2 size={24} color="#000" />
                            </button>
                            <div 
                            style={{display: loadImages.includes(car.id) ? "none" : "block"}}
                            className=" w-full rounded-lg mb-2 max-h-70 bg-slate-200"></div>
                            <img
                                className="w-full rounded-lg mb-2 max-h-70 h-70 object-cover"
                                src={car.images[0].url}
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
                ))}

            </main>
        </Container>
    )
}