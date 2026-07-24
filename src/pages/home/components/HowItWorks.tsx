export default function HowItWorks() {
  return (
    <section className="bg-[#080B14] py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-3">Como funciona</h2>
        <p className="text-[#A5ADBD] text-base mb-12 max-w-2xl mx-auto text-center">
          Comprar ou vender seu carro nunca foi tão fácil. São apenas 3 passos simples.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
            { icon: "search", title: "1. Encontre", desc: "Explore milhares de veículos com fotos reais e filtros inteligentes. Encontre o carro ideal com poucos cliques." },
            { icon: "chat", title: "2. Converse", desc: "Fale diretamente com o vendedor pelo WhatsApp. Tire dúvidas, negocie e agende uma visita sem intermediários." },
            { icon: "celebration", title: "3. Compre", desc: "Realize a compra com segurança. Todo o suporte necessário para você sair com o carro novo e sem preocupações." },
          ].map((step) => (
            <div key={step.title} className="step-line relative flex flex-col items-center text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4 shadow-md relative z-10"
                style={{
                  background: "#E9003F",
                  boxShadow: "0 0 0 8px rgba(233,0,63,0.10)",
                }}
              >
                <span className="material-symbols-outlined text-3xl text-white">{step.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-sm text-[#A5ADBD] max-w-xs">{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
