import { Link } from "react-router"
import type { CarProps } from "../../../types/car"
import { formatPrice } from "../../../utils"

interface FeaturedCarsProps {
  cars: CarProps[]
}

export default function FeaturedCars({ cars }: FeaturedCarsProps) {
  return (
    <section className="bg-[#080B14] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-end mb-8 sm:mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">Carros em Destaque</h2>
          <Link to="/estoque" className="text-[#E9003F] font-semibold text-sm hover:text-[#FF174F] flex items-center gap-1 transition-colors">
            Ver todos
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cars.map((car) => {
            const imgUrl = car.images?.[0]?.url || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80"
            return (
              <Link
                key={car.id}
                to={`/car/${car.id}`}
                className="group flex flex-col h-full rounded-xl overflow-hidden transition-all duration-300"
                style={{
                  background: "linear-gradient(145deg, #141A2A, #0D1220)",
                  border: "1px solid #252D40",
                  boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(-4px)";
                  el.style.borderColor = "rgba(233,0,63,0.45)";
                  el.style.boxShadow = "0 16px 40px rgba(0,0,0,0.35)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.transform = "translateY(0)";
                  el.style.borderColor = "#252D40";
                  el.style.boxShadow = "0 4px 16px rgba(0,0,0,0.2)";
                }}
              >
                <div className="relative aspect-[1.5] overflow-hidden rounded-t-xl">
                  <img alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={imgUrl} />
                  <div className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide shadow-sm" style={{ background: "#E9003F" }}>
                    Destaque
                  </div>
                </div>
                <div className="p-4 flex flex-col grow">
                  <h3 className="font-bold text-white text-base line-clamp-1">{car.name}</h3>
                  <p className="text-sm text-[#687286] mb-3">{car.model}</p>
                  <div className="text-xl font-black text-[#E9003F] mb-4 mt-auto">{formatPrice(car.price)}</div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div
                      className="rounded px-2 py-1 text-center"
                      style={{ background: "#0B1020", border: "1px solid #20283A" }}
                    >
                      <span className="block text-[10px] text-[#A5ADBD] uppercase">Ano</span>
                      <span className="text-sm font-semibold text-white">{car.year}</span>
                    </div>
                    <div
                      className="rounded px-2 py-1 text-center"
                      style={{ background: "#0B1020", border: "1px solid #20283A" }}
                    >
                      <span className="block text-[10px] text-[#A5ADBD] uppercase">KM</span>
                      <span className="text-sm font-semibold text-white">{car.km}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-[#A5ADBD] text-sm pt-3 border-t border-[#20283A]">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {car.city}, {car.uf}
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}