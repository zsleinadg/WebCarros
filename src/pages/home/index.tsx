import { useState, useEffect } from "react"
import { useNavigate } from "react-router"
import { supabase } from "../../services/supabaseClient"
import type { CarProps } from "../../types/car"
import Footer from "../../components/footer"
import Navbar from "./components/Navbar"
import WhatsAppFloat from "./components/WhatsAppFloat"
import Hero, { HeroBackground } from "./components/Hero"
import SearchCard from "./components/SearchCard"
import Categories from "./components/Categories"
import FeaturedCars from "./components/FeaturedCars"
import SellBanner from "./components/SellBanner"
import HowItWorks from "./components/HowItWorks"

export default function Home() {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [carCount, setCarCount] = useState(0)
  const [featuredCars, setFeaturedCars] = useState<CarProps[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedYear, setSelectedYear] = useState("")
  const [selectedPrice, setSelectedPrice] = useState("")
  const [selectedFuel, setSelectedFuel] = useState("")
  const [selectedTransmission, setSelectedTransmission] = useState("")
  const [selectedKmRange, setSelectedKmRange] = useState("")
  const [searchTab, setSearchTab] = useState<"comprar" | "vender">("comprar")
  const navigate = useNavigate()

  const currentYear = new Date().getFullYear()
  const yearOptions = Array.from({ length: currentYear - 1999 }, (_, i) => String(currentYear - i))

  useEffect(() => {
    async function loadCount() {
      const { count } = await supabase
        .from("cars")
        .select("*", { count: "exact", head: true })
      if (count !== null) setCarCount(count)
    }
    loadCount()
  }, [])

  useEffect(() => {
    async function loadFeatured() {
      const { data } = await supabase
        .from("cars")
        .select("*")
        .limit(4)
        .order("created_at", { ascending: false })
      if (data) {
        setFeaturedCars(data as CarProps[])
      }
    }
    loadFeatured()
  }, [])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (searchTerm) params.set("search", searchTerm)
    if (selectedYear) params.set("ano", selectedYear)
    if (selectedPrice) params.set("precoMax", selectedPrice)
    if (selectedFuel) params.set("fuel", selectedFuel)
    if (selectedTransmission) params.set("transmission", selectedTransmission)
    if (selectedKmRange) params.set("kmRange", selectedKmRange)
    navigate(`/estoque?${params.toString()}`)
  }

  function handleCategoryClick(category: string) {
    navigate(`/estoque?search=${encodeURIComponent(category)}`)
  }

  return (
    <>
      <WhatsAppFloat />
      <Navbar />

      <section className="relative min-h-[80vh] flex flex-col">
        <HeroBackground />
        <Hero carCount={carCount} />
        <SearchCard
          searchTerm={searchTerm} setSearchTerm={setSearchTerm}
          selectedYear={selectedYear} setSelectedYear={setSelectedYear}
          selectedPrice={selectedPrice} setSelectedPrice={setSelectedPrice}
          selectedFuel={selectedFuel} setSelectedFuel={setSelectedFuel}
          selectedTransmission={selectedTransmission} setSelectedTransmission={setSelectedTransmission}
          selectedKmRange={selectedKmRange} setSelectedKmRange={setSelectedKmRange}
          showAdvanced={showAdvanced} setShowAdvanced={setShowAdvanced}
          searchTab={searchTab} setSearchTab={setSearchTab}
          carCount={carCount}
          yearOptions={yearOptions}
          onSearch={handleSearch}
        />
      </section>

      <div className="bg-gray-50 pt-24 sm:pt-28" />

      <Categories onCategoryClick={handleCategoryClick} />
      <FeaturedCars cars={featuredCars} />
      <SellBanner />
      <HowItWorks />
      <Footer />
    </>
  )
}
