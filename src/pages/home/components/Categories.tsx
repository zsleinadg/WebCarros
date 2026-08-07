import { Truck, CarFront, Car, Bike } from "lucide-react"

interface CategoriesProps {
  onCategoryClick: (name: string) => void
}

const categories = [
  { name: "SUV", icon: <Truck className="h-7 w-7 text-[#E9003F]" /> },
  { name: "Hatch", icon: <CarFront className="h-7 w-7 text-[#E9003F]" /> },
  { name: "Sedan", icon: <Car className="h-7 w-7 text-[#E9003F]" /> },
  { name: "Picape", icon: <Truck className="h-7 w-7 text-[#E9003F]" /> },
  { name: "Moto", icon: <Bike className="h-7 w-7 text-[#E9003F]" /> },
]

export default function Categories({ onCategoryClick }: CategoriesProps) {
  return (
    <section
      className="py-16 sm:py-20"
      style={{
        background: "linear-gradient(180deg, #080B14 0%, #0B1020 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-8 sm:mb-10">
          Explore por categoria
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => onCategoryClick(cat.name)}
              className="group flex flex-col items-center gap-4 rounded-xl p-5 sm:p-6 cursor-pointer transition-all duration-300"
              style={{
                background: "#101625",
                border: "1px solid #20283A",
                boxShadow: "0 8px 24px rgba(0,0,0,0.18)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget;
                el.style.background = "#151C2E";
                el.style.borderColor = "rgba(233,0,63,0.45)";
                el.style.transform = "translateY(-3px)";
                el.style.boxShadow = "0 12px 32px rgba(0,0,0,0.3)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget;
                el.style.background = "#101625";
                el.style.borderColor = "#20283A";
                el.style.transform = "translateY(0)";
                el.style.boxShadow = "0 8px 24px rgba(0,0,0,0.18)";
              }}
            >
               <div
                className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{
                  background: "rgba(233,0,63,0.08)",
                  border: "1px solid rgba(233,0,63,0.20)",
                }}
              >
                {cat.icon}
              </div>
              <div className="text-center">
                <div className="font-bold text-white text-sm sm:text-base">
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
