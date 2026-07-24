import { useEffect, useState } from "react"
import { Link } from "react-router"
import { supabase } from "../../services/supabaseClient"
import type { CarProps } from "../../types/car"
import { formatPrice } from "../../utils"
import { useFavorites } from "../../contexts/FavoritesContext"
import { FaHeart, FaRegHeart } from "react-icons/fa"

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
    <>
      <main className="flex-grow w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-margin-desktop min-h-screen">
        <section className="mb-stack-large flex flex-col md:flex-row md:items-end justify-between border-b border-border-subtle pb-stack-medium">
          <div>
            <h1 className="text-[28px] md:text-headline-large font-[700] md:font-headline-large text-on-background mb-base">Meus Favoritos</h1>
            <p className="text-body-medium font-body-medium text-on-surface-variant">{favorites.size} veículos salvos</p>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-large">
          {favoriteCars.map((car) => {
            const imgUrl = car.images?.[0]?.url || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80"
            return (
              <article key={car.id} className="bg-surface-container-lowest rounded-xl shadow-sm border border-border-subtle overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300 relative group">
                <button
                  onClick={() => toggleFavorite(car.id)}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-surface-container-lowest/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-primary hover:scale-110 transition-transform"
                >
                  {favorites.has(car.id) ? <FaHeart size={24} color="#ef4444" /> : <FaRegHeart size={24} color="var(--color-secondary)" />}
                </button>
                <div className="relative h-56 bg-surface-variant w-full">
                  <img alt={car.name} className="w-full h-full object-cover" src={imgUrl} />
                </div>
                <div className="p-stack-medium flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-base">
                    <h2 className="text-headline-medium font-headline-medium text-on-background line-clamp-1">{car.name}</h2>
                  </div>
                  <p className="text-label-medium font-label-medium text-secondary mb-stack-medium uppercase tracking-wider">{car.model}</p>
                  <div className="flex flex-wrap gap-2 mb-stack-large">
                    <span className="bg-surface-container-low text-secondary px-2 py-1 rounded text-xs font-semibold">{car.year}</span>
                    <span className="bg-surface-container-low text-secondary px-2 py-1 rounded text-xs font-semibold">{car.km} km</span>
                  </div>
                  <div className="mt-auto pt-stack-medium border-t border-border-subtle flex items-center justify-between">
                    <p className="text-headline-medium font-headline-medium text-primary font-bold">{formatPrice(car.price)}</p>
                    <Link to={`/car/${car.id}`} className="text-primary font-semibold text-sm hover:underline flex items-center">
                      Ver detalhes
                      <span className="material-symbols-outlined ml-1" style={{ fontSize: 16 }}>arrow_forward</span>
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </section>
      </main>

    </>
  )
}
