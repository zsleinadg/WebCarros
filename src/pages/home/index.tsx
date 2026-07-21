import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router"
import { supabase } from "../../services/supabaseClient"
import type { CarProps } from "../../types/car"
import { FUEL_OPTIONS } from "../../constants/fuelList"
import logoImg from "../../assets/logo.svg"
import { WHATSAPP_NUMBER } from "../../constants/whatsapp"

export default function Home() {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [carCount, setCarCount] = useState(0)
  const [featuredCars, setFeaturedCars] = useState<CarProps[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedPrice, setSelectedPrice] = useState("")
  const [selectedFuel, setSelectedFuel] = useState("")
  const navigate = useNavigate()

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: currentYear - 1999 }, (_, i) => String(currentYear - i))

  useEffect(() => {
    async function loadCount() {
      const { count } = await supabase
        .from("cars")
        .select("*", { count: "exact", head: true })
      if (count !== null) setCarCount(count)
    }
    loadCount()
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (selectedYear) params.set("ano", selectedYear)
    if (selectedPrice) params.set("precoMax", selectedPrice)
    if (selectedFuel) params.set("fuel", selectedFuel)
    navigate(`/estoque?${params.toString()}`)
  }

  function handleCategoryClick(category: string) {
    navigate(`/estoque?search=${encodeURIComponent(category)}`)
  }

  const categories = [
    { name: "SUV", icon: "airport_shuttle" },
    { name: "Hatch", icon: "directions_car" },
    { name: "Sedan", icon: "time_to_leave" },
    { name: "Picape", icon: "local_shipping" },
    { name: "Moto", icon: "two_wheeler" },
  ]

  const steps = [
    { icon: "search", title: "1. Encontre", desc: "Explore milhares de veículos com fotos reais e filtros inteligentes. Encontre o carro ideal com poucos cliques." },
    { icon: "chat", title: "2. Converse", desc: "Fale diretamente com o vendedor pelo WhatsApp. Tire dúvidas, negocie e agende uma visita sem intermediários." },
    { icon: "celebration", title: "3. Compre", desc: "Realize a compra com segurança. Todo o suporte necessário para você sair com o carro novo e sem preocupações." },
  ]

  useEffect(() => {
    async function loadFeatured() {
      const { data } = await supabase
        .from("cars")
        .select("*")
        .limit(4)
        .order("created_at", { ascending: false })

      if (data) {
        setFeaturedCars(data as CarProps[])
      }
    }
    loadFeatured()
  }, [])

  function formatPrice(price: string | number) {
    return Number(price).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
  }

  return (
    <>
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=Olá!%20Vi%20o%20WebCarros%20e%20quero%20mais%20informações.`}
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-float flex items-center justify-center w-14 h-14 bg-whatsapp-green text-white rounded-full shadow-lg hover:scale-110 transition-transform duration-200 animate-pulse-whatsapp"
        aria-label="Fale conosco pelo WhatsApp"
      >
        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <section className="relative bg-inverse-surface w-full overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
          <img alt="" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&q=80" />
          <div className="absolute inset-0 bg-linear-to-t from-inverse-surface via-inverse-surface/80 to-transparent"></div>
        </div>
        <div className="relative z-10 max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-large md:py-[80px]">
          <div className="max-w-3xl">
            <h1 className="text-display-large font-display-large font-extrabold text-white mb-stack-small drop-shadow-md">
              Encontre o carro perfeito.
            </h1>
            <p className="text-body-large font-body-large text-tertiary-fixed-dim mb-stack-large">
              Mais de <strong className="text-white">100.000</strong> veículos verificados e prontos para você.
            </p>
            <div className="bg-surface rounded-xl shadow-floating p-6">
              <div className="flex border-b border-border-subtle mb-6 gap-6">
                <Link to="/estoque" className="pb-3 border-b-2 border-primary text-primary font-title-large font-bold">Comprar Carros</Link>
                <Link to="/vender" className="pb-3 text-secondary font-title-large font-semibold hover:text-primary transition-colors">Vender meu carro</Link>
              </div>
              <form onSubmit={handleSearch}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div className="md:col-span-2 relative">
                    <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-secondary uppercase tracking-wider">
                      Marca, Modelo ou Versão
                    </label>
                    <div className="flex items-center border border-border-subtle rounded px-3 py-3 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                      <span className="material-symbols-outlined text-secondary mr-2">search</span>
                      <input
                        className="w-full bg-transparent border-none p-0 focus:ring-0 text-body-medium placeholder:text-secondary-fixed-dim outline-none"
                        placeholder="Ex: Honda Civic"
                        type="text"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-secondary uppercase tracking-wider">Ano</label>
                    <select className="w-full border border-border-subtle rounded px-3 py-3 focus:border-primary focus:ring-1 focus:ring-primary text-body-medium text-on-surface bg-transparent appearance-none" value={selectedYear} onChange={e => setSelectedYear(e.target.value)}>
                      <option value="">Todos</option>
                      {yearOptions.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 text-secondary pointer-events-none">expand_more</span>
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-secondary uppercase tracking-wider">Preço Máx</label>
                    <select className="w-full border border-border-subtle rounded px-3 py-3 focus:border-primary focus:ring-1 focus:ring-primary text-body-medium text-on-surface bg-transparent appearance-none" value={selectedPrice} onChange={e => setSelectedPrice(e.target.value)}>
                      <option value="">Sem limite</option>
                      <option value="30000">Até R$ 30.000</option>
                      <option value="50000">Até R$ 50.000</option>
                      <option value="80000">Até R$ 80.000</option>
                      <option value="100000">Até R$ 100.000</option>
                      <option value="150000">Até R$ 150.000</option>
                      <option value="200000">Até R$ 200.000</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 text-secondary pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 ${showAdvanced ? "" : "hidden"}`}>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-secondary uppercase tracking-wider">Combustível</label>
                    <select className="w-full border border-border-subtle rounded px-3 py-3 focus:border-primary focus:ring-1 focus:ring-primary text-body-medium text-on-surface bg-transparent appearance-none" value={selectedFuel} onChange={e => setSelectedFuel(e.target.value)}>
                      <option value="">Todos</option>
                      {FUEL_OPTIONS.map(f => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 text-secondary pointer-events-none">expand_more</span>
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-secondary uppercase tracking-wider">Câmbio</label>
                    <select className="w-full border border-border-subtle rounded px-3 py-3 focus:border-primary focus:ring-1 focus:ring-primary text-body-medium text-on-surface bg-transparent appearance-none">
                      <option value="">Todos</option>
                      <option>Manual</option>
                      <option>Automático</option>
                      <option>Semi-Automático</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 text-secondary pointer-events-none">expand_more</span>
                  </div>
                  <div className="relative">
                    <label className="absolute -top-2 left-3 bg-surface px-1 text-[10px] font-bold text-secondary uppercase tracking-wider">KM</label>
                    <select className="w-full border border-border-subtle rounded px-3 py-3 focus:border-primary focus:ring-1 focus:ring-primary text-body-medium text-on-surface bg-transparent appearance-none">
                      <option value="">Todos</option>
                      <option>Até 10.000 km</option>
                      <option>10.000 - 30.000 km</option>
                      <option>30.000 - 50.000 km</option>
                      <option>50.000 - 100.000 km</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-3 text-secondary pointer-events-none">expand_more</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-primary font-label-medium flex items-center gap-1 hover:underline cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[16px]">{showAdvanced ? "remove" : "add"}</span>
                    Busca Avançada
                  </button>
                  <button
                    type="submit"
                    className="bg-primary text-white font-label-medium px-8 py-3 rounded hover:bg-webmotors-red-dark transition-colors shadow-sm active:shadow-inner inline-block cursor-pointer"
                  >
                    Ver Ofertas ({carCount.toLocaleString("pt-BR")})
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-large">
        <section className="mb-stack-large">
          <h2 className="text-headline-medium font-headline-medium text-on-background mb-stack-medium">Busque por categoria</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {categories.map((cat) => (
              <button key={cat.name} onClick={() => handleCategoryClick(cat.name)}
                className="flex flex-col items-center justify-center p-4 bg-surface-gray rounded-lg border border-border-subtle hover:border-primary hover:bg-surface-container-low transition-colors group cursor-pointer">
                <span className="material-symbols-outlined text-secondary group-hover:text-primary mb-2" style={{ fontSize: 38}}>{cat.icon}</span>
                <span className="font-label-medium text-on-surface group-hover:text-primary">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        <section className="mb-stack-large bg-surface-container-low rounded-xl p-8 md:p-12 border border-border-subtle">
          <h2 className="text-headline-medium font-headline-medium text-on-background text-center mb-stack-medium">Como funciona</h2>
          <p className="text-body-medium font-body-medium text-secondary text-center max-w-2xl mx-auto mb-stack-large">
            Comprar ou vender seu carro nunca foi tão fácil. São apenas 3 passos simples.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step) => (
              <div key={step.title} className="step-line relative flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mb-4 shadow-md relative z-10">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>{step.icon}</span>
                </div>
                <h3 className="text-title-large font-title-large font-semibold text-on-background mb-2">{step.title}</h3>
                <p className="text-body-small font-body-small text-secondary max-w-xs">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-stack-large">
          <div className="flex justify-between items-end mb-stack-medium">
            <h2 className="text-headline-medium font-headline-medium text-on-background">Carros em Destaque</h2>
            <Link to="/estoque" className="text-primary font-label-medium hover:underline flex items-center gap-1">Ver todos <span className="material-symbols-outlined text-sm">chevron_right</span></Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {featuredCars.map((car) => {
              const imgUrl = car.images?.[0]?.url || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80"
              return (
                <Link key={car.id} to={`/car/${car.id}`}
                  className="bg-surface rounded-xl border border-border-subtle overflow-hidden hover:shadow-ambient transition-shadow group cursor-pointer flex flex-col h-full">
                  <div className="relative aspect-[1.5] overflow-hidden">
                    <img alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={imgUrl} />
                    <div className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide shadow-sm bg-primary">Destaque</div>
                  </div>
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="font-title-large text-on-background line-clamp-1">{car.name}</h3>
                    <p className="font-body-small text-secondary mb-3">{car.model}</p>
                    <div className="text-headline-medium font-headline-medium text-primary font-bold mb-4 mt-auto">{formatPrice(car.price)}</div>
                    <div className="grid grid-cols-2 gap-2 mb-4">
                      <div className="bg-surface-gray rounded px-2 py-1 text-center border border-border-subtle">
                        <span className="block text-[10px] text-secondary uppercase">Ano</span>
                        <span className="font-label-medium text-on-surface">{car.year}</span>
                      </div>
                      <div className="bg-surface-gray rounded px-2 py-1 text-center border border-border-subtle">
                        <span className="block text-[10px] text-secondary uppercase">KM</span>
                        <span className="font-label-medium text-on-surface">{car.km}</span>
                      </div>
                    </div>
                    <div className="flex items-center text-secondary font-body-small pt-3 border-t border-border-subtle">
                      <span className="material-symbols-outlined text-[16px] mr-1">location_on</span>
                      {car.city}, {car.uf}
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>

        <section className="mb-stack-large bg-surface-container-high rounded-xl p-8 flex flex-col md:flex-row items-center justify-between border border-border-subtle">
          <div className="mb-6 md:mb-0 max-w-lg">
            <h2 className="text-headline-medium font-headline-medium text-on-background mb-2">Quer vender seu carro?</h2>
            <p className="text-body-medium font-body-medium text-secondary">
              Anuncie na maior plataforma do Brasil. É rápido, seguro e você alcança milhares de compradores todos os dias.
            </p>
          </div>
          <Link to="/vender" className="bg-primary text-white px-8 py-3 rounded font-label-medium hover:bg-webmotors-red-dark transition-colors w-full md:w-auto text-center whitespace-nowrap shadow-sm inline-block">
            <span className="flex items-center gap-2 justify-center">
              <span className="material-symbols-outlined text-[18px]">add_circle</span>
              Criar anúncio agora
            </span>
          </Link>
        </section>
      </main>

      <footer className="bg-inverse-surface w-full border-t-0">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter py-stack-large px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="block mb-4">
              <img src={logoImg} alt="WebCarros" className="h-8 w-auto" />
            </Link>
            <p className="font-body-small text-surface-variant mb-4">
              A maior e mais segura plataforma para comprar e vender veículos no Brasil.
            </p>
            <div className="flex gap-3">
              <a href="#" className="text-surface-variant hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a href="#" className="text-surface-variant hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="col-span-1 md:col-span-3 flex flex-wrap gap-8 justify-end">
            <nav className="flex flex-col gap-2">
              <span className="font-label-medium text-white uppercase tracking-wider mb-1">A Empresa</span>
              <a className="font-body-small text-surface-variant hover:text-white transition-colors" href="#">Sobre Nós</a>
              <a className="font-body-small text-surface-variant hover:text-white transition-colors" href="#">Carreira</a>
              <a className="font-body-small text-surface-variant hover:text-white transition-colors" href="#">Blog</a>
            </nav>
            <nav className="flex flex-col gap-2">
              <span className="font-label-medium text-white uppercase tracking-wider mb-1">Links</span>
              <Link to="/estoque" className="font-body-small text-surface-variant hover:text-white transition-colors">Comprar</Link>
              <Link to="/vender" className="font-body-small text-surface-variant hover:text-white transition-colors">Vender</Link>
              <a className="font-body-small text-surface-variant hover:text-white transition-colors" href="#">Serviços</a>
              <a className="font-body-small text-surface-variant hover:text-white transition-colors" href="#">Ajuda</a>
            </nav>
            <nav className="flex flex-col gap-2">
              <span className="font-label-medium text-white uppercase tracking-wider mb-1">Legal</span>
              <a className="font-body-small text-surface-variant hover:text-white transition-colors" href="#">Privacidade</a>
              <a className="font-body-small text-surface-variant hover:text-white transition-colors" href="#">Termos de Uso</a>
              <a className="font-body-small text-surface-variant hover:text-white transition-colors" href="#">LGPD</a>
            </nav>
          </div>
        </div>
        <div className="border-t border-on-secondary-fixed-variant py-4 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto text-center md:text-left">
          <p className="font-body-small text-body-small text-surface-variant">&copy; 2026 WebCarros. Todos os direitos reservados.</p>
        </div>
      </footer>
    </>
  )
}
