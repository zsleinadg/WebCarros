import { FUEL_OPTIONS } from "../../../constants/fuelList"

interface SearchCardProps {
  searchTerm: string
  setSearchTerm: (v: string) => void
  selectedYear: string
  setSelectedYear: (v: string) => void
  selectedPrice: string
  setSelectedPrice: (v: string) => void
  selectedFuel: string
  setSelectedFuel: (v: string) => void
  selectedTransmission: string
  setSelectedTransmission: (v: string) => void
  selectedKmRange: string
  setSelectedKmRange: (v: string) => void
  showAdvanced: boolean
  setShowAdvanced: (v: boolean) => void
  searchTab: "comprar" | "vender"
  setSearchTab: (v: "comprar" | "vender") => void
  carCount: number
  yearOptions: string[]
  onSearch: (e: React.FormEvent) => void
}

export default function SearchCard({
  searchTerm, setSearchTerm,
  selectedYear, setSelectedYear,
  selectedPrice, setSelectedPrice,
  selectedFuel, setSelectedFuel,
  selectedTransmission, setSelectedTransmission,
  selectedKmRange, setSelectedKmRange,
  showAdvanced, setShowAdvanced,
  searchTab, setSearchTab,
  carCount, yearOptions, onSearch,
}: SearchCardProps) {
  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full -mb-16 sm:-mb-20 pb-8">
      <div className="bg-white rounded-2xl shadow-2xl p-5 sm:p-6 w-full max-w-2xl">
        <div className="flex gap-1 mb-5 border-b border-gray-100">
          {[
            { key: "comprar", label: "Comprar" },
            { key: "vender", label: "Vender meu carro" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSearchTab(key as "comprar" | "vender")}
              className={`pb-3 px-1 mr-4 text-sm font-semibold border-b-2 transition-colors -mb-px cursor-pointer ${searchTab === key
                ? "text-red-600 border-red-600"
                : "text-gray-400 border-transparent hover:text-gray-600"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={onSearch}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
                Marca, modelo ou versão
              </label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 focus-within:border-red-400 transition-colors">
                <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Ex: Toyota Corolla"
                  className="text-sm text-gray-700 placeholder-gray-400 outline-none w-full"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Ano</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-red-400 transition-colors appearance-none bg-white"
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
              >
                <option value="">Todos</option>
                {yearOptions.map(y => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Preço máx.</label>
              <select
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-red-400 transition-colors appearance-none bg-white"
                value={selectedPrice}
                onChange={e => setSelectedPrice(e.target.value)}
              >
                <option value="">Sem limite</option>
                <option value="30000">Até R$ 30.000</option>
                <option value="50000">Até R$ 50.000</option>
                <option value="80000">Até R$ 80.000</option>
                <option value="100000">Até R$ 100.000</option>
                <option value="150000">Até R$ 150.000</option>
                <option value="200000">Até R$ 200.000</option>
              </select>
            </div>
          </div>

          <div className={`mt-4 ${showAdvanced ? "" : "hidden"}`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Combustível</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-red-400 transition-colors appearance-none bg-white"
                  value={selectedFuel}
                  onChange={e => setSelectedFuel(e.target.value)}
                >
                  <option value="">Todos</option>
                  {FUEL_OPTIONS.map(f => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">Câmbio</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-red-400 transition-colors appearance-none bg-white"
                  value={selectedTransmission}
                  onChange={e => setSelectedTransmission(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="Manual">Manual</option>
                  <option value="Automático">Automático</option>
                  <option value="Semi-Automático">Semi-Automático</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">KM</label>
                <select
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-600 outline-none focus:border-red-400 transition-colors appearance-none bg-white"
                  value={selectedKmRange}
                  onChange={e => setSelectedKmRange(e.target.value)}
                >
                  <option value="">Todos</option>
                  <option value="ate-10000">Até 10.000 km</option>
                  <option value="10000-30000">10.000 - 30.000 km</option>
                  <option value="30000-50000">30.000 - 50.000 km</option>
                  <option value="50000-100000">50.000 - 100.000 km</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-red-600 hover:text-red-500 font-semibold transition-colors cursor-pointer"
            >
              {showAdvanced ? "- Ocultar" : "+ Busca avançada"}
            </button>
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-500 transition-colors text-white font-bold px-6 py-2.5 rounded-lg text-sm cursor-pointer"
            >
              Ver ofertas ({carCount.toLocaleString("pt-BR")})
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
