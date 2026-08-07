import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import { supabase } from "../../services/supabaseClient"
import { WHATSAPP_NUMBER } from "../../constants/whatsapp"
import Input from "../../components/input"
import { formatPhone } from "../../utils/formatPhone"
import { ArrowRight, Camera, ShieldCheck, Timer, Star, MessageCircle, Tag } from "lucide-react"

const SellSchema = z.object({
  nome: z.string().nonempty("Nome é obrigatório"),
  telefone: z.string().min(1, "Telefone é obrigatório").transform(val => val.replace(/\D/g, "")).refine(val => val.length >= 10, "Telefone inválido"),
  email: z.string().email("Email inválido"),
  marca: z.string().nonempty("Marca é obrigatória"),
  modelo: z.string().nonempty("Modelo é obrigatório"),
  ano: z.string().nonempty("Ano é obrigatório"),
  km: z.string().nonempty("Quilometragem é obrigatória"),
  preco: z.string().nonempty("Preço é obrigatório"),
  mensagem: z.string().optional(),
})

type SellForm = z.infer<typeof SellSchema>

const benefits = [
  { icon: <Tag className="h-6 w-6 text-(--accent)" />, title: "Anúncio Grátis", desc: "Crie seu anúncio sem custos iniciais e alcance milhares de compradores." },
  { icon: <Camera className="h-6 w-6 text-(--accent)" />, title: "Fotos Profissionais", desc: "Dicas e ferramentas para destacar seu veículo com imagens de alta qualidade." },
  { icon: <ShieldCheck className="h-6 w-6 text-(--accent)" />, title: "Compradores Verificados", desc: "Negocie com tranquilidade. Validamos a identidade dos interessados." },
  { icon: <Timer className="h-6 w-6 text-(--accent)" />, title: "Venda em até 7 dias", desc: "Nossa plataforma otimizada acelera o processo de fechamento do negócio." },
]

const testimonials = [
  {
    initials: "C", name: "Carlos Silva", sold: "Vendeu um Toyota Corolla",
    text: "Vendi meu Corolla em menos de 5 dias. O processo de anúncio foi super fácil e recebi propostas reais bem rápido. Recomendo muito!",
    stars: 5,
  },
  {
    initials: "M", name: "Mariana Costa", sold: "Vendeu um Jeep Compass",
    text: "Estava com receio de vender pela internet, mas a plataforma me deu muita segurança. Consegui o valor que queria no meu SUV sem estresse.",
    stars: 5,
  },
  {
    initials: "R", name: "Roberto Alves", sold: "Vendeu um VW Polo",
    text: "As dicas de fotos fizeram toda a diferença. O anúncio ficou muito profissional e choveu interessado no primeiro final de semana.",
    stars: 4.5,
  },
]

export default function Sell() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<SellForm>({
    resolver: zodResolver(SellSchema),
    mode: "onChange",
  })

  async function onSubmit(data: SellForm) {
    const { error } = await supabase.from("sell_requests").insert({
      nome: data.nome,
      telefone: data.telefone,
      email: data.email,
      marca: data.marca,
      modelo: data.modelo,
      ano: data.ano,
      km: data.km,
      preco: data.preco,
      mensagem: data.mensagem || null,
    })

    if (error) {
      console.error("Erro ao salvar pedido de venda:", error)
      toast.error("Erro ao enviar solicitação. Tente novamente.")
      return
    }

    toast.success("Solicitação enviada com sucesso! Entraremos em contato.")
    reset()
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-main)" }}>
      <header
        className="relative overflow-hidden pt-12 pb-24 md:pt-20 md:pb-32 px-4 md:px-10"
        style={{ background: "var(--bg-deepest)" }}
      >
        <div className="absolute inset-0 z-0 opacity-15">
          <div
            className="bg-cover bg-center w-full h-full"
            style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&q=80')" }}
          />
        </div>
        <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-4">
              Venda seu carro rápido e sem dor de cabeça
            </h1>
            <p className="text-base sm:text-lg mb-8" style={{ color: "var(--text-secondary)" }}>
              Anuncie grátis e receba proposta de compradores verificados em todo o Brasil.
            </p>
            <button
              type="button"
              onClick={() => document.getElementById("form")?.scrollIntoView({ behavior: "smooth" })}
              className="inline-block px-8 py-4 rounded-xl text-lg font-bold text-white transition-all duration-200 shadow-sm hover:-translate-y-0.5 cursor-pointer"
              style={{ background: "var(--accent)" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-hover)" }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent)" }}
            >
              Quero vender meu carro
            </button>
          </div>
        </div>
      </header>

      <section className="py-16 md:py-24 px-4 md:px-10" style={{ background: "var(--bg-main)" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Por que vender com a WebCarros?
            </h2>
            <p className="text-base max-w-2xl mx-auto" style={{ color: "var(--text-secondary)" }}>
              Nós simplificamos o processo para você conseguir o melhor negócio, com segurança e agilidade.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
<div
                 key={b.title}
                className="p-6 rounded-xl transition-all duration-300"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-default)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "rgba(233,0,63,0.45)";
                  el.style.transform = "translateY(-3px)";
                  el.style.boxShadow = "0 12px 32px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "var(--border-default)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mb-4"
                  style={{
                    background: "rgba(233,0,63,0.08)",
                    border: "1px solid rgba(233,0,63,0.20)",
                  }}
                >
                  {b.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{b.title}</h3>
                <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-10" style={{ background: "var(--bg-secondary)" }} id="form">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Inicie a venda do seu veículo
            </h2>
            <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
              Preencha os dados básicos do seu carro e seus contatos. Um de nossos especialistas poderá entrar em contato para ajudar na avaliação.
            </p>
            <div
              className="hidden lg:block relative h-64 rounded-xl overflow-hidden mt-8 shadow-sm"
              style={{ border: "1px solid var(--border-default)" }}
            >
              <img className="object-cover w-full h-full" alt="" src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80" />
            </div>
          </div>
          <div
            className="lg:col-span-7 p-6 md:p-8 rounded-xl shadow-sm"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
            }}
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-white mb-1 uppercase tracking-wider" htmlFor="nome">Nome</label>
                  <Input
                    type="text"
                    placeholder="Seu nome completo"
                    name="nome"
                    register={register}
                    error={errors.nome?.message}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-white mb-1 uppercase tracking-wider" htmlFor="telefone">Telefone / WhatsApp</label>
                  <Input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    name="telefone"
                    register={register}
                    mask={formatPhone}
                    error={errors.telefone?.message}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white mb-1 uppercase tracking-wider" htmlFor="email">Email</label>
                <Input
                  type="email"
                  placeholder="seu.email@exemplo.com"
                  name="email"
                  register={register}
                  error={errors.email?.message}
                />
              </div>
              <div className="border-t pt-6 mt-6" style={{ borderColor: "var(--border-default)" }}>
                <h4 className="text-lg font-bold text-white mb-5">Dados do Veículo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1 uppercase tracking-wider" htmlFor="marca">Marca</label>
                    <Input
                      type="text"
                      placeholder="Ex: Honda, Toyota"
                      name="marca"
                      register={register}
                      error={errors.marca?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1 uppercase tracking-wider" htmlFor="modelo">Modelo</label>
                    <Input
                      type="text"
                      placeholder="Ex: Civic EXL"
                      name="modelo"
                      register={register}
                      error={errors.modelo?.message}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1 uppercase tracking-wider" htmlFor="ano">Ano</label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      className="no-spinner"
                      placeholder="Ex: 2020"
                      name="ano"
                      register={register}
                      error={errors.ano?.message}
                      mask={(val) => val.replace(/\D/g, "")}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault()
                      }}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-white mb-1 uppercase tracking-wider" htmlFor="km">Quilometragem</label>
                    <Input
                      type="text"
                      inputMode="numeric"
                      className="no-spinner"
                      placeholder="Ex: 45000"
                      name="km"
                      register={register}
                      error={errors.km?.message}
                      mask={(val) => val.replace(/\D/g, "")}
                      onKeyDown={(e) => {
                        if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault()
                      }}
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-white mb-1 uppercase tracking-wider" htmlFor="preco">Preço pretendido (R$)</label>
                <Input
                  type="text"
                  inputMode="numeric"
                  className="no-spinner"
                  placeholder="R$ 0,00"
                  name="preco"
                  register={register}
                  error={errors.preco?.message}
                  mask={(val) => val.replace(/\D/g, "")}
                  onKeyDown={(e) => {
                    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault()
                  }}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white mb-1 uppercase tracking-wider" htmlFor="mensagem">Mensagem (Opcional)</label>
                <textarea
                  className="w-full rounded-xl text-sm py-2 px-3 outline-none resize-none"
                  style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                  id="mensagem" placeholder="Detalhes adicionais sobre o veículo..." rows={3}
                  onFocusCapture={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(233,0,63,0.12)" }}
                  onBlurCapture={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.boxShadow = "none" }}
                  {...register("mensagem")}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-lg font-bold text-white transition-all duration-200 shadow-sm mt-2 flex justify-center items-center gap-2 cursor-pointer"
                style={{ background: "var(--accent)" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-hover)" }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent)" }}
              >
                Quero vender meu carro <ArrowRight className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-10" style={{ background: "var(--bg-main)" }}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-16 text-center">
            Quem vendeu com a gente, recomenda
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={i}
                className="p-6 rounded-xl transition-all duration-300 flex flex-col h-full"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-default)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "rgba(233,0,63,0.45)";
                  el.style.transform = "translateY(-3px)";
                  el.style.boxShadow = "0 12px 32px rgba(0,0,0,0.3)";
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget;
                  el.style.borderColor = "var(--border-default)";
                  el.style.transform = "translateY(0)";
                  el.style.boxShadow = "none";
                }}
              >
                 <div className="flex mb-4" style={{ color: "var(--accent)" }}>
                   {Array.from({ length: 5 }).map((_, j) => {
                     const full = j < Math.floor(t.stars)
                     const half = t.stars % 1 && j === Math.floor(t.stars)
                     return (
                       <Star
                         key={j}
                         className="h-4 w-4"
                         fill={full ? "currentColor" : half ? "currentColor" : "none"}
                         stroke={full ? "currentColor" : half ? "currentColor" : "#A5ADBD"}
                       />
                     )
                   })}
                 </div>
                <p className="text-base text-white grow mb-5">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "rgba(233,0,63,0.08)",
                      color: "var(--accent)",
                    }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">{t.name}</p>
                    <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{t.sold}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 px-4 md:px-10" style={{ background: "var(--bg-secondary)" }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Pronto para vender? Fale conosco no WhatsApp
          </h2>
          <p className="text-base mb-8" style={{ color: "var(--text-secondary)" }}>
            Nossa equipe está online agora para tirar suas dúvidas e ajudar você a fechar o melhor negócio.
          </p>
          <a
            className="inline-flex items-center gap-2 text-white px-8 py-4 rounded-xl text-lg font-bold shadow-sm transition-all hover:-translate-y-0.5"
            style={{ background: "#25D366" }}
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-6 w-6" /> Chamar no WhatsApp
          </a>
        </div>
      </section>
    </div>
  )
}
