import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import { Link, useSearchParams } from "react-router"
import { supabase } from "../../services/supabaseClient"
import type { CarProps } from "../../types/car"


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
  const [testCar, setTestCar] = useState<CarProps | null>(null)
  const [searchParams] = useSearchParams()
  const [loadingCar, setLoadingCar] = useState(true)
  const carId = searchParams.get("car")

  useEffect(() => {
    if (!carId) {
      setLoadingCar(false)
      return
    }
    async function loadCar() {
      const { data } = await supabase
        .from("cars")
        .select("*")
        .eq("id", carId)
        .single()

      if (data) {
        setTestCar(data as CarProps)
      }
      setLoadingCar(false)
    }
    loadCar()
  }, [carId])

  const { register, handleSubmit, formState: { errors }, reset } = useForm<TestDriveForm>({
    resolver: zodResolver(TestDriveSchema),
    mode: "onChange",
  })

  function onSubmit(_data: TestDriveForm) {
    if (!testCar?.id) {
      toast.error("Selecione um carro para agendar o test drive")
      return
    }

    toast.success("Test drive agendado com sucesso!")
    reset()
  }

  if (!carId && !loadingCar) {
    return (
      <>
        <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-large flex flex-col items-center justify-center gap-6 min-h-screen">
          <span className="material-symbols-outlined text-secondary" style={{ fontSize: 64 }}>directions_car</span>
          <h1 className="text-headline-medium font-headline-medium text-on-surface text-center">Nenhum carro selecionado</h1>
          <p className="text-body-medium text-body-medium text-secondary text-center max-w-md">Navegue pelo nosso estoque e escolha um carro para agendar um test drive.</p>
          <Link to="/estoque" className="bg-primary text-white px-8 py-3 rounded-lg font-label-medium hover:opacity-90 transition-opacity">
            Ver estoque
          </Link>
        </main>
      </>
    )
  }

  if (loadingCar) {
    return (
      <div className="w-full flex justify-center my-10 pt-16">
        <div className="animate-spin h-8 w-8 border-4 border-zinc-800 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <>
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-stack-large flex flex-col gap-stack-large min-h-screen">
        <nav aria-label="Breadcrumb" className="w-full">
          <ol className="flex items-center space-x-2 font-body-small text-body-small text-on-surface-variant">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><span className="material-symbols-outlined text-sm">chevron_right</span></li>
            <li><Link to="/estoque" className="hover:text-primary transition-colors">Estoque</Link></li>
            <li><span className="material-symbols-outlined text-sm">chevron_right</span></li>
            <li><Link to={`/car/${carId}`} className="hover:text-primary transition-colors">{testCar?.name || "Carro"}</Link></li>
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
              {testCar && (
                <>
                  <img alt={testCar.name} className="w-24 h-16 object-cover rounded shadow-sm" src={testCar.images?.[0]?.url || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&q=80"} />
                  <div>
                    <h3 className="font-title-large text-title-large text-on-surface">{testCar.name}</h3>
                    <p className="font-body-small text-body-small text-on-surface-variant">Disponível na concessionária</p>
                  </div>
                </>
              )}
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

    </>
  )
}
