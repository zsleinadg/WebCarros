import { useState, useCallback, useRef, useEffect } from "react"
import { Link } from "react-router"
import sellBg from "../../../assets/sellcar-section.png"
import carSellBg from "../../../assets/car-sellcar-bg.png"

export default function SellBanner() {
  const [isOverCar, setIsOverCar] = useState(false)
  const carPixelsRef = useRef<Uint8ClampedArray | null>(null)
  const carSizeRef = useRef({ w: 0, h: 0 })
  const carLayerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const img = new Image()
    img.src = carSellBg
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (!ctx) return
      ctx.drawImage(img, 0, 0)
      const data = ctx.getImageData(0, 0, img.width, img.height)
      carPixelsRef.current = data.data
      carSizeRef.current = { w: img.width, h: img.height }
    }
  }, [])

  const checkIsOverCar = useCallback((clientX: number, clientY: number) => {
    const pixels = carPixelsRef.current
    const { w, h } = carSizeRef.current
    const el = carLayerRef.current
    if (!pixels || !w || !h || !el) return false

    const rect = el.getBoundingClientRect()
    const mx = clientX - rect.left
    const my = clientY - rect.top
    const scale = Math.max(rect.width / w, rect.height / h)
    const startX = Math.max(0, (w * scale - rect.width) / 2 / scale)
    const startY = Math.max(0, (h * scale - rect.height) / 2 / scale)
    const imgX = startX + mx / scale
    const imgY = startY + my / scale

    if (imgX < 0 || imgX >= w || imgY < 0 || imgY >= h) return false

    const px = Math.floor(imgX)
    const py = Math.floor(imgY)
    return pixels[(py * w + px) * 4 + 3] > 30
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsOverCar(checkIsOverCar(e.clientX, e.clientY))
  }, [checkIsOverCar])

  const handleMouseLeave = useCallback(() => {
    setIsOverCar(false)
  }, [])

  return (
    <div className="w-full bg-[#080B14]">
    <section
      className="max-w-10/12 mx-auto bg-[#080B14]"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative rounded-2xl overflow-hidden py-16 sm:pt-20 sm:pb-40 border-[#20283A] border-2">
        <div className="absolute inset-0 overflow-hidden">
          <img src={sellBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
          <div ref={carLayerRef} className="absolute inset-0 pointer-events-none">
            <img
              src={carSellBg}
              alt=""
              className="w-full h-full object-cover object-center pointer-events-auto"
              style={{
                filter: isOverCar ? "drop-shadow(0 0 40px rgba(0, 150, 255, 0.6))" : "drop-shadow(0 0 0 transparent)",
                transition: "filter 0.4s ease",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                maskImage: `url(${carSellBg})`,
                WebkitMaskImage: `url(${carSellBg})`,
                maskSize: "cover",
                maskPosition: "center",
                maskRepeat: "no-repeat",
                backgroundColor: "rgba(0,0,0,0.2)",
              }}
            />
          </div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
                Venda seu carro com facilidade
              </h2>
              <p className="text-white/50 mb-8 text-base">
                Anuncie grátis e venda mais rápido com a WebCarros.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    title: "Anúncio 100% gratuito",
                    desc: "Sem taxas ou comissões.",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                    title: "Venda mais rápido",
                    desc: "Conecte-se com compradores reais.",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ),
                    title: "Mais visibilidade",
                    desc: "Seu anúncio para milhares de pessoas.",
                  },
                ].map((b) => (
                  <div key={b.title} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-600/15 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                      {b.icon}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{b.title}</div>
                      <div className="text-white/40 text-sm">{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/vender"
                className="inline-block bg-red-600 hover:bg-red-500 transition-colors text-white font-bold px-6 py-3 rounded-xl text-sm"
              >
                Quero vender meu carro
              </Link>
            </div>
            <div className="lg:flex-1 flex justify-center lg:justify-end w-full lg:w-auto">
            </div>
          </div>
        </div>
      </div>
    </section>
      </div>
  )
}
