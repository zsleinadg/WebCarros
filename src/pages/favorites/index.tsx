import { useEffect, useState } from "react"
import { Link } from "react-router"
import { supabase } from "../../services/supabaseClient"
import type { CarProps } from "../../types/car"
import logoImg from "../../assets/logo.svg"

export default function Favorites() {
  const [allCars, setAllCars] = useState<CarProps[]>([])
  const [favorites, setFavorites] = useState<string[]>([])

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

  function toggleFavorite(id: string) {
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  function formatPrice(price: string | number) {
    return Number(price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  const favoriteCars = allCars.filter(car => favorites.includes(car.id))

  return (
    <>


      <main className="flex-grow w-full px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto py-margin-desktop">
        <section className="mb-stack-large flex flex-col md:flex-row md:items-end justify-between border-b border-border-subtle pb-stack-medium">
          <div>
            <h1 className="text-[28px] md:text-headline-large font-[700] md:font-headline-large text-on-background mb-base">Meus Favoritos</h1>
            <p className="text-body-medium font-body-medium text-on-surface-variant">{favorites.length} veículos salvos</p>
          </div>
          <div className="mt-stack-medium md:mt-0">
            <button onClick={() => setFavorites([])} className="flex items-center text-sm font-semibold text-secondary hover:text-primary transition-colors group">
              <span className="material-symbols-outlined mr-2 text-secondary group-hover:text-primary transition-colors" style={{ fontSize: 18 }}>delete_sweep</span>
              Limpar favoritos
            </button>
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
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 24, fontVariationSettings: favorites.includes(car.id) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
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

      <footer className="bg-on-secondary-fixed text-primary-fixed">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-stack-medium px-margin-mobile md:px-margin-desktop py-margin-desktop max-w-container-max mx-auto">
          <div className="col-span-1 md:col-span-1 flex flex-col justify-between h-full">
            <Link to="/" className="block mb-stack-medium">
              <img src={logoImg} alt="WebCarros" className="h-8 w-auto" />
            </Link>
            <p className="text-secondary/70 mt-auto">© 2024 WebCarros. Todos os direitos reservados.</p>
          </div>
          <div className="col-span-1 flex flex-col gap-stack-small">
            <a className="text-secondary/70 hover:text-secondary hover:text-primary-fixed-dim transition-colors inline-block w-fit" href="#">Sobre Nós</a>
            <a className="text-secondary/70 hover:text-secondary hover:text-primary-fixed-dim transition-colors inline-block w-fit" href="#">Termos de Uso</a>
            <a className="text-secondary/70 hover:text-secondary hover:text-primary-fixed-dim transition-colors inline-block w-fit" href="#">Política de Privacidade</a>
          </div>
          <div className="col-span-1 flex flex-col gap-stack-small">
            <a className="text-secondary/70 hover:text-secondary hover:text-primary-fixed-dim transition-colors inline-block w-fit" href="#">Ajuda</a>
            <a className="text-secondary/70 hover:text-secondary hover:text-primary-fixed-dim transition-colors inline-block w-fit" href="#">Trabalhe Conosco</a>
            <a className="text-secondary/70 hover:text-secondary hover:text-primary-fixed-dim transition-colors inline-block w-fit" href="#">Blog</a>
          </div>
        </div>
      </footer>
    </>
  )
}
