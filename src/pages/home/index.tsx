import { useEffect, useState } from "react";
import Container from "../../components/container";
import { supabase } from "../../services/supabaseClient";
import { Link } from "react-router";

import { type CarProps } from "../../types/car";


export default function Home() {
    const [cars, setCars] = useState<CarProps[]>([])
    const [loadImages, setLoadImages] = useState<string[]>([])
    const [input, setInput] = useState("")


    useEffect(() => {
        loadCars()
    }, [])

    async function loadCars(searchTerm: string = "") {
        let query = supabase.from("cars").select("*")

        if(searchTerm) {
            query = query.ilike("name", `%${searchTerm}%`)
        }
        
        const { data, error } = await query
        .order("created_at", { ascending: false })

        if (error) {
            console.error("Erro ao buscar carros: ", error)
            return
        }

        setCars(data as CarProps[])
    }

    function handleImageLoad(id: string) {
        setLoadImages((prevImageLoaded) => [...prevImageLoaded, id])
    }

    function handleSearchCar() {
        setCars([])
        setLoadImages([])

        loadCars(input)
    }


    return (
        <Container>
            <section className=" bg-white flex justify-between items-center p-4 gap-2 rounded-lg w-full max-w-3xl mx-auto">
                <input
                    className=" w-full border border-[#878787] rounded-lg h-9 px-3 outline-none"
                    type="text"
                    placeholder="Digite o nome do carro..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />

                <button
                    className=" text-white bg-[#E11138] h-9 px-8 rounded-lg font-medium text-lg cursor-pointer hover:scale-[1.03] transition-all"
                    onClick={handleSearchCar}
                >
                    Buscar
                </button>
            </section>

            <h1 className=" font-bold text-center mt-6 text-2xl mb-4">Carros novos e usados em todo o Brasil</h1>

            <main className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {cars.map(car => (

                    <Link key={car.id} to={`/car/${car.id}`}>

                        <section className=" w-full bg-white rounded-lg">

                            <div
                                className="w-full h-72 rounded-lg bg-slate-200"
                                style={{ display: loadImages.includes(car.id) ? "none" : "block" }}
                            ></div>

                            <img
                                className=" w-full rounded-lg mb-2 max-h-72 h-72 hover:scale-105 transition-all object-cover"
                                src={car.images[0].url}
                                alt="Logo do carro"
                                onLoad={() => handleImageLoad(car.id)}
                                style={{ display: loadImages.includes(car.id) ? "block" : "none" }}
                            />

                            <p className=" font-bold mt-1 mb-2 px-2">{car.name}</p>

                            <div className=" flex flex-col px-2">
                                <span className=" text-zinc-700 mb-6">Ano {car.year} | {car.km} km</span>
                                <strong className=" text-black font-medium text-xl">{(Number(car?.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }))}</strong>
                            </div>

                            <div className=" w-full h-px bg-slate-200 my-2"></div>

                            <div className=" px-2 pb-2">
                                <span>{car.city} - {car.uf}</span>
                            </div>

                        </section>
                    </Link>
                ))}
            </main>
        </Container>
    )
}