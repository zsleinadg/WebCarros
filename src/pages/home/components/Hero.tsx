import heroBg from "../../../assets/hero-bg.png"

interface HeroProps {
  carCount: number
}

export default function Hero({ carCount }: HeroProps) {
  return (
    <div className="relative flex-1 flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-6 pt-28 sm:pt-32 pb-32 sm:pb-44 w-full">
      <div className="max-w-full">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
          Encontre o carro
          <br />
          <span className="text-red-500">perfeito</span> para você
        </h1>
        <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-2">
          Mais de {carCount.toLocaleString("pt-BR")} veículos verificados <br /> e prontos para você.
        </p>
      </div>
    </div>
  )
}

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <img
        src={heroBg}
        alt="Carro esportivo"
        className="w-full h-full object-cover object-center"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(105deg, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.75) 38%, rgba(0,0,0,0.30) 65%, rgba(0,0,0,0.10) 100%)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-48"
        style={{
          background: "linear-gradient(to bottom, transparent, rgba(0,0,0,0.55))",
        }}
      />
    </div>
  )
}
