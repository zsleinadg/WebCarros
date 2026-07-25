import { useEffect, useState, useMemo } from "react"
import { Link, useSearchParams } from "react-router"
import { supabase } from "../../services/supabaseClient"
import type { CarProps } from "../../types/car"
import { WHATSAPP_NUMBER } from "../../constants/whatsapp"
import { FUEL_OPTIONS } from "../../constants/fuelList"
import { formatPrice } from "../../utils"
import { useFavorites } from "../../contexts/FavoritesContext"
import { FaHeart } from "react-icons/fa"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/select"

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
    <main
      className="mx-auto w-full px-4 md:px-10 py-8 min-h-screen"
      style={{ background: "var(--bg-main)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-white">Encontramos {filteredCars.length} carros</h1>
            <span style={{ color: "var(--text-secondary)" }}>em todo o Brasil</span>
          </div>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-sm whitespace-nowrap" style={{ color: "var(--text-secondary)" }} htmlFor="sort">Ordenar por:</label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full md:w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mais recentes">Mais recentes</SelectItem>
                <SelectItem value="Menor preço">Menor preço</SelectItem>
                <SelectItem value="Maior preço">Maior preço</SelectItem>
                <SelectItem value="Menor KM">Menor KM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-72 shrink-0">
            <div
              className="rounded-xl p-6 sticky top-24"
              style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)", boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold text-white">Filtros</h2>
                <button
                  onClick={clearFilters}
                  className="text-sm font-medium hover:underline cursor-pointer"
                  style={{ color: "var(--accent)" }}
                >
                  Limpar
                </button>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: "var(--text-secondary)" }}>Buscar</h3>
                <div
                  className="flex items-center rounded-lg px-3 py-2 transition-all"
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)" }}
                  onFocusCapture={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = "var(--accent)"
                    el.style.boxShadow = "0 0 0 3px rgba(233,0,63,0.12)"
                  }}
                  onBlurCapture={(e) => {
                    const el = e.currentTarget
                    el.style.borderColor = "var(--border-default)"
                    el.style.boxShadow = "none"
                  }}
                >
                  <span className="material-symbols-outlined mr-2" style={{ fontSize: 18, color: "var(--text-muted)" }}>search</span>
                  <input
                    className="w-full bg-transparent border-none p-0 text-sm outline-none"
                    style={{ color: "var(--text-primary)" }}
                    placeholder="Marca, modelo ou cidade..."
                    type="text"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: "var(--text-secondary)" }}>Marca</h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                  {brands.map((marca) => (
                    <label key={marca} className="flex items-center gap-2 cursor-pointer">
                      <input
                        className="rounded accent-[#E9003F]"
                        type="checkbox"
                        checked={selectedBrands.includes(marca)}
                        onChange={() => toggleBrand(marca)}
                      />
                      <span className="text-sm" style={{ color: "var(--text-primary)" }}>{marca}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: "var(--text-secondary)" }}>Preço</h3>
                <div className="flex gap-2 items-center">
                  <input
                    className="w-full rounded-lg text-sm py-2 px-3 outline-none no-spinner"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                    placeholder="De"
                    type="text"
                    inputMode="numeric"
                    value={precoDe}
                    onChange={e => setPrecoDe(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault()
                    }}
                  />
                  <span style={{ color: "var(--text-muted)" }}>-</span>
                  <input
                    className="w-full rounded-lg text-sm py-2 px-3 outline-none no-spinner"
                    style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                    placeholder="Até"
                    type="text"
                    inputMode="numeric"
                    value={precoAte}
                    onChange={e => setPrecoAte(e.target.value.replace(/\D/g, ""))}
                    onKeyDown={(e) => {
                      if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault()
                    }}
                  />
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: "var(--text-secondary)" }}>Ano</h3>
                <div className="flex gap-2 items-center">
                  <Select value={anoDe} onValueChange={(val) => { setAnoDe(val); if (Number(val) > Number(anoAte)) setAnoAte(val) }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Mínimo" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueYears.map(y => (
                        <SelectItem key={y} value={String(y)}>{String(y)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span style={{ color: "var(--text-muted)" }}>-</span>
                  <Select value={anoAte} onValueChange={(val) => { setAnoAte(val); if (Number(val) < Number(anoDe)) setAnoDe(val) }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Máximo" />
                    </SelectTrigger>
                    <SelectContent>
                      {uniqueYears.map(y => (
                        <SelectItem key={y} value={String(y)}>{String(y)}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-xs font-semibold uppercase mb-3" style={{ color: "var(--text-secondary)" }}>Combustível</h3>
                <div className="flex flex-wrap gap-2">
                  {FUEL_OPTIONS.map((comb) => {
                    const isSelected = selectedFuel === comb
                    return (
                      <button
                        key={comb}
                        onClick={() => setSelectedFuel(isSelected ? "" : comb)}
                        className="px-3 py-1.5 border rounded-full text-sm font-medium transition-all cursor-pointer"
                        style={{
                          background: isSelected ? "rgba(233,0,63,0.12)" : "var(--bg-secondary)",
                          borderColor: isSelected ? "var(--accent)" : "var(--border-default)",
                          color: isSelected ? "var(--accent)" : "var(--text-secondary)",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected) e.currentTarget.style.borderColor = "var(--accent)"
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = isSelected ? "var(--accent)" : "var(--border-default)"
                        }}
                      >
                        {comb}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </aside>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            {loading ? (
              [1, 2, 3, 4, 5, 6].map((i) => (
                <article
                  key={`skeleton-${i}`}
                  className="rounded-xl overflow-hidden animate-pulse flex flex-col relative"
                  style={{
                    background: "linear-gradient(145deg, var(--bg-elevated), var(--bg-card))",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <div className="relative aspect-video overflow-hidden flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 48, color: "var(--border-default)" }}>directions_car</span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <div className="h-6 rounded mb-2 w-3/4" style={{ background: "var(--border-default)" }}></div>
                    <div className="h-4 rounded mb-4 w-1/2" style={{ background: "var(--border-default)" }}></div>
                    <div className="mt-auto pt-4 border-t flex flex-col" style={{ borderColor: "var(--border-default)" }}>
                      <div className="h-8 rounded mb-2 w-1/2" style={{ background: "var(--border-default)" }}></div>
                      <div className="h-4 rounded w-1/3" style={{ background: "var(--border-default)" }}></div>
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
                    <article
                      className="rounded-xl overflow-hidden transition-all duration-300 group flex flex-col relative"
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
                      <div className="relative aspect-video overflow-hidden">
                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={imgUrl} alt="" />
                        <button
                          onClick={(e) => { e.preventDefault(); toggleFavorite(car.id) }}
                          className="absolute top-3 right-3 flex items-center justify-center w-9 h-9 rounded-full backdrop-blur-sm transition-colors z-10 shadow-sm"
                          style={{ background: "rgba(16,22,37,0.8)" }}
                        >
                          {isFav ? (
                            <FaHeart size={20} style={{ color: "var(--accent)" }} />
                          ) : (
                            <FaHeart size={20} style={{ color: "var(--text-muted)" }} />
                          )}
                        </button>
                      </div>
                      <div className="p-4 flex flex-col flex-1">
                        <h3 className="text-lg font-bold text-white mb-1 truncate">{car.name}</h3>
                        <p className="text-sm mb-3" style={{ color: "var(--text-muted)" }}>{car.year} • {car.km} km</p>
                        <div className="mt-auto pt-4 border-t flex flex-col" style={{ borderColor: "var(--border-default)" }}>
                          <span className="text-2xl font-black mb-2" style={{ color: "var(--accent)" }}>{formatPrice(car.price)}</span>
                          <div className="flex items-center text-sm" style={{ color: "var(--text-secondary)" }}>
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
      </div>
    </main>

      <a
        className="fixed bottom-6 right-6 p-4 rounded-full shadow-lg hover:-translate-y-1 transition-transform z-50 flex items-center justify-center"
        style={{ background: "#25D366" }}
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        <svg fill="currentColor" height="24" viewBox="0 0 16 16" width="24" xmlns="http://www.w3.org/2000/svg" style={{ color: "white" }}>
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.005-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path>
        </svg>
      </a>
    </>
  )
}
