import { useEffect, useState } from "react"
import { Link } from "react-router"
import { supabase } from "../../services/supabaseClient"
import type { CarProps } from "../../types/car"
import { formatPrice } from "../../utils"
import { useFavorites } from "../../contexts/FavoritesContext"
import { FaHeart } from "react-icons/fa"

export default function Favorites() {
  const [allCars, setAllCars] = useState<CarProps[]>([])
  const { favorites, toggleFavorite } = useFavorites()

  useEffect(() => {
    async function loadCars() {
      const { data } = await supabase
        .from("cars")
        .select("*")

      if (data) {
        setAllCars(data as CarProps[])
      }
    }
    loadCars()
  }, [])

  const favoriteCars = allCars.filter(car => favorites.has(car.id))

  return (
    <main
      className="w-full min-h-screen"
      style={{ background: "var(--bg-main)" }}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-10">
        <section
          className="mb-8 flex flex-col md:flex-row md:items-end justify-between border-b pb-5"
          style={{ borderColor: "var(--border-default)" }}
        >
          <div>
            <h1 className="text-[28px] md:text-3xl font-bold text-white mb-1">Meus Favoritos</h1>
            <p className="text-base" style={{ color: "var(--text-secondary)" }}>{favorites.size} veículos salvos</p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteCars.map((car) => {
            const imgUrl = car.images?.[0]?.url || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80"
            return (
              <article
                key={car.id}
                className="rounded-xl overflow-hidden transition-all duration-300 flex flex-col relative group"
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
                <button
                  onClick={() => toggleFavorite(car.id)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm transition-transform"
                  style={{ background: "rgba(16,22,37,0.8)" }}
                >
                  <FaHeart size={24} style={{ color: favorites.has(car.id) ? "var(--accent)" : "var(--text-muted)" }} />
                </button>
                <div className="relative h-56 w-full" style={{ background: "var(--bg-secondary)" }}>
                  <img alt={car.name} className="w-full h-full object-cover" src={imgUrl} />
                </div>
                <div className="p-5 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-1">
                    <h2 className="text-xl font-bold text-white line-clamp-1">{car.name}</h2>
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-secondary)" }}>{car.model}</p>
                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-2 py-1 rounded text-xs font-semibold" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}>{car.year}</span>
                    <span className="px-2 py-1 rounded text-xs font-semibold" style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}>{car.km} km</span>
                  </div>
                  <div className="mt-auto pt-4 border-t flex items-center justify-between" style={{ borderColor: "var(--border-default)" }}>
                    <p className="text-xl font-black" style={{ color: "var(--accent)" }}>{formatPrice(car.price)}</p>
                    <Link
                      to={`/car/${car.id}`}
                      className="text-sm font-semibold flex items-center transition-colors"
                      style={{ color: "var(--accent)" }}
                    >
                      Ver detalhes
                      <span className="material-symbols-outlined ml-1" style={{ fontSize: 16 }}>arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      </div>
    </main>
  )
}
