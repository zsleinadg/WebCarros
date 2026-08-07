import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router"
import { supabase } from "../../services/supabaseClient"
import type { CarProps } from "../../types/car"
import { WHATSAPP_NUMBER } from "../../constants/whatsapp"
import { formatPrice } from "../../utils"
import { useFavorites } from "../../contexts/FavoritesContext"
import { FaHeart } from "react-icons/fa"
import { ChevronRight, Images, Calendar, Gauge, Fuel, MapPin, MessageCircle, Car, Store } from "lucide-react"

export default function CarDetail() {
  const [car, setCar] = useState<CarProps | null>(null)
  const [relatedCars, setRelatedCars] = useState<CarProps[]>([])
  const [loading, setLoading] = useState(true)
  const { favorites, toggleFavorite } = useFavorites()
  const { id } = useParams()
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
      <main className="w-full min-h-screen flex justify-center items-center" style={{ background: "var(--bg-main)" }}>
        <div className="animate-spin h-8 w-8 border-4 rounded-full" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}></div>
      </main>
    )
  }

  if (!car) return null

  const priceFormatted = formatPrice(car.price)
  const mainImage = car.images?.[0]?.url || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80"
  const secondImage = car.images?.[1]?.url || car.images?.[0]?.url || mainImage
  const thirdImage = car.images?.[2]?.url || car.images?.[1]?.url || mainImage

  return (
    <main className="w-full min-h-screen" style={{ background: "var(--bg-main)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 flex flex-col gap-8">

        <nav className="flex text-sm items-center gap-2" style={{ color: "var(--text-secondary)" }}>
          <Link to="/" className="hover:text-[var(--accent)] transition-colors">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/estoque" className="hover:text-[var(--accent)] transition-colors">Estoque</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-white font-semibold">{car.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 h-auto md:h-[500px] rounded-xl overflow-hidden shadow-sm">
          <div className="md:col-span-2 relative h-64 md:h-full">
            <img alt={car.name} className="w-full h-full object-cover" src={mainImage} />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-1 md:grid-rows-2 gap-2 h-32 md:h-full">
            <div className="relative w-full h-full">
              <img className="w-full h-full object-cover" src={secondImage} alt="" />
            </div>
            <div className="relative w-full h-full">
              <img className="w-full h-full object-cover" src={thirdImage} alt="" />
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/40 transition-colors">
                <span className="text-white text-sm flex items-center gap-2">
                  <Images className="h-4 w-4" /> +{Math.max(0, (car.images?.length || 0) - 2)} Fotos
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-[28px] md:text-3xl font-bold text-white">{car.name}</h1>
                  <p className="text-base mt-1" style={{ color: "var(--text-secondary)" }}>{car.model}</p>
                </div>
                <div className="text-right">
                  <span className="text-[28px] md:text-3xl font-black" style={{ color: "var(--accent)" }}>{priceFormatted}</span>
                </div>
              </div>
            </div>

            <div
              className="rounded-xl p-6 shadow-sm"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              <h2 className="text-lg font-bold text-white mb-4">Características</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: <Calendar className="h-5 w-5 text-[var(--accent)]" />, label: "Ano", value: car.year },
                  { icon: <Gauge className="h-5 w-5 text-[var(--accent)]" />, label: "Quilometragem", value: `${car.km} km` },
                  { icon: <Fuel className="h-5 w-5 text-[var(--accent)]" />, label: "Combustível", value: car.fuel || "Flex" },
                  { icon: <MapPin className="h-5 w-5 text-[var(--accent)]" />, label: "Cidade", value: `${car.city}, ${car.uf}` },
                ].map((spec) => (
                  <div
                    key={spec.label}
                    className="flex flex-col gap-1 items-start p-3 rounded-xl"
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border-default)",
                    }}
                  >
                    {spec.icon}
                    <span className="text-xs font-semibold uppercase" style={{ color: "var(--text-secondary)" }}>{spec.label}</span>
                    <span className="text-sm font-semibold text-white">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              className="rounded-xl p-6 shadow-sm"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              <h2 className="text-lg font-bold text-white mb-2">Descrição do Veículo</h2>
              <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>{car.description}</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div
              className="sticky top-24 rounded-xl p-6 shadow-sm flex flex-col gap-4"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-default)",
              }}
            >
              <div className="flex justify-between items-center border-b pb-4" style={{ borderColor: "var(--border-default)" }}>
                <span className="text-2xl font-black" style={{ color: "var(--accent)" }}>{priceFormatted}</span>
                <button
                  onClick={() => toggleFavorite(car.id)}
                  className="flex items-center justify-center w-9 h-9 rounded-full transition-colors cursor-pointer"
                  style={{ color: favorites.has(car.id) ? "var(--accent)" : "var(--text-muted)" }}
                >
                  <FaHeart size={20} />
                </button>
              </div>
              <div className="flex flex-col gap-3 mt-2">
                <a
                  href={`https://api.whatsapp.com/send?phone=${car.whatsapp || WHATSAPP_NUMBER}&text=Olá, vi esse ${car.name} no site WebCarros e fiquei interessado!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm text-white"
                  style={{ background: "#25D366" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#20bd5a" }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#25D366" }}
                >
                  <MessageCircle className="h-5 w-5" />
                  Enviar WhatsApp
                </a>
                <Link
                  to={`/agendar-test-drive?car=${car.id}`}
                  className="w-full border-2 py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all"
                  style={{ borderColor: "var(--accent)", color: "var(--accent)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(233,0,63,0.08)"; e.currentTarget.style.color = "var(--accent)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--accent)" }}
                >
                  <Car className="h-5 w-5" />
                  Agendar Test Drive
                </Link>
              </div>
              <div className="mt-4 pt-4 border-t" style={{ borderColor: "var(--border-default)" }}>
                <p className="text-xs font-semibold uppercase mb-2" style={{ color: "var(--text-secondary)" }}>Vendido por</p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold"
                    style={{ background: "rgba(233,0,63,0.08)", color: "var(--accent)" }}
                  >
                    {car.owner?.[0]?.toUpperCase() || "L"}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{car.owner || "Proprietário"}</p>
                    <p className="text-xs flex items-center gap-1" style={{ color: "var(--text-secondary)" }}>
                      <Store className="h-4 w-4" /> Loja Verificada
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-2xl font-bold text-white mb-6">Você também pode gostar</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedCars.map((rCar) => {
              const rImg = rCar.images?.[0]?.url || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&q=80"
              return (
                <Link
                  key={rCar.id}
                  to={`/car/${rCar.id}`}
                  className="rounded-xl overflow-hidden transition-all duration-300 group block"
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
                  <div className="relative h-48 overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={rImg} alt="" />
                  </div>
                  <div className="p-4 flex flex-col gap-2">
                    <h3 className="text-lg font-bold text-white truncate">{rCar.name}</h3>
                    <p className="text-sm" style={{ color: "var(--text-muted)" }}>{rCar.year} • {rCar.km} km</p>
                    <span className="text-xl font-black" style={{ color: "var(--accent)" }}>{formatPrice(rCar.price)}</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      </div>
    </main>
  )
}
