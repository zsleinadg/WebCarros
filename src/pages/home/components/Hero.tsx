import { useState, useCallback, useRef, useEffect } from "react"
import heroBg from "../../../assets/hero-bg.png"
import carBg from "../../../assets/car-bg.png"

interface HeroProps {
  carCount: number
}

export default function Hero({ carCount }: HeroProps) {
  return (
    <div className="relative flex-1 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-32 sm:pb-44 w-full pointer-events-none">
      <div className="max-w-full">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
          Encontre o carro
          <br /> 
          <span className="text-[#E9003F]">perfeito</span> para você
        </h1>
        <p className="text-[#A5ADBD] text-base md:text-lg sm:text-2xl leading-relaxed mb-2">
          Mais de <span className="text-white font-bold">{carCount.toLocaleString("pt-BR")}</span> veículos verificados <br /> e prontos para você.
        </p>
      </div>
    </div>
  )
}

export function HeroBackground() {
  const [isOverCar, setIsOverCar] = useState(false)
  const carPixelsRef = useRef<Uint8ClampedArray | null>(null)
  const carSizeRef = useRef({ w: 0, h: 0 })
  const carLayerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const img = new Image()
    img.src = carBg
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
    <div
      className="absolute inset-0 overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={heroBg}
        alt="Carro esportivo"
        className="w-full h-full object-cover object-center"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(195deg, rgba(5,7,13,0.96) 0%, rgba(5,7,13,0.65) 28%, rgba(5,7,13,0.30) 85%, rgba(5,7,13,0.15) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-48"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(5,7,13,0.55))",
        }}
      />
      <div ref={carLayerRef} className="absolute inset-0 pointer-events-none">
        <img
          src={carBg}
          alt=""
          className="w-full h-full object-cover object-center pointer-events-auto"
          style={{
            filter: isOverCar ? "drop-shadow(0 0 40px rgba(233,0,63,0.6))" : "drop-shadow(0 0 0 transparent)",
            transition: "filter 0.4s ease",
          }}
        />
        {/* <div
          className="absolute inset-0 pointer-events-none"
          style={{
            maskImage: `url(${carBg})`,
            WebkitMaskImage: `url(${carBg})`,
            maskSize: "cover",
            maskPosition: "center",
            maskRepeat: "no-repeat",
            backgroundColor: "rgba(0,0,0,0.2)",
          }}
        /> */}
      </div>
    </div>
  )
}