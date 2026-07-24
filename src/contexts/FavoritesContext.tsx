import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { supabase } from "../services/supabaseClient"
import toast from "react-hot-toast"

interface FavoritesContextData {
  favorites: Set<string>
  toggleFavorite: (carId: string) => Promise<void>
  isFavorite: (carId: string) => boolean
  loading: boolean
}

const FavoritesContext = createContext({} as FavoritesContextData)

function getVisitorId(): string {
  let id = localStorage.getItem("visitor_id")
  if (!id) {
    id = crypto.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`
    localStorage.setItem("visitor_id", id)
  }
  return id
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(true)
  const visitorId = getVisitorId()

  useEffect(() => {
    async function loadFavorites() {
      const { data } = await supabase
        .from("favorites")
        .select("car_id")
        .eq("visitor_id", visitorId)

      if (data) {
        setFavorites(new Set(data.map((f: any) => f.car_id)))
      }
      setLoading(false)
    }
    loadFavorites()
  }, [visitorId])

  const toggleFavorite = useCallback(async (carId: string) => {
    const isFav = favorites.has(carId)

    const confirmed = await new Promise<boolean>((resolve) => {
      toast.custom((t) => (
        <div className="p-4 rounded-lg shadow-lg" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
          <p className="font-medium text-white mb-3">
            {isFav ? "Deseja remover este carro dos seus favoritos?" : "Deseja adicionar este carro aos seus favoritos?"}
          </p>
          <div className="flex gap-2 justify-end">
            <button
              className="px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-colors"
              style={{ background: "var(--bg-secondary)", color: "var(--text-primary)" }}
              onClick={() => { toast.dismiss(t.id); resolve(false) }}
            >
              Cancelar
            </button>
            <button
              className="px-3 py-1.5 text-white rounded-lg text-sm font-medium cursor-pointer transition-colors"
              style={{ background: "var(--accent)" }}
              onClick={() => { toast.dismiss(t.id); resolve(true) }}
            >
              {isFav ? "Remover" : "Adicionar"}
            </button>
          </div>
        </div>
      ), { duration: Infinity })
    })

    if (!confirmed) return

    setFavorites(prev => {
      const next = new Set(prev)
      if (isFav) {
        next.delete(carId)
      } else {
        next.add(carId)
      }
      return next
    })

    const { error } = isFav
      ? await supabase.from("favorites").delete().match({ visitor_id: visitorId, car_id: carId })
      : await supabase.from("favorites").insert({ visitor_id: visitorId, car_id: carId })

    if (error) {
      toast.error(isFav ? "Erro ao remover dos favoritos" : "Erro ao adicionar aos favoritos")
      setFavorites(prev => {
        const next = new Set(prev)
        if (isFav) {
          next.add(carId)
        } else {
          next.delete(carId)
        }
        return next
      })
    }
  }, [visitorId, favorites])

  const isFavorite = useCallback((carId: string) => favorites.has(carId), [favorites])

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)
