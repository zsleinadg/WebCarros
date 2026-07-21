import { useEffect, useState, useMemo } from "react"
import { Link, useSearchParams } from "react-router"
import { supabase } from "../../services/supabaseClient"
import type { CarProps } from "../../types/car"
import { WHATSAPP_NUMBER } from "../../constants/whatsapp"
import { FUEL_OPTIONS } from "../../constants/fuelList"
import { formatPrice } from "../../utils"
import { useFavorites } from "../../contexts/FavoritesContext"
import { FaHeart, FaRegHeart } from "react-icons/fa"

export default function Estoque() {
  const [searchParams] = useSearchParams()
  const initialSearch = searchParams.get("search") || ""
  const initialAno = searchParams.get("ano") || ""
  const initialPrecoMax = searchParams.get("precoMax") || ""
  const initialFuel = searchParams.get("fuel") || ""

  const [allCars, setAllCars] = useState<CarProps[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [precoDe, setPrecoDe] = useState("")
  const [precoAte, setPrecoAte] = useState(initialPrecoMax)
  const [anoDe, setAnoDe] = useState(initialAno || "")
  const [anoAte, setAnoAte] = useState(initialAno || "")
  const [selectedFuel, setSelectedFuel] = useState(initialFuel)
  const [searchTerm, setSearchTerm] = useState(initialSearch)
  const { favorites, toggleFavorite } = useFavorites()
  const [sortOrder, setSortOrder] = useState("Mais recentes")

  useEffect(() => {
    async function loadCars() {
      setLoading(true)
      const { data, error } = await supabase
        .from("cars")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Erro ao buscar carros:", error)
      }
      if (data) {
        setAllCars(data as CarProps[])
      }
      setLoading(false)
    }
    loadCars()
  }, [])

  const brands = useMemo(() => {
    const map = new Map<string, number>()
    allCars.forEach(car => {
      const brand = car.name.split(" ")[0]
      map.set(brand, (map.get(brand) || 0) + 1)
    })
    return Array.from(map.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([b, c]) => `${b} (${c})`)
  }, [allCars])

  const uniqueYears = useMemo(() => {
    const years = new Set<number>()
    allCars.forEach(car => {
      const match = car.year.match(/\d{4}/)
      if (match) years.add(Number(match[0]))
    })
    return Array.from(years).sort((a, b) => b - a)
  }, [allCars])

  const filteredCars = useMemo(() => {
    let result = allCars.filter(car => {
      if (searchTerm) {
        const term = searchTerm.toLowerCase()
        const matches = car.name.toLowerCase().includes(term) ||
          car.model.toLowerCase().includes(term) ||
          car.city.toLowerCase().includes(term)
        if (!matches) return false
      }
      if (selectedBrands.length > 0) {
        const carBrand = car.name.split(" ")[0]
        const selectedNames = selectedBrands.map(b => b.split(" (")[0])
        if (!selectedNames.includes(carBrand)) return false
      }
      if (precoDe && Number(car.price) < Number(precoDe)) return false
      if (precoAte && Number(car.price) > Number(precoAte)) return false
      const yearMatch = car.year.match(/\d{4}/)
      if (yearMatch) {
        const year = Number(yearMatch[0])
        if (anoDe && year < Number(anoDe)) return false
        if (anoAte && year > Number(anoAte)) return false
      }
      if (selectedFuel && car.fuel && car.fuel !== selectedFuel) return false
      return true
    })

    if (sortOrder === "Menor preço") {
      result = [...result].sort((a, b) => Number(a.price) - Number(b.price))
    } else if (sortOrder === "Maior preço") {
      result = [...result].sort((a, b) => Number(b.price) - Number(a.price))
    } else if (sortOrder === "Menor KM") {
      result = [...result].sort((a, b) => Number(a.km.replace(/\D/g, "")) - Number(b.km.replace(/\D/g, "")))
    }

    return result
  }, [allCars, selectedBrands, precoDe, precoAte, anoDe, anoAte, selectedFuel, searchTerm, sortOrder])

  function toggleBrand(brand: string) {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  function clearFilters() {
    setSelectedBrands([])
    setPrecoDe("")
    setPrecoAte("")
    setAnoDe("")
    setAnoAte("")
    setSelectedFuel("")
    setSearchTerm("")
  }

  return (
    <>


      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-large">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-stack-medium gap-4">
          <h1 className="text-title-large font-title-large text-on-background">{filteredCars.length} carros encontrados</h1>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-body-small font-body-small text-secondary whitespace-nowrap" htmlFor="sort">Ordenar por:</label>
            <select className="border border-border-subtle rounded-lg bg-surface-container-lowest text-body-small font-body-small focus:border-primary focus:ring-primary w-full md:w-auto py-2 pl-3 pr-10" id="sort" value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
              <option>Mais recentes</option>
              <option>Menor preço</option>
              <option>Maior preço</option>
              <option>Menor KM</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-gutter">
          <aside className="w-full md:w-72 flex-shrink-0">
            <div className="bg-surface-container-lowest border border-border-subtle rounded-[12px] p-6 shadow-sm sticky top-24">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-title-large font-title-large text-on-background">Filtros</h2>
                <button onClick={clearFilters} className="text-primary text-body-small font-body-small hover:underline">Limpar</button>
              </div>

              <div className="mb-6">
                <h3 className="text-label-medium font-label-medium text-secondary uppercase mb-3">Buscar</h3>
                <div className="flex items-center border border-border-subtle rounded-lg px-3 py-2 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all bg-surface">
                  <span className="material-symbols-outlined text-secondary mr-2" style={{ fontSize: 18 }}>search</span>
                  <input
                    className="w-full bg-transparent border-none p-0 focus:ring-0 text-body-small placeholder:text-secondary-fixed-dim outline-none"
                    placeholder="Marca, modelo ou cidade..."
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-label-medium font-label-medium text-secondary uppercase mb-3">Marca</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {brands.map((marca) => (
                    <label key={marca} className="flex items-center gap-2 cursor-pointer">
                      <input
                        className="rounded border-border-subtle text-primary focus:ring-primary"
                        type="checkbox"
                        checked={selectedBrands.includes(marca)}
                        onChange={() => toggleBrand(marca)}
                      />
                      <span className="text-body-small font-body-small">{marca}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-label-medium font-label-medium text-secondary uppercase mb-3">Preço</h3>
                <div className="flex gap-2 items-center">
                  <input className="w-full border border-border-subtle rounded-lg bg-surface text-body-small focus:border-primary focus:ring-primary py-2 px-3" placeholder="De" type="number" value={precoDe} onChange={e => setPrecoDe(e.target.value)} />
                  <span className="text-secondary">-</span>
                  <input className="w-full border border-border-subtle rounded-lg bg-surface text-body-small focus:border-primary focus:ring-primary py-2 px-3" placeholder="Até" type="number" value={precoAte} onChange={e => setPrecoAte(e.target.value)} />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-label-medium font-label-medium text-secondary uppercase mb-3">Ano</h3>
                <div className="flex gap-2 items-center">
                  <select className="w-full border border-border-subtle rounded-lg bg-surface text-body-small focus:border-primary focus:ring-primary py-2 px-3" value={anoDe} onChange={e => { setAnoDe(e.target.value); if (Number(e.target.value) > Number(anoAte)) setAnoAte(e.target.value) }}>
                    <option value="">Mínimo</option>
                    {uniqueYears.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                  <span className="text-secondary">-</span>
                  <select className="w-full border border-border-subtle rounded-lg bg-surface text-body-small focus:border-primary focus:ring-primary py-2 px-3" value={anoAte} onChange={e => { setAnoAte(e.target.value); if (Number(e.target.value) < Number(anoDe)) setAnoDe(e.target.value) }}>
                    <option value="">Máximo</option>
                    {uniqueYears.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-label-medium font-label-medium text-secondary uppercase mb-3">Combustível</h3>
                <div className="flex flex-wrap gap-2">
                  {FUEL_OPTIONS.map((comb) => (
                    <button
                      key={comb}
                      onClick={() => setSelectedFuel(selectedFuel === comb ? "" : comb)}
                      className={`px-3 py-1.5 border rounded-full text-body-small font-body-small transition-colors ${selectedFuel === comb ? "border-primary bg-inverse-on-surface text-primary" : "border-border-subtle hover:border-primary hover:text-primary bg-surface"}`}
                    >
                      {comb}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <article key={`skeleton-${i}`} className="bg-surface-container-lowest rounded-[12px] border border-border-subtle overflow-hidden animate-pulse flex flex-col relative">
                  <div className="relative aspect-video overflow-hidden bg-surface-container-high flex items-center justify-center">
                    <span className="material-symbols-outlined text-tertiary-fixed-dim" style={{ fontSize: 48 }}>directions_car</span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="h-6 bg-surface-container rounded mb-2 w-3/4"></div>
                    <div className="h-4 bg-surface-container rounded mb-4 w-1/2"></div>
                    <div className="mt-auto pt-4 border-t border-border-subtle flex flex-col">
                      <div className="h-8 bg-surface-container rounded mb-2 w-1/2"></div>
                      <div className="h-4 bg-surface-container rounded w-1/3"></div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              filteredCars.map((car) => {
                const isFav = favorites.has(car.id)
                const imgUrl = car.images?.[0]?.url || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80"
                return (
                  <Link key={car.id} to={`/car/${car.id}`} className="block">
                    <article className="bg-surface-container-lowest rounded-[12px] border border-border-subtle overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col relative">
                      <div className="relative aspect-video overflow-hidden">
                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={imgUrl} alt="" />
                        <button
                          onClick={(e) => { e.preventDefault(); toggleFavorite(car.id) }}
                          className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest transition-colors z-10 shadow-sm backdrop-blur-sm"
                        >
                          {isFav ? <FaHeart size={20} color="#ef4444" /> : <FaRegHeart size={20} color="var(--color-secondary)" />}
                        </button>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-title-large font-title-large text-on-background mb-1 truncate">{car.name}</h3>
                        <p className="text-body-small font-body-small text-secondary mb-3">{car.year} • {car.km} km</p>
                        <div className="mt-auto pt-4 border-t border-border-subtle flex flex-col">
                          <span className="text-headline-medium font-headline-medium font-bold text-primary-container mb-2">{formatPrice(car.price)}</span>
                          <div className="flex items-center text-secondary text-body-small font-body-small">
                            <span className="material-symbols-outlined mr-1" style={{ fontSize: 16 }}>location_on</span>
                            {car.city}, {car.uf}
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                )
              })
            )}
          </div>
        </div>

      </main>



      <a className="fixed bottom-6 right-6 bg-whatsapp-green text-white p-4 rounded-full shadow-lg hover:-translate-y-1 transition-transform z-50 flex items-center justify-center" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
        <svg fill="currentColor" height="24" viewBox="0 0 16 16" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.005-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path>
        </svg>
      </a>
    </>
  )
}
