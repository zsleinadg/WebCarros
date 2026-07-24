import { useState } from "react"
import { Link, useLocation } from "react-router"
import { UserAuth } from "../../contexts/AuthContext"
import logoImg from "../../assets/logo.svg"
import { FiUser } from "react-icons/fi"

const navLinks = [
  { label: "Comprar", to: "/estoque" },
  { label: "Vender", to: "/vender" },
  { label: "Favoritos", to: "/favoritos" },
  { label: "Serviços", to: "#" },
  { label: "Ajuda", to: "#" },
]

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { pathname } = useLocation()
  const { signed, loadingAuth, signOut } = UserAuth()

  const isEstoque = pathname === "/estoque"
  const isVender = pathname === "/vender"

  function isActive(link: { label: string; to: string }) {
    if (link.to === "#") return false
    if (pathname === link.to) return true
    if (pathname === "/" && link.to === "/estoque") return true
    return false
  }

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm"
      style={{
        background: "linear-gradient(180deg, #05070D 0%, #080B14 100%)",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
        <div className="flex items-center gap-8">
          <Link to="/">
            <img src={logoImg} alt="WebCarros" className="h-8 w-auto" />
          </Link>
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = isActive(link)
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`px-3 py-1 text-base font-medium transition-colors relative ${
                    active
                      ? "text-[#E9003F] after:absolute after:bottom-[-2px] after:left-3 after:right-3 after:h-[2px] after:bg-[#E9003F] after:rounded-full"
                      : "text-[#A5ADBD] hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          {isEstoque && (
            <div className="hidden lg:flex items-center gap-2 bg-[#101625] border border-[#20283A] rounded-lg px-3 py-1.5">
              <svg className="w-4 h-4 text-[#687286]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Buscar carros..."
                className="bg-transparent text-sm text-white placeholder-[#687286] outline-none w-28 xl:w-36"
              />
            </div>
          )}

          {!loadingAuth && !signed && (
            <Link
              to="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-[#A5ADBD] hover:text-white transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="hidden sm:inline">Entrar</span>
            </Link>
          )}
          {!loadingAuth && signed && (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/dashboard">
                <div className="border-2 rounded-full p-0.5 border-white/30 hover:border-white transition-colors">
                  <FiUser size={20} color="white" />
                </div>
              </Link>
              <button
                onClick={() => signOut()}
                className="text-[#A5ADBD] hover:text-white text-xs font-medium transition-colors cursor-pointer"
              >
                Sair
              </button>
            </div>
          )}

          <Link
            to={isVender ? "/vender" : "/estoque"}
            className="flex items-center gap-1.5 bg-[#E9003F] hover:bg-[#FF174F] transition-colors px-3 sm:px-4 py-1.5 rounded-lg text-sm font-semibold text-white"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span className="hidden sm:inline">{isVender ? "Anunciar Carro" : "Ver Ofertas"}</span>
            <span className="sm:hidden">{isVender ? "Anunciar" : "Ver"}</span>
          </Link>

          <button
            className="md:hidden p-2 text-[#A5ADBD] hover:text-white cursor-pointer"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-[#05070D] border-t border-white/10 px-4 sm:px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => {
            const active = isActive(link)
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`text-sm font-medium ${
                  active ? "text-[#E9003F]" : "text-[#A5ADBD] hover:text-white"
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            )
          })}
          {!loadingAuth && signed && (
            <>
              <Link to="/dashboard" className="text-[#A5ADBD] hover:text-white text-sm font-medium" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <button onClick={() => { signOut(); setMobileOpen(false) }} className="text-[#687286] hover:text-white text-sm text-left cursor-pointer">Sair</button>
            </>
          )}
          {!loadingAuth && !signed && (
            <Link to="/login" className="text-[#A5ADBD] hover:text-white text-sm font-medium" onClick={() => setMobileOpen(false)}>Entrar</Link>
          )}
        </div>
      )}
    </header>
  )
}
