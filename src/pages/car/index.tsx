import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router"
import { supabase } from "../../services/supabaseClient"
import type { CarProps } from "../../types/car"
import logoImg from "../../assets/logo.svg"
import { WHATSAPP_NUMBER } from "../../constants/whatsapp"

export default function CarDetail() {
  const [car, setCar] = useState<CarProps | null>(null)
  const [relatedCars, setRelatedCars] = useState<CarProps[]>([])
  const [loading, setLoading] = useState(true)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const { id } = useParams()
  const navigate = useNavigate()

  function toggleFavorite(carId: string) {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(carId)) next.delete(carId)
      else next.add(carId)
      return next
    })
  }

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

        if (!data) {
          navigate("/")
          return
        }

        if (error) {
          console.error("Erro ao buscar detalhes do carro: ", error)
        }
        if (data) {
          setCar(data as CarProps)
        }
      } catch (error) {
        console.error("Erro inesperado! ", error)
      } finally {
        setLoading(false)
      }
    }

    loadCar()
  }, [id, navigate])

  useEffect(() => {
    const currentCarId = car?.id
    if (!currentCarId) return
    async function loadRelated() {
      const { data } = await supabase
        .from("cars")
        .select("*")
        .neq("id", currentCarId)
        .limit(4)

      if (data) {
        setRelatedCars(data as CarProps[])
      }
    }
    loadRelated()
  }, [car?.id])

  if (loading) {
    return (
      <div className="w-full flex justify-center my-10 pt-16">
        <div className="animate-spin h-8 w-8 border-4 border-zinc-800 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!car) return null

  const priceFormatted = Number(car.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  const mainImage = car.images?.[0]?.url || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80"
  const secondImage = car.images?.[1]?.url || car.images?.[0]?.url || mainImage
  const thirdImage = car.images?.[2]?.url || car.images?.[1]?.url || mainImage

  return (
    <>


      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-large flex flex-col gap-stack-large">
        <nav className="flex text-body-small text-secondary items-center gap-2">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <Link to="/estoque" className="hover:text-primary transition-colors">Estoque</Link>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-on-surface font-semibold">{car.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-stack-small h-auto md:h-[500px] rounded-[12px] overflow-hidden shadow-sm">
          <div className="md:col-span-2 relative h-64 md:h-full">
            <img alt={car.name} className="w-full h-full object-cover" src={mainImage} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-stack-small h-32 md:h-full">
            <div className="relative w-full h-full">
              <img className="w-full h-full object-cover" src={secondImage} alt="" />
            </div>
            <div className="relative w-full h-full">
              <img className="w-full h-full object-cover" src={thirdImage} alt="" />
              <div className="absolute inset-0 bg-on-surface/50 flex items-center justify-center cursor-pointer hover:bg-on-surface/40 transition-colors">
                <span className="text-white font-body-medium flex items-center gap-2">
                  <span className="material-symbols-outlined">photo_library</span> +{Math.max(0, (car.images?.length || 0) - 2)} Fotos
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          <div className="lg:col-span-2 flex flex-col gap-stack-large">
            <div className="flex flex-col gap-stack-small">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-[28px] md:text-headline-large font-headline-large text-on-surface">{car.name}</h1>
                  <p className="font-body-medium text-body-medium text-secondary mt-1">{car.model}</p>
                </div>
                <div className="text-right">
                  <span className="text-[28px] md:text-headline-large text-primary font-headline-large block">{priceFormatted}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="bg-secondary-fixed text-on-secondary-fixed-variant px-3 py-1 rounded-lg text-label-medium font-label-medium">Super Preço</span>
                <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-lg text-label-medium font-label-medium">Único Dono</span>
                <span className="bg-surface-variant text-on-surface-variant px-3 py-1 rounded-lg text-label-medium font-label-medium">Revisões na Concessionária</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-[12px] p-stack-medium shadow-sm border border-border-subtle">
              <h2 className="font-title-large text-title-large mb-stack-medium">Características</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-stack-medium">
                {[
                  { icon: "calendar_today", label: "Ano", value: car.year },
                  { icon: "speed", label: "Quilometragem", value: `${car.km} km` },
                  { icon: "local_gas_station", label: "Combustível", value: car.fuel || "Flex" },
                  { icon: "settings", label: "Câmbio", value: "Automático" },
                  { icon: "palette", label: "Cor", value: "Branco" },
                  { icon: "location_on", label: "Cidade", value: `${car.city}, ${car.uf}` },
                ].map((spec) => (
                  <div key={spec.label} className="flex flex-col gap-1 items-start bg-surface p-3 rounded-xl border border-surface-container">
                    <span className="material-symbols-outlined text-secondary">{spec.icon}</span>
                    <span className="text-label-medium font-label-medium text-secondary uppercase">{spec.label}</span>
                    <span className="font-body-medium text-body-medium text-on-surface font-semibold">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-[12px] p-stack-medium shadow-sm border border-border-subtle">
              <h2 className="font-title-large text-title-large mb-stack-small">Descrição do Veículo</h2>
              <p className="font-body-medium text-body-medium text-secondary leading-relaxed">{car.description}</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-surface-container-lowest rounded-[12px] p-stack-medium shadow-sm border border-border-subtle flex flex-col gap-stack-medium">
              <div className="flex justify-between items-center border-b border-border-subtle pb-stack-medium">
                <span className="font-headline-medium text-headline-medium text-primary">{priceFormatted}</span>
                <button
                  onClick={() => toggleFavorite(car.id)}
                  className="flex items-center justify-center w-9 h-9 rounded-full hover:bg-surface-variant transition-colors text-secondary hover:text-primary"
                >
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: favorites.has(car.id) ? "'FILL' 1" : "'FILL' 0", color: favorites.has(car.id) ? "var(--color-primary)" : "var(--color-secondary)" }}>favorite</span>
                </button>
              </div>
              <div className="flex flex-col gap-stack-small mt-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=${car.whatsapp || WHATSAPP_NUMBER}&text=Olá, vi esse ${car.name} no site WebCarros e fiquei interessado!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-success-green text-on-primary py-3 rounded-xl font-label-medium text-label-medium flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined">chat</span>
                  Enviar WhatsApp
                </a>
                <Link
                  to={`/agendar-test-drive?car=${car.id}`}
                  className="w-full border-2 border-primary text-primary py-3 rounded-xl font-label-medium text-label-medium flex items-center justify-center gap-2 hover:bg-primary-container hover:text-on-primary-container transition-all"
                >
                  <span className="material-symbols-outlined">directions_car</span>
                  Agendar Test Drive
                </Link>
              </div>
              <div className="mt-stack-small pt-stack-small border-t border-border-subtle">
                <p className="font-label-medium text-label-medium text-secondary mb-2 uppercase">Vendido por</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-surface-variant rounded-full flex items-center justify-center text-primary font-headline-medium">
                    {car.owner?.[0]?.toUpperCase() || "L"}
                  </div>
                  <div>
                    <p className="font-body-medium text-body-medium font-semibold">{car.owner || "Proprietário"}</p>
                    <p className="font-body-small text-body-small text-secondary flex items-center gap-1">
                      <span className="material-symbols-outlined" style={{ fontSize: 16 }}>store</span> Loja Verificada
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-stack-large">
          <h2 className="font-headline-medium text-headline-medium mb-stack-medium">Você também pode gostar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {relatedCars.map((rCar) => {
              const rImg = rCar.images?.[0]?.url || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&q=80"
              return (
                <Link key={rCar.id} to={`/car/${rCar.id}`} className="bg-surface-container-lowest rounded-[12px] overflow-hidden shadow-sm border border-border-subtle hover:shadow-md transition-shadow cursor-pointer group block">
                  <div className="relative h-48 overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={rImg} alt="" />
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="font-title-large text-title-large truncate">{rCar.name}</h3>
                    <p className="font-body-small text-body-small text-secondary">{rCar.year} • {rCar.km} km</p>
                    <span className="font-headline-medium text-headline-medium text-primary mt-2">{Number(rCar.price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </main>

      <footer className="bg-inverse-surface w-full mt-stack-large">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter py-stack-large px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="flex flex-col gap-4">
            <Link to="/" className="block mb-2">
              <img src={logoImg} alt="WebCarros" className="h-8 w-auto" />
            </Link>
            <p className="font-body-small text-body-small text-surface-variant">A melhor plataforma para encontrar seu próximo carro.</p>
          </div>
          <div className="flex flex-col gap-2">
            <a className="font-body-small text-body-small text-surface-variant hover:text-white transition-colors" href="#">Sobre Nós</a>
            <a className="font-body-small text-body-small text-surface-variant hover:text-white transition-colors" href="#">Carreira</a>
            <a className="font-body-small text-body-small text-surface-variant hover:text-white transition-colors" href="#">Privacidade</a>
          </div>
          <div className="flex flex-col gap-2">
            <a className="font-body-small text-body-small text-surface-variant hover:text-white transition-colors" href="#">Termos de Uso</a>
            <a className="font-body-small text-body-small text-surface-variant hover:text-white transition-colors" href="#">Blog</a>
            <a className="font-body-small text-body-small text-surface-variant hover:text-white transition-colors" href="#">Parceiros</a>
          </div>
          <div className="flex flex-col gap-4 md:col-start-1 md:col-end-5 mt-stack-medium pt-stack-small border-t border-secondary/30">
            <p className="font-body-small text-body-small text-surface-variant text-center">© 2024 WebCarros. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
