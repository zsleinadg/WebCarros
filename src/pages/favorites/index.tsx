import { useState } from "react"
import { Link } from "react-router"
import logoImg from "../../assets/logo.svg"

const favoriteCars = [
  {
    img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80",
    title: "Land Rover Range Rover",
    model: "Vogue 3.0 V6 Td6 Diesel",
    year: "2018/2019",
    km: "54.000 km",
    fuel: "Diesel",
    price: "R$ 489.900",
  },
  {
    img: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80",
    title: "Hyundai i30",
    model: "1.8 MPI 16V Gasolina 4P Aut.",
    year: "2015/2016",
    km: "89.500 km",
    fuel: "Gasolina",
    price: "R$ 72.900",
  },
  {
    img: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80",
    title: "Ford F-150",
    model: "Raptor 3.5 V6 EcoBoost",
    year: "2022/2023",
    km: "12.000 km",
    fuel: "Gasolina",
    price: "R$ 890.000",
  },
]

export default function Favorites() {
  const [favorites, setFavorites] = useState<number[]>([0, 1, 2])

  function toggleFavorite(index: number) {
    setFavorites(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    )
  }

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
          {favoriteCars.filter((_, i) => favorites.includes(i)).map((car, i) => (
            <article key={i} className="bg-surface-container-lowest rounded-xl shadow-sm border border-border-subtle overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300 relative group">
              <button
                onClick={() => toggleFavorite(i)}
                className="absolute top-4 right-4 z-10 w-10 h-10 bg-surface-container-lowest/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm text-primary hover:scale-110 transition-transform"
              >
                <span className="material-symbols-outlined text-primary" style={{ fontSize: 24, fontVariationSettings: favorites.includes(i) ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
              </button>
              <div className="relative h-56 bg-surface-variant w-full">
                <img alt={car.title} className="w-full h-full object-cover" src={car.img} />
              </div>
              <div className="p-stack-medium flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-base">
                  <h2 className="text-headline-medium font-headline-medium text-on-background line-clamp-1">{car.title}</h2>
                </div>
                <p className="text-label-medium font-label-medium text-secondary mb-stack-medium uppercase tracking-wider">{car.model}</p>
                <div className="flex flex-wrap gap-2 mb-stack-large">
                  <span className="bg-surface-container-low text-secondary px-2 py-1 rounded text-xs font-semibold">{car.year}</span>
                  <span className="bg-surface-container-low text-secondary px-2 py-1 rounded text-xs font-semibold">{car.km}</span>
                  <span className="bg-surface-container-low text-secondary px-2 py-1 rounded text-xs font-semibold">{car.fuel}</span>
                </div>
                <div className="mt-auto pt-stack-medium border-t border-border-subtle flex items-center justify-between">
                  <p className="text-headline-medium font-headline-medium text-primary font-bold">{car.price}</p>
                  <Link to="/car/1" className="text-primary font-semibold text-sm hover:underline flex items-center">
                    Ver detalhes
                    <span className="material-symbols-outlined ml-1" style={{ fontSize: 16 }}>arrow_forward</span>
                  </Link>
                </div>
              </div>
            </article>
          ))}
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
