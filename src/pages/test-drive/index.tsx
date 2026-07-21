import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import { Link } from "react-router"
import logoImg from "../../assets/logo.svg"

const TestDriveSchema = z.object({
  name: z.string().nonempty("Nome é obrigatório"),
  email: z.string().email("Email inválido"),
  whatsapp: z.string().min(10, "WhatsApp inválido"),
  date: z.string().nonempty("Data é obrigatória"),
  time: z.string().nonempty("Horário é obrigatório"),
  message: z.string().optional(),
  terms: z.boolean().refine((v) => v === true, "Aceite os termos para continuar"),
})

type TestDriveForm = z.infer<typeof TestDriveSchema>

const timeOptions = [
  "08:00", "09:00", "10:00", "11:00", "12:00",
  "13:00", "14:00", "15:00", "16:00", "17:00",
]

export default function TestDrive() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TestDriveForm>({
    resolver: zodResolver(TestDriveSchema),
    mode: "onChange",
  })

  function onSubmit(data: TestDriveForm) {
    console.log("Test drive agendado:", data)
    toast.success("Test drive agendado com sucesso!")
    reset()
  }

  return (
    <>


      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-large flex flex-col gap-stack-large">
        <nav aria-label="Breadcrumb" className="w-full">
          <ol className="flex items-center space-x-2 font-body-small text-body-small text-on-surface-variant">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><span className="material-symbols-outlined text-sm">chevron_right</span></li>
            <li><Link to="/estoque" className="hover:text-primary transition-colors">Estoque</Link></li>
            <li><span className="material-symbols-outlined text-sm">chevron_right</span></li>
            <li><Link to="/car/1" className="hover:text-primary transition-colors">BMW 320i M Sport</Link></li>
            <li><span className="material-symbols-outlined text-sm">chevron_right</span></li>
            <li aria-current="page" className="text-on-surface font-semibold">Agendar Test Drive</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl shadow-sm p-margin-mobile md:p-stack-large flex flex-col gap-stack-medium border border-border-subtle">
            <div className="flex flex-col gap-2">
              <h1 className="text-[28px] md:text-headline-large font-[700] md:font-headline-large text-on-surface">Agende seu Test Drive</h1>
              <p className="font-body-medium text-body-medium text-on-surface-variant">Preencha os dados abaixo e escolha o melhor horário</p>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-surface-gray border border-border-subtle">
              <img alt="BMW 320i M Sport" className="w-24 h-16 object-cover rounded shadow-sm" src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&q=80" />
              <div>
                <h3 className="font-title-large text-title-large text-on-surface">BMW 320i M Sport</h3>
                <p className="font-body-small text-body-small text-on-surface-variant">Disponível na concessionária</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="md:col-span-2">
                <label className="block font-label-medium text-label-medium text-on-surface mb-1" htmlFor="name">Nome Completo</label>
                <input className="w-full border border-border-subtle rounded-lg focus:ring-primary focus:border-primary font-body-medium py-2 px-3" id="name" placeholder="Digite seu nome" type="text" {...register("name")} />
                {errors.name && <p className="text-red-500 text-body-small mt-1">{errors.name.message}</p>}
              </div>
              <div className="md:col-span-1">
                <label className="block font-label-medium text-label-medium text-on-surface mb-1" htmlFor="email">E-mail</label>
                <input className="w-full border border-border-subtle rounded-lg focus:ring-primary focus:border-primary font-body-medium py-2 px-3" id="email" placeholder="seu@email.com" type="email" {...register("email")} />
                {errors.email && <p className="text-red-500 text-body-small mt-1">{errors.email.message}</p>}
              </div>
              <div className="md:col-span-1">
                <label className="block font-label-medium text-label-medium text-on-surface mb-1" htmlFor="whatsapp">WhatsApp</label>
                <input className="w-full border border-border-subtle rounded-lg focus:ring-primary focus:border-primary font-body-medium py-2 px-3" id="whatsapp" placeholder="(00) 00000-0000" type="tel" {...register("whatsapp")} />
                {errors.whatsapp && <p className="text-red-500 text-body-small mt-1">{errors.whatsapp.message}</p>}
              </div>
              <div className="md:col-span-1">
                <label className="block font-label-medium text-label-medium text-on-surface mb-1" htmlFor="date">Data</label>
                <input className="w-full border border-border-subtle rounded-lg focus:ring-primary focus:border-primary font-body-medium text-on-surface-variant py-2 px-3" id="date" type="date" {...register("date")} />
                {errors.date && <p className="text-red-500 text-body-small mt-1">{errors.date.message}</p>}
              </div>
              <div className="md:col-span-1">
                <label className="block font-label-medium text-label-medium text-on-surface mb-1" htmlFor="time">Horário</label>
                <select className="w-full border border-border-subtle rounded-lg focus:ring-primary focus:border-primary font-body-medium text-on-surface-variant py-2 px-3" id="time" {...register("time")}>
                  <option value="">Selecione um horário</option>
                  {timeOptions.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                {errors.time && <p className="text-red-500 text-body-small mt-1">{errors.time.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block font-label-medium text-label-medium text-on-surface mb-1" htmlFor="message">Mensagem (Opcional)</label>
                <textarea className="w-full border border-border-subtle rounded-lg focus:ring-primary focus:border-primary font-body-medium py-2 px-3" id="message" placeholder="Alguma observação especial?" rows={3} {...register("message")} />
              </div>
              <div className="md:col-span-2 flex items-start gap-2 mt-2">
                <input className="mt-1 border border-border-subtle rounded text-primary focus:ring-primary" id="terms" type="checkbox" {...register("terms")} />
                <label className="font-body-small text-body-small text-on-surface-variant" htmlFor="terms">
                  Concordo com os <a className="text-primary hover:underline" href="#">Termos de Uso</a> e a <a className="text-primary hover:underline" href="#">Política de Privacidade</a> da WebCarros.
                </label>
              </div>
              {errors.terms && <p className="text-red-500 text-body-small md:col-span-2">{errors.terms.message}</p>}
              <div className="md:col-span-2 mt-4">
                <button className="w-full bg-primary-container text-on-primary-container font-label-medium text-label-medium py-4 rounded-lg shadow-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2" type="submit">
                  <span className="material-symbols-outlined text-lg">calendar_today</span>
                  Solicitar Agendamento
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
            {[
              { icon: "directions_car", title: "Teste o carro antes de comprar", desc: "Sinta a performance e o conforto na prática." },
              { icon: "schedule", title: "Test drive de 30 minutos", desc: "Tempo ideal para avaliar todos os detalhes do veículo." },
              { icon: "description", title: "Sem compromisso, sem taxa", desc: "Agende gratuitamente, sem obrigação de compra." },
              { icon: "security", title: "Acompanhamento de um consultor", desc: "Tire todas as suas dúvidas com um especialista durante o trajeto." },
            ].map((card) => (
              <div key={card.icon} className="bg-surface-container-lowest rounded-xl shadow-sm p-6 flex items-center gap-6 border border-border-subtle hover:border-primary-fixed-dim transition-colors">
                <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-primary" style={{ fontSize: 28 }}>{card.icon}</span>
                </div>
                <div>
                  <h4 className="font-title-large text-title-large text-on-surface">{card.title}</h4>
                  <p className="font-body-small text-body-small text-on-surface-variant mt-1">{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-on-tertiary-fixed text-primary mt-auto">
        <div className="w-full py-stack-large px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto grid grid-cols-1 md:grid-cols-4 gap-gutter">
          <div className="flex flex-col gap-4">
            <Link to="/" className="block mb-2">
              <img src={logoImg} alt="WebCarros" className="h-8 w-auto" />
            </Link>
            <p className="font-body-small text-body-small text-tertiary-fixed-dim">O seu marketplace automotivo premium.</p>
          </div>
          <div className="flex flex-col gap-2">
            <h5 className="font-label-medium text-label-medium font-bold text-on-primary">Empresa</h5>
            <a className="font-body-small text-body-small text-tertiary-fixed-dim hover:text-primary-fixed-dim transition-colors" href="#">Sobre Nós</a>
            <a className="font-body-small text-body-small text-tertiary-fixed-dim hover:text-primary-fixed-dim transition-colors" href="#">Carreiras</a>
            <a className="font-body-small text-body-small text-tertiary-fixed-dim hover:text-primary-fixed-dim transition-colors" href="#">Blog</a>
          </div>
          <div className="flex flex-col gap-2">
            <h5 className="font-label-medium text-label-medium font-bold text-on-primary">Legal</h5>
            <a className="font-body-small text-body-small text-tertiary-fixed-dim hover:text-primary-fixed-dim transition-colors" href="#">Termos de Uso</a>
            <a className="font-body-small text-body-small text-tertiary-fixed-dim hover:text-primary-fixed-dim transition-colors" href="#">Privacidade</a>
          </div>
          <div className="flex flex-col gap-2">
            <h5 className="font-label-medium text-label-medium font-bold text-on-primary">Contato</h5>
            <a className="font-body-small text-body-small text-tertiary-fixed-dim hover:text-primary-fixed-dim transition-colors" href="#">Fale Conosco</a>
          </div>
          <div className="md:col-span-4 mt-8 pt-8 border-t border-secondary-fixed text-center">
            <p className="font-body-small text-body-small text-tertiary-fixed-dim">© 2024 WebCarros. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
