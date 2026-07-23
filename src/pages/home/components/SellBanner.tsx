import { Link } from "react-router"
import sellBg from "../../../assets/sellcar-section.png"

export default function SellBanner() {
  return (
    <section className="max-w-10/12 mx-auto">
      <div className="relative rounded-2xl overflow-hidden py-16 sm:pt-20 sm:pb-40">
        <div className="absolute inset-0 overflow-hidden">
          <img src={sellBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20" />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <div className="flex-1 min-w-0">
              <h2 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
                Venda seu carro com facilidade
              </h2>
              <p className="text-white/50 mb-8 text-base">
                Anuncie grátis e venda mais rápido com a WebCarros.
              </p>
              <div className="space-y-4 mb-8">
                {[
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    ),
                    title: "Anúncio 100% gratuito",
                    desc: "Sem taxas ou comissões.",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    ),
                    title: "Venda mais rápido",
                    desc: "Conecte-se com compradores reais.",
                  },
                  {
                    icon: (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ),
                    title: "Mais visibilidade",
                    desc: "Seu anúncio para milhares de pessoas.",
                  },
                ].map((b) => (
                  <div key={b.title} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-red-600/15 border border-red-500/20 flex items-center justify-center text-red-400 shrink-0">
                      {b.icon}
                    </div>
                    <div>
                      <div className="text-white font-semibold text-sm">{b.title}</div>
                      <div className="text-white/40 text-sm">{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <Link
                to="/vender"
                className="inline-block bg-red-600 hover:bg-red-500 transition-colors text-white font-bold px-6 py-3 rounded-xl text-sm"
              >
                Quero vender meu carro
              </Link>
            </div>
            <div className="lg:flex-1 flex justify-center lg:justify-end w-full lg:w-auto">
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
