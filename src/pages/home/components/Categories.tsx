interface CategoriesProps {
  onCategoryClick: (name: string) => void
}

export default function Categories({ onCategoryClick }: CategoriesProps) {
  return (
    <section className="bg-gray-50 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-8 sm:mb-10">
          Explore por categoria
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {[
            { name: "SUV", icon: "airport_shuttle" },
            { name: "Hatch", icon: "directions_car" },
            { name: "Sedan", icon: "time_to_leave" },
            { name: "Picape", icon: "local_shipping" },
            { name: "Moto", icon: "two_wheeler" },
          ].map((cat) => (
            <button
              key={cat.name}
              onClick={() => onCategoryClick(cat.name)}
              className="group flex flex-col items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:border-red-300 hover:shadow-lg hover:shadow-red-50 transition-all duration-200 cursor-pointer"
            >
              <span className="material-symbols-outlined text-gray-400 group-hover:text-red-500 transition-colors duration-200" style={{ fontSize: 40 }}>
                {cat.icon}
              </span>
              <div className="text-center">
                <div className="font-bold text-gray-900 text-sm sm:text-base group-hover:text-red-600 transition-colors">
                  {cat.name}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}