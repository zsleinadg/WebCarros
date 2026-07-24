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
      <div
        className="rounded-2xl p-5 sm:p-6 w-full max-w-3xl min-h-70"
        style={{
          background: "linear-gradient(135deg, rgba(18,23,37,0.97), rgba(8,12,21,0.97))",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.45)",
        }}
      >
        <div className="flex gap-1 mb-5 border-b border-[#20283A]">
          {[
            { key: "comprar", label: "Comprar" },
            { key: "vender", label: "Vender meu carro" },
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setSearchTab(key as "comprar" | "vender")}
              className={`pb-3 px-1 mr-4 text-sm font-semibold border-b-2 transition-colors -mb-px cursor-pointer ${searchTab === key
                  ? "text-[#E9003F] border-[#E9003F]"
                  : "text-[#A5ADBD] border-transparent hover:text-white"
                }`}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={onSearch} className="gap-4 flex  flex-col">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-1">
              <label className="block text-xs font-semibold text-[#A5ADBD] mb-1.5 uppercase tracking-wide">
                Marca, modelo ou versão
              </label>
              <div
                className="flex items-center gap-2 rounded-lg px-3 py-2.5 transition-colors"
                style={{
                  background: "#101625",
                  border: "1px solid #20283A",
                }}
                onFocusCapture={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#E9003F";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 0 0 3px rgba(233,0,63,0.12)";
                }}
                onBlurCapture={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = "#20283A";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <svg className="w-4 h-4 text-[#687286] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Ex: Toyota Corolla"
                  className="text-sm text-white placeholder-[#687286] outline-none w-full bg-transparent"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#A5ADBD] mb-1.5 uppercase tracking-wide">Ano</label>
              <select
                className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none appearance-none"
                style={{
                  background: "#101625",
                  border: "1px solid #20283A",
                }}
                value={selectedYear}
                onChange={e => setSelectedYear(e.target.value)}
              >
                <option value="" className="bg-[#080B14]">Todos</option>
                {yearOptions.map(y => (
                  <option key={y} value={y} className="bg-[#080B14]">{y}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#A5ADBD] mb-1.5 uppercase tracking-wide">Preço máx.</label>
              <select
                className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none appearance-none"
                style={{
                  background: "#101625",
                  border: "1px solid #20283A",
                }}
                value={selectedPrice}
                onChange={e => setSelectedPrice(e.target.value)}
              >
                <option value="" className="bg-[#080B14]">Sem limite</option>
                <option value="30000" className="bg-[#080B14]">Até R$ 30.000</option>
                <option value="50000" className="bg-[#080B14]">Até R$ 50.000</option>
                <option value="80000" className="bg-[#080B14]">Até R$ 80.000</option>
                <option value="100000" className="bg-[#080B14]">Até R$ 100.000</option>
                <option value="150000" className="bg-[#080B14]">Até R$ 150.000</option>
                <option value="200000" className="bg-[#080B14]">Até R$ 200.000</option>
              </select>
            </div>
          </div>

          <div className={`mt-4 ${showAdvanced ? "" : "hidden"}`}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#A5ADBD] mb-1.5 uppercase tracking-wide">Combustível</label>
                <select
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none appearance-none"
                  style={{
                    background: "#101625",
                    border: "1px solid #20283A",
                  }}
                  value={selectedFuel}
                  onChange={e => setSelectedFuel(e.target.value)}
                >
                  <option value="" className="bg-[#080B14]">Todos</option>
                  {FUEL_OPTIONS.map(f => (
                    <option key={f} value={f} className="bg-[#080B14]">{f}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#A5ADBD] mb-1.5 uppercase tracking-wide">Câmbio</label>
                <select
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none appearance-none"
                  style={{
                    background: "#101625",
                    border: "1px solid #20283A",
                  }}
                  value={selectedTransmission}
                  onChange={e => setSelectedTransmission(e.target.value)}
                >
                  <option value="" className="bg-[#080B14]">Todos</option>
                  <option value="Manual" className="bg-[#080B14]">Manual</option>
                  <option value="Automático" className="bg-[#080B14]">Automático</option>
                  <option value="Semi-Automático" className="bg-[#080B14]">Semi-Automático</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#A5ADBD] mb-1.5 uppercase tracking-wide">KM</label>
                <select
                  className="w-full rounded-lg px-3 py-2.5 text-sm text-white outline-none appearance-none"
                  style={{
                    background: "#101625",
                    border: "1px solid #20283A",
                  }}
                  value={selectedKmRange}
                  onChange={e => setSelectedKmRange(e.target.value)}
                >
                  <option value="" className="bg-[#080B14]">Todos</option>
                  <option value="ate-10000" className="bg-[#080B14]">Até 10.000 km</option>
                  <option value="10000-30000" className="bg-[#080B14]">10.000 - 30.000 km</option>
                  <option value="30000-50000" className="bg-[#080B14]">30.000 - 50.000 km</option>
                  <option value="50000-100000" className="bg-[#080B14]">50.000 - 100.000 km</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-sm text-[#E9003F] hover:text-[#FF174F] font-semibold transition-colors cursor-pointer"
            >
              {showAdvanced ? "- Ocultar" : "+ Busca avançada"}
            </button>
            <button
              type="submit"
              className="bg-[#E9003F] hover:bg-[#FF174F] transition-colors text-white font-bold px-6 py-2.5 rounded-lg text-sm cursor-pointer"
            >
              Ver ofertas ({carCount.toLocaleString("pt-BR")})
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
