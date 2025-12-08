import { useEffect, useState } from "react"
import Container from "../../components/container"
import { type CarProps } from "../../types/car"
import { useNavigate, useParams } from "react-router"
import { FaWhatsapp } from "react-icons/fa"
import { supabase } from "../../services/supabaseClient"

import {Swiper, SwiperSlide} from "swiper/react"


export default function CarDetail() {
    const [car, setCar] = useState<CarProps>()
    const { id } = useParams()
    const [loading, setLoading] = useState(true)
    const [sliderPerView, setSliderPerView] = useState<number>(2)
    const navigate = useNavigate()

    useEffect(() => {
        async function loadCar() {
            if (!id) return
            setLoading(true)
            try {
                const { data, error } = await supabase
                    .from("cars")
                    .select("*")
                    .eq("id", id)
                    .single()

                    if(!data){
                        navigate("/")
                    }

                if (error) {
                    console.error("Erro ao buscar detalhes do carro: ", error)
                }
                if (data) {
                    setCar(data as CarProps)
                }
            }
            catch (error) {
                console.error("Erro inesperado! ", error)
            }
            finally {
                setLoading(false)
            }
        }

        loadCar()

    }, [id])
    
    useEffect(() => {
        function handleResize() {
            if(window.innerWidth < 720) {
                setSliderPerView(1)
            }
            else{
                setSliderPerView(2)
            }
        }

        handleResize()

        window.addEventListener("resize", handleResize)

        return() => {
            window.removeEventListener("resize", handleResize)
        }
    }, [])



    if (loading) {
        return (
            <Container>
                <div className=" w-full flex justify-center my-10">
                    <div className=" animate-spin h-8 w-8 border-4 border-zinc-800 border-t-transparent rounded-full"></div>
                </div>
            </Container>
        )
    }

    return (
        <Container>
            
            {car && (
                <Swiper
            slidesPerView={sliderPerView}
            pagination={{clickable: true}}
            navigation
            >
                {car?.images.map( image => (
                    <SwiperSlide key={image.name}>
                        <img 
                        src={image.url}
                        alt="Foto do carro"
                        className=" w-full h-96 object-cover" />
                    </SwiperSlide>
                ))}
            </Swiper>
            )}


            {car && (
                <main className="w-full bg-white rounded-lg p-6 my-4">
                    <div className=" flex flex-col sm:flex-row mb-4 items-center justify-between">
                        <h1 className=" font-bold text-3xl text-black">{car.name}</h1>
                        <h1 className=" font-bold text-3xl text-black">{(Number(car?.price).toLocaleString("pt-BR", {style:"currency", currency:"BRL"}))}</h1>
                    </div>
                    <p>{car.model}</p>

                    <div className=" flex flex-col w-full gap-6 my-4">
                        <div className=" flex flex-row gap-5">
                            <div>
                                <p>Cidade</p>
                                <strong>{car.city}</strong>
                            </div>
                            <div>
                                <p>UF</p>
                                <strong>{car.uf}</strong>
                            </div>
                        </div>
                        <div className=" flex flex-row gap-10">
                            <div>
                                <p>Ano</p>
                                <strong>{car.year}</strong>
                            </div>
                            <div>
                                <p>KM</p>
                                <strong>{car.km}</strong>
                            </div>
                        </div>

                        
                    </div>

                    <strong>Descrição: </strong>
                    <p className=" mb-4">{car.description}</p>

                    <strong>Telefone / Whatsapp</strong>
                    <p>{car.whatsapp}</p>

                    <a 
                    className=" bg-green-500 w-full text-white flex items-center justify-center gap-2 my-6 h-11 text-xl rounded-lg font-medium cursor-pointer" 
                    href={`https://api.whatsapp.com/send?phone${car?.whatsapp}&text=Olá, vi esse ${car.name} no site WebCarros e fiquei interessado!`}
                    target="_blank"
                    >
                        Conversar com vendedor
                        <FaWhatsapp size={26} color="#FFF" />
                    </a>
                </main>
            )}


        </Container>
    )
}