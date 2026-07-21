import { useState } from "react"
import { Link, useLocation } from "react-router"
import logoImg from "../../assets/logo.svg"
import { FiUser } from "react-icons/fi"
import { UserAuth } from "../../contexts/AuthContext"

const navLinks = [
  { label: "Comprar", to: "/estoque" },
  { label: "Vender", to: "/vender" },
  { label: "Serviços", to: "#" },
  { label: "Ajuda", to: "#" },
]

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const { signed, loadingAuth, signOut } = UserAuth()

  const isEstoque = pathname === "/estoque"
  const isFavoritos = pathname === "/favoritos"
  const isVender = pathname === "/vender"

  async function handleSignOut() {
    await signOut()
  }

  return (
    <header className="bg-surface fixed top-0 w-full z-50 border-b border-border-subtle shadow-sm">
      <div className="flex justify-between items-center h-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        <div className="flex items-center gap-8">
          <Link to="/">
            <img src={logoImg} alt="WebCarros" className="h-8 w-auto" />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.to && link.to !== "#"
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  className={`font-body-medium text-body-medium pb-1 mt-1 border-b-2 transition-colors duration-200 ${
                    isActive
                      ? "text-primary font-bold border-primary"
                      : "text-secondary hover:text-primary border-transparent"
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {isEstoque && (
            <div className="hidden md:flex relative items-center">
              <span className="material-symbols-outlined absolute left-3 text-secondary" style={{ fontSize: 20 }}>search</span>
              <input className="pl-10 pr-4 py-2 rounded-lg border border-border-subtle bg-surface-container-lowest focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all w-64 font-body-small text-body-small" placeholder="Buscar..." type="text" />
            </div>
          )}

          {isFavoritos && (
            <button aria-label="Favoritos" className="relative p-2 text-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>favorite</span>
            </button>
          )}

          {!loadingAuth && signed && (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/dashboard">
                <div className="border-2 rounded-full p-1 border-gray-900">
                  <FiUser size={24} color="#000" />
                </div>
              </Link>
              <button className="text-red-800 font-medium cursor-pointer hover:bg-slate-200" onClick={handleSignOut}>Sair</button>
            </div>
          )}

          {!loadingAuth && !signed && (
            <>
              <Link to="/login" className="text-primary font-body-medium text-body-medium hover:text-primary-container transition-colors">Entrar</Link>
              <Link
                to={isVender ? "/vender" : "/estoque"}
                className="bg-primary text-on-primary px-4 py-2 rounded-lg font-body-medium text-body-medium hover:-translate-y-0.5 shadow-sm active:shadow-inner active:translate-y-0 transition-all hidden md:inline-block"
              >
                {isVender ? "Anunciar Carro" : "Ver Ofertas"}
              </Link>
            </>
          )}

          <button className="md:hidden p-2 text-secondary" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span className="material-symbols-outlined">{mobileMenuOpen ? "close" : "menu"}</span>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-surface border-t border-border-subtle px-margin-mobile py-4 flex flex-col gap-3">
          {navLinks.map((link) => {
            const isActive = pathname === link.to && link.to !== "#"
            return (
              <Link
                key={link.label}
                to={link.to}
                className={`font-body-medium ${isActive ? "text-primary font-bold" : "text-secondary"}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          })}
          {!loadingAuth && !signed && (
            <Link to="/login" className="text-primary font-body-medium pt-2 border-t border-border-subtle" onClick={() => setMobileMenuOpen(false)}>Entrar</Link>
          )}
        </div>
      )}
    </header>
  )
}
