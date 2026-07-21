import { useState } from "react"
import { Link } from "react-router"
import logoImg from "../../assets/logo.svg"
import { WHATSAPP_NUMBER } from "../../constants/whatsapp"

const brands = ["BMW (45)", "Ford (32)", "VW (28)", "Chevrolet (25)", "Audi (15)"]
const fuels = ["Flex", "Gasolina", "Híbrido", "Elétrico"]

const cars = [
  { img: "https://lh3.googleusercontent.com/aida/AP1WRLsD7imJ-9w1zgikKIHoWCWLlsP9983Rf4Hwz0JN_0nC-UJDBi_K3yUIJppPB2J-UdUxx0O2UIwxhMLW5FtGhz7u28Z-wE_BFnW1JSSc9S0jngYJNfWvX8JG48525PbAGwY5rq_wDMhIxZlO8pjg4V1V7zWKJTEwTXW7y4DWUcwLdSW9nU6r-VzYyqLO64eS49_FfedKhS0nYRbklygZVXfKGvVOe4kbJhN4R8SqCBbymXw7xAmw7FmEN7ge", badge: "Único Dono", title: "BMW X5 xDrive45e M Sport", year: "2023/2023", km: "15.400 km", price: "R$ 689.900", location: "São Paulo, SP" },
  { img: "https://lh3.googleusercontent.com/aida/AP1WRLtqenlvQc_mWgxiPoegpH--Xo-b-xYR6d_i5oWj3zhj3XYzIR0SxG3MHEZ7dh-vEvlSguvexpcwJKUjwr7K_gQGMEwjNr3B70Yi0sAmYmxLV0jGCfo-N5CDcIV9iFgMXQA5qtcTCt8jIS9EbLUZn-fd7qqNbyLUuioxlcillzQ-qzLXq61X8YL8F5rFzQbgpFqMAtVsFQSssDx4ExMn3Jq24_321UM4uapvB1pSDElB7WxLkE1dT4U9hxY", badge: "Oportunidade", title: "Ford Ranger Raptor V6", year: "2024/2024", km: "0 km", price: "R$ 448.600", location: "Curitiba, PR" },
  { img: "https://lh3.googleusercontent.com/aida/AP1WRLuB1FRthB59dDl9rXdGiU3Mlug4nfoYOqron16nemH8V2W4oSvM_tH2Ki3-kXKi-REtE-HDjw_OKu3oECaXHlK3_Wdx52wDb9u3CBw-cL_8baoSIwtAPzfeqYESDYtmQmlLtYBZqXTd9-p2QTGveBrRvjKS_7DF6-JReSz7qeuLDW_r6QQoBKdE5WyFOzlAeYFRdwbpUmp9IplifXxR57cl7b-lGBRMTVpKhlAab1Z2F1fpET4nzKTc93I", badge: "", title: "Mercedes-Benz S580 L", year: "2021/2022", km: "22.000 km", price: "R$ 1.150.000", location: "Belo Horizonte, MG" },
  { img: "https://lh3.googleusercontent.com/aida/AP1WRLt4vrBRLuM8TRH5utDdDC-XVL0UQMxlZwspkis8fviHRnOQAPg9uN30f9OeO7ViXZSSMW1PZk3zFpLSDqkR8Q1OdBsA71u0Z1798oZ8ZV2TG53FO26RuhkhnI1YaDiye6ZK5cwuek2uysSGp_XVOML8Vsj6p979GmBSzZlfDmdW4whtcDTPLVeaLL_ByOHiIhwS7nXb3DwJ-4wjEZUGWmAK9DxPd6ZdrQrJRPpU7z3SpKCcIX9sEdg2WsuN", badge: "Revisado", title: "Hyundai i30 N-Line", year: "2020/2020", km: "45.000 km", price: "R$ 125.900", location: "Porto Alegre, RS" },
]

export default function Estoque() {
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [precoDe, setPrecoDe] = useState("")
  const [precoAte, setPrecoAte] = useState("")
  const [anoDe, setAnoDe] = useState("2020")
  const [anoAte, setAnoAte] = useState("2025")
  const [selectedFuel, setSelectedFuel] = useState("Gasolina")
  const [favorites, setFavorites] = useState<Set<number>>(new Set())
  function toggleBrand(brand: string) {
    setSelectedBrands(prev =>
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    )
  }

  function clearFilters() {
    setSelectedBrands([])
    setPrecoDe("")
    setPrecoAte("")
    setAnoDe("2020")
    setAnoAte("2025")
    setSelectedFuel("Gasolina")
  }

  function toggleFavorite(index: number) {
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  return (
    <>


      <main className="flex-grow max-w-container-max mx-auto w-full px-margin-mobile md:px-margin-desktop py-stack-large">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-stack-medium gap-4">
          <h1 className="text-title-large font-title-large text-on-background">245 carros encontrados</h1>
          <div className="flex items-center gap-2 w-full md:w-auto">
            <label className="text-body-small font-body-small text-secondary whitespace-nowrap" htmlFor="sort">Ordenar por:</label>
            <select className="border border-border-subtle rounded-lg bg-surface-container-lowest text-body-small font-body-small focus:border-primary focus:ring-primary w-full md:w-auto py-2 pl-3 pr-10" id="sort">
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
                  <select className="w-full border border-border-subtle rounded-lg bg-surface text-body-small focus:border-primary focus:ring-primary py-2 px-3" value={anoDe} onChange={e => setAnoDe(e.target.value)}>
                    <option>2020</option>
                    <option>2021</option>
                    <option>2022</option>
                    <option>2023</option>
                    <option>2024</option>
                    <option>2025</option>
                  </select>
                  <span className="text-secondary">-</span>
                  <select className="w-full border border-border-subtle rounded-lg bg-surface text-body-small focus:border-primary focus:ring-primary py-2 px-3" value={anoAte} onChange={e => setAnoAte(e.target.value)}>
                    <option>2025</option>
                    <option>2024</option>
                    <option>2023</option>
                    <option>2022</option>
                    <option>2021</option>
                    <option>2020</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-label-medium font-label-medium text-secondary uppercase mb-3">Combustível</h3>
                <div className="flex flex-wrap gap-2">
                  {fuels.map((comb) => (
                    <button
                      key={comb}
                      onClick={() => setSelectedFuel(comb)}
                      className={`px-3 py-1.5 border rounded-full text-body-small font-body-small transition-colors ${selectedFuel === comb ? "border-primary bg-inverse-on-surface text-primary" : "border-border-subtle hover:border-primary hover:text-primary bg-surface"}`}
                    >
                      {comb}
                    </button>
                  ))}
                </div>
              </div>

              <button className="w-full bg-primary text-on-primary py-3 rounded-lg font-body-medium text-body-medium hover:bg-primary-container transition-colors shadow-sm">
                Aplicar Filtros
              </button>
            </div>
          </aside>

          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-max">
            {cars.map((car, i) => {
              const isFav = favorites.has(i)
              return (
                <article key={i} className="bg-surface-container-lowest rounded-[12px] border border-border-subtle overflow-hidden hover:shadow-lg transition-shadow duration-300 group flex flex-col relative">
                  <div className="relative aspect-video overflow-hidden">
                    <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={car.img} alt="" />
                    {car.badge && (
                      <div className="absolute top-3 left-3 bg-inverse-surface text-on-tertiary px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider shadow-sm z-10">{car.badge}</div>
                    )}
                    <button
                      onClick={() => toggleFavorite(i)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-surface-container-lowest/80 hover:bg-surface-container-lowest transition-colors z-10 shadow-sm backdrop-blur-sm"
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: 20, fontVariationSettings: isFav ? "'FILL' 1" : "'FILL' 0", color: isFav ? "var(--color-primary)" : "var(--color-secondary)" }}>favorite</span>
                    </button>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="text-title-large font-title-large text-on-background mb-1 truncate">{car.title}</h3>
                    <p className="text-body-small font-body-small text-secondary mb-3">{car.year} • {car.km}</p>
                    <div className="mt-auto pt-4 border-t border-border-subtle flex flex-col">
                      <span className="text-headline-medium font-headline-medium font-bold text-primary-container mb-2">{car.price}</span>
                      <div className="flex items-center text-secondary text-body-small font-body-small">
                        <span className="material-symbols-outlined mr-1" style={{ fontSize: 16 }}>location_on</span>
                        {car.location}
                      </div>
                    </div>
                  </div>
                </article>
              )
            })}
            {[1, 2].map((i) => (
              <article key={`skeleton-${i}`} className="bg-surface-container-lowest rounded-[12px] border border-border-subtle overflow-hidden transition-shadow duration-300 flex flex-col relative">
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
            ))}
          </div>
        </div>

        <div className="mt-stack-large flex justify-center items-center gap-2">
          <button className="px-4 py-2 border border-border-subtle rounded-lg text-secondary hover:text-primary hover:border-primary transition-colors font-body-small bg-surface-container-lowest disabled:opacity-50" disabled>Anterior</button>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary text-on-primary font-bold font-body-small shadow-sm">1</button>
          {[2, 3].map((p) => (
            <button key={p} className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle text-secondary hover:border-primary hover:text-primary transition-colors font-body-small bg-surface-container-lowest">{p}</button>
          ))}
          <span className="text-secondary">...</span>
          <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-border-subtle text-secondary hover:border-primary hover:text-primary transition-colors font-body-small bg-surface-container-lowest">12</button>
          <button className="px-4 py-2 border border-border-subtle rounded-lg text-secondary hover:text-primary hover:border-primary transition-colors font-body-small bg-surface-container-lowest">Próximo</button>
        </div>
      </main>

      <footer className="bg-inverse-surface w-full mt-stack-large">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter py-stack-large px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
          <div className="col-span-1 md:col-span-4 mb-4 md:mb-0">
            <Link to="/">
              <img src={logoImg} alt="WebCarros" className="h-8 w-auto" />
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            <a className="text-surface-variant font-body-small text-body-small hover:text-white transition-colors" href="#">Sobre Nós</a>
            <a className="text-surface-variant font-body-small text-body-small hover:text-white transition-colors" href="#">Carreira</a>
          </div>
          <div className="flex flex-col gap-2">
            <a className="text-surface-variant font-body-small text-body-small hover:text-white transition-colors" href="#">Privacidade</a>
            <a className="text-surface-variant font-body-small text-body-small hover:text-white transition-colors" href="#">Termos de Uso</a>
          </div>
          <div className="flex flex-col gap-2">
            <a className="text-surface-variant font-body-small text-body-small hover:text-white transition-colors" href="#">Blog</a>
            <a className="text-surface-variant font-body-small text-body-small hover:text-white transition-colors" href="#">Parceiros</a>
          </div>
          <div className="col-span-1 md:col-span-4 mt-8 pt-4 border-t border-secondary/30 text-on-tertiary font-body-small text-body-small opacity-80">
            © 2024 WebCarros. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      <a className="fixed bottom-6 right-6 bg-whatsapp-green text-white p-4 rounded-full shadow-lg hover:-translate-y-1 transition-transform z-50 flex items-center justify-center" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
        <svg fill="currentColor" height="24" viewBox="0 0 16 16" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.601 2.326A7.854 7.854 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.933 7.933 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.898 7.898 0 0 0 13.6 2.326zM7.994 14.521a6.573 6.573 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.557 6.557 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592zm3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.005-.247-.007-.38-.007a.729.729 0 0 0-.529.247c-.182.198-.691.677-.691 1.654 0 .977.71 1.916.81 2.049.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232z"></path>
        </svg>
      </a>
    </>
  )
}
