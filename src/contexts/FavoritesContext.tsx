import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from "react"
import { supabase } from "../services/supabaseClient"

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
    setFavorites(prev => {
      const next = new Set(prev)
      if (next.has(carId)) {
        next.delete(carId)
        supabase.from("favorites").delete().match({ visitor_id: visitorId, car_id: carId }).then()
      } else {
        next.add(carId)
        supabase.from("favorites").insert({ visitor_id: visitorId, car_id: carId }).then()
      }
      return next
    })
  }, [visitorId])

  const isFavorite = useCallback((carId: string) => favorites.has(carId), [favorites])

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite, loading }}>
      {children}
    </FavoritesContext.Provider>
  )
}

export const useFavorites = () => useContext(FavoritesContext)
