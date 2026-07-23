import { Link } from "react-router"
import type { CarProps } from "../../../types/car"
import { formatPrice } from "../../../utils"

interface FeaturedCarsProps {
  cars: CarProps[]
}

export default function FeaturedCars({ cars }: FeaturedCarsProps) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
      <div className="flex justify-between items-end mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Carros em Destaque</h2>
        <Link to="/estoque" className="text-red-600 font-semibold text-sm hover:text-red-500 flex items-center gap-1">
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
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg hover:border-red-200 transition-all duration-200 group flex flex-col h-full"
            >
              <div className="relative aspect-[1.5] overflow-hidden">
                <img alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src={imgUrl} />
                <div className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wide shadow-sm badge-destaque">
                  Destaque
                </div>
              </div>
              <div className="p-4 flex flex-col grow">
                <h3 className="font-bold text-gray-900 text-base line-clamp-1">{car.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{car.model}</p>
                <div className="text-xl font-black text-red-600 mb-4 mt-auto">{formatPrice(car.price)}</div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="bg-gray-50 rounded px-2 py-1 text-center border border-gray-100">
                    <span className="block text-[10px] text-gray-500 uppercase">Ano</span>
                    <span className="text-sm font-semibold text-gray-900">{car.year}</span>
                  </div>
                  <div className="bg-gray-50 rounded px-2 py-1 text-center border border-gray-100">
                    <span className="block text-[10px] text-gray-500 uppercase">KM</span>
                    <span className="text-sm font-semibold text-gray-900">{car.km}</span>
                  </div>
                </div>
                <div className="flex items-center text-gray-500 text-sm pt-3 border-t border-gray-100">
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
    </section>
  )
}