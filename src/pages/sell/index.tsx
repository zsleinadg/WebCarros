import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import { supabase } from "../../services/supabaseClient"
import { WHATSAPP_NUMBER } from "../../constants/whatsapp"

const SellSchema = z.object({
  nome: z.string().nonempty("Nome é obrigatório"),
  telefone: z.string().min(10, "Telefone inválido"),
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
  { icon: "sell", title: "Anúncio Grátis", desc: "Crie seu anúncio sem custos iniciais e alcance milhares de compradores." },
  { icon: "photo_camera", title: "Fotos Profissionais", desc: "Dicas e ferramentas para destacar seu veículo com imagens de alta qualidade." },
  { icon: "verified_user", title: "Compradores Verificados", desc: "Negocie com tranquilidade. Validamos a identidade dos interessados." },
  { icon: "timer", title: "Venda em até 7 dias", desc: "Nossa plataforma otimizada acelera o processo de fechamento do negócio." },
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
    <>


      <header className="relative bg-inverse-surface text-on-tertiary-container overflow-hidden pt-stack-large pb-24 md:pt-24 md:pb-32 px-margin-mobile md:px-margin-desktop">
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="bg-cover bg-center w-full h-full" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1600&q=80')" }}></div>
        </div>
        <div className="relative z-10 max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center">
          <div className="max-w-xl">
            <h1 className="text-display-large font-display-large mb-stack-medium text-on-primary">
              Venda seu carro rápido e sem dor de cabeça
            </h1>
            <p className="font-body-large text-body-large text-tertiary-fixed-dim mb-stack-lg">
              Anuncie grátis e receba proposta de compradores verificados em todo o Brasil.
            </p>
            <a className="inline-block bg-primary-container text-on-primary px-8 py-4 rounded-xl font-title-large text-title-large hover:bg-webmotors-red-dark hover:scale-95 transition-all duration-200 shadow-sm border border-transparent" href="#form">
              Quero vender meu carro
            </a>
          </div>
          <div className="hidden md:block relative h-[400px]">
            <img className="object-contain w-full h-full absolute inset-0 z-10" alt="" src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80" />
          </div>
        </div>
      </header>

      <section className="py-stack-lg md:py-24 px-margin-mobile md:px-margin-desktop bg-surface-bright">
        <div className="max-w-container-max mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-headline-large text-headline-large mb-stack-small">Por que vender com a WebCarros?</h2>
            <p className="font-body-medium text-body-medium text-secondary max-w-2xl mx-auto">Nós simplificamos o processo para você conseguir o melhor negócio, com segurança e agilidade.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
            {benefits.map((b) => (
              <div key={b.icon} className="bg-surface-container-lowest p-stack-medium rounded-xl border border-border-subtle hover:shadow-sm transition-shadow">
                <div className="w-12 h-12 bg-surface-container rounded-full flex items-center justify-center text-primary-container mb-stack-small">
                  <span className="material-symbols-outlined">{b.icon}</span>
                </div>
                <h3 className="font-title-large text-title-large mb-stack-small text-on-surface">{b.title}</h3>
                <p className="font-body-small text-body-small text-secondary">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-stack-lg md:py-24 px-margin-mobile md:px-margin-desktop bg-surface-gray" id="form">
        <div className="max-w-container-max mx-auto grid grid-cols-1 lg:grid-cols-12 gap-stack-lg items-start">
          <div className="lg:col-span-5">
            <h2 className="font-headline-large text-headline-large mb-stack-medium">Inicie a venda do seu veículo</h2>
            <p className="font-body-medium text-body-medium text-secondary mb-stack-lg">Preencha os dados básicos do seu carro e seus contatos. Um de nossos especialistas poderá entrar em contato para ajudar na avaliação.</p>
            <div className="hidden lg:block relative h-64 rounded-xl overflow-hidden mt-stack-lg border border-border-subtle shadow-sm">
              <img className="object-cover w-full h-full" alt="" src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=600&q=80" />
            </div>
          </div>
          <div className="lg:col-span-7 bg-surface-container-lowest p-stack-medium md:p-stack-lg rounded-xl border border-border-subtle shadow-sm">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-stack-medium">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-medium">
                <div>
                  <label className="block font-label-medium text-label-medium text-on-surface mb-1 uppercase tracking-wider" htmlFor="nome">Nome</label>
                  <input className="w-full rounded-xl border border-border-subtle bg-surface-bright focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-small text-body-small py-2 px-3" id="nome" placeholder="Seu nome completo" type="text" {...register("nome")} />
                  {errors.nome && <p className="text-red-500 text-body-small mt-1">{errors.nome.message}</p>}
                </div>
                <div>
                  <label className="block font-label-medium text-label-medium text-on-surface mb-1 uppercase tracking-wider" htmlFor="telefone">Telefone / WhatsApp</label>
                  <input className="w-full rounded-xl border border-border-subtle bg-surface-bright focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-small text-body-small py-2 px-3" id="telefone" placeholder="(00) 00000-0000" type="tel" {...register("telefone")} />
                  {errors.telefone && <p className="text-red-500 text-body-small mt-1">{errors.telefone.message}</p>}
                </div>
              </div>
              <div>
                <label className="block font-label-medium text-label-medium text-on-surface mb-1 uppercase tracking-wider" htmlFor="email">Email</label>
                <input className="w-full rounded-xl border border-border-subtle bg-surface-bright focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-small text-body-small py-2 px-3" id="email" placeholder="seu.email@exemplo.com" type="email" {...register("email")} />
                {errors.email && <p className="text-red-500 text-body-small mt-1">{errors.email.message}</p>}
              </div>
              <div className="border-t border-border-subtle pt-stack-medium mt-stack-medium">
                <h4 className="font-title-large text-title-large mb-stack-medium">Dados do Veículo</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-medium">
                  <div>
                    <label className="block font-label-medium text-label-medium text-on-surface mb-1 uppercase tracking-wider" htmlFor="marca">Marca</label>
                    <input className="w-full rounded-xl border border-border-subtle bg-surface-bright focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-small text-body-small py-2 px-3" id="marca" placeholder="Ex: Honda, Toyota" type="text" {...register("marca")} />
                    {errors.marca && <p className="text-red-500 text-body-small mt-1">{errors.marca.message}</p>}
                  </div>
                  <div>
                    <label className="block font-label-medium text-label-medium text-on-surface mb-1 uppercase tracking-wider" htmlFor="modelo">Modelo</label>
                    <input className="w-full rounded-xl border border-border-subtle bg-surface-bright focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-small text-body-small py-2 px-3" id="modelo" placeholder="Ex: Civic EXL" type="text" {...register("modelo")} />
                    {errors.modelo && <p className="text-red-500 text-body-small mt-1">{errors.modelo.message}</p>}
                  </div>
                  <div>
                    <label className="block font-label-medium text-label-medium text-on-surface mb-1 uppercase tracking-wider" htmlFor="ano">Ano</label>
                    <input className="w-full rounded-xl border border-border-subtle bg-surface-bright focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-small text-body-small py-2 px-3" id="ano" placeholder="Ex: 2020" type="number" {...register("ano")} />
                    {errors.ano && <p className="text-red-500 text-body-small mt-1">{errors.ano.message}</p>}
                  </div>
                  <div>
                    <label className="block font-label-medium text-label-medium text-on-surface mb-1 uppercase tracking-wider" htmlFor="km">Quilometragem</label>
                    <input className="w-full rounded-xl border border-border-subtle bg-surface-bright focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-small text-body-small py-2 px-3" id="km" placeholder="Ex: 45000" type="number" {...register("km")} />
                    {errors.km && <p className="text-red-500 text-body-small mt-1">{errors.km.message}</p>}
                  </div>
                </div>
              </div>
              <div>
                <label className="block font-label-medium text-label-medium text-on-surface mb-1 uppercase tracking-wider" htmlFor="preco">Preço pretendido (R$)</label>
                <input className="w-full rounded-xl border border-border-subtle bg-surface-bright focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-small text-body-small py-2 px-3" id="preco" placeholder="R$ 0,00" type="text" {...register("preco")} />
                {errors.preco && <p className="text-red-500 text-body-small mt-1">{errors.preco.message}</p>}
              </div>
              <div>
                <label className="block font-label-medium text-label-medium text-on-surface mb-1 uppercase tracking-wider" htmlFor="mensagem">Mensagem (Opcional)</label>
                <textarea className="w-full rounded-xl border border-border-subtle bg-surface-bright focus:border-primary-container focus:ring-1 focus:ring-primary-container font-body-small text-body-small py-2 px-3" id="mensagem" placeholder="Detalhes adicionais sobre o veículo..." rows={3} {...register("mensagem")} />
              </div>
              <button className="w-full bg-primary-container text-on-primary py-3 rounded-xl font-title-large text-title-large hover:bg-webmotors-red-dark transition-colors shadow-sm mt-stack-medium flex justify-center items-center gap-2" type="submit">
                Quero vender meu carro <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="py-stack-lg md:py-24 px-margin-mobile md:px-margin-desktop bg-surface-bright">
        <div className="max-w-container-max mx-auto">
          <h2 className="font-headline-large text-headline-large mb-16 text-center">Quem vendeu com a gente, recomenda</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-surface-container-lowest p-stack-medium rounded-xl border border-border-subtle shadow-sm flex flex-col h-full">
                <div className="flex text-primary-container mb-stack-small">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className="material-symbols-outlined text-sm" style={{ fontVariationSettings: j < Math.floor(t.stars) ? "'FILL' 1" : t.stars % 1 && j === Math.floor(t.stars) ? "'FILL' 0.5" : "'FILL' 0" }}>star</span>
                  ))}
                </div>
                <p className="font-body-medium text-body-medium text-on-surface flex-grow mb-stack-medium">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-primary font-bold">{t.initials}</div>
                  <div>
                    <p className="font-title-large text-title-large text-sm text-on-surface">{t.name}</p>
                    <p className="font-label-medium text-label-medium text-secondary">{t.sold}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-stack-lg md:py-24 px-margin-mobile md:px-margin-desktop bg-surface-container">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-headline-medium text-headline-medium mb-stack-small text-on-surface">Pronto para vender? Fale conosco no WhatsApp</h2>
          <p className="font-body-medium text-body-medium text-secondary mb-stack-lg">Nossa equipe está online agora para tirar suas dúvidas e ajudar você a fechar o melhor negócio.</p>
          <a className="inline-flex items-center gap-2 bg-success-green text-white px-8 py-4 rounded-xl font-title-large text-title-large hover:bg-emerald-600 transition-colors shadow-sm" href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
            <span className="material-symbols-outlined">chat</span> Chamar no WhatsApp
          </a>
        </div>
      </section>

    </>
  )
}
