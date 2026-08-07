import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import toast from "react-hot-toast"
import { Link, useSearchParams } from "react-router"
import { supabase } from "../../services/supabaseClient"
import type { CarProps } from "../../types/car"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../components/select"
import { Car, ChevronRight, Calendar, FileText, Shield } from "lucide-react"


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

const inputStyle = {
  background: "var(--bg-secondary)",
  border: "1px solid var(--border-default)",
  color: "var(--text-primary)",
}

const focusIn = (e: React.FocusEvent<HTMLElement>) => {
  e.currentTarget.style.borderColor = "var(--accent)"
  e.currentTarget.style.boxShadow = "0 0 0 3px rgba(233,0,63,0.12)"
}

const focusOut = (e: React.FocusEvent<HTMLElement>) => {
  e.currentTarget.style.borderColor = "var(--border-default)"
  e.currentTarget.style.boxShadow = "none"
}

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

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<TestDriveForm>({
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
      <main className="w-full min-h-screen flex flex-col items-center justify-center gap-6 px-4" style={{ background: "var(--bg-main)" }}>
        <Car className="h-16 w-16 text-[var(--text-muted)]" />
        <h1 className="text-2xl font-bold text-white text-center">Nenhum carro selecionado</h1>
        <p className="text-base text-center max-w-md" style={{ color: "var(--text-secondary)" }}>Navegue pelo nosso estoque e escolha um carro para agendar um test drive.</p>
        <Link
          to="/estoque"
          className="px-8 py-3 rounded-lg text-sm font-semibold text-white transition-opacity"
          style={{ background: "var(--accent)" }}
        >
          Ver estoque
        </Link>
      </main>
    )
  }

  if (loadingCar) {
    return (
      <main className="w-full min-h-screen flex justify-center items-center" style={{ background: "var(--bg-main)" }}>
        <div className="animate-spin h-8 w-8 border-4 rounded-full" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }}></div>
      </main>
    )
  }

  return (
    <main className="w-full min-h-screen" style={{ background: "var(--bg-main)" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-10 py-8 flex flex-col gap-8">
        <nav aria-label="Breadcrumb" className="w-full">
          <ol className="flex items-center space-x-2 text-sm" style={{ color: "var(--text-secondary)" }}>
            <li><Link to="/" className="hover:text-[var(--accent)] transition-colors">Home</Link></li>
            <li><ChevronRight className="h-4 w-4" /></li>
            <li><Link to="/estoque" className="hover:text-[var(--accent)] transition-colors">Estoque</Link></li>
            <li><ChevronRight className="h-4 w-4" /></li>
            <li><Link to={`/car/${carId}`} className="hover:text-[var(--accent)] transition-colors">{testCar?.name || "Carro"}</Link></li>
            <li><ChevronRight className="h-4 w-4" /></li>
            <li aria-current="page" className="text-white font-semibold">Agendar Test Drive</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div
            className="lg:col-span-7 rounded-xl shadow-sm p-4 md:p-8 flex flex-col gap-5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-default)",
            }}
          >
            <div className="flex flex-col gap-2">
              <h1 className="text-[28px] md:text-3xl font-bold text-white">Agende seu Test Drive</h1>
              <p className="text-base" style={{ color: "var(--text-secondary)" }}>Preencha os dados abaixo e escolha o melhor horário</p>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-lg" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)" }}>
              {testCar && (
                <>
                  <img alt={testCar.name} className="w-24 h-16 object-cover rounded shadow-sm" src={testCar.images?.[0]?.url || "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=200&q=80"} />
                  <div>
                    <h3 className="text-lg font-bold text-white">{testCar.name}</h3>
                    <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Disponível na concessionária</p>
                  </div>
                </>
              )}
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-white mb-1" htmlFor="name">Nome Completo</label>
                <input
                  className="w-full rounded-lg text-sm py-2 px-3 outline-none"
                  style={inputStyle}
                  id="name" placeholder="Digite seu nome" type="text"
                  onFocusCapture={focusIn} onBlurCapture={focusOut}
                  {...register("name")}
                />
                {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-white mb-1" htmlFor="email">E-mail</label>
                <input
                  className="w-full rounded-lg text-sm py-2 px-3 outline-none"
                  style={inputStyle}
                  id="email" placeholder="seu@email.com" type="email"
                  onFocusCapture={focusIn} onBlurCapture={focusOut}
                  {...register("email")}
                />
                {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email.message}</p>}
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-white mb-1" htmlFor="whatsapp">WhatsApp</label>
                <input
                  className="w-full rounded-lg text-sm py-2 px-3 outline-none"
                  style={inputStyle}
                  id="whatsapp" placeholder="(00) 00000-0000" type="tel"
                  onFocusCapture={focusIn} onBlurCapture={focusOut}
                  {...register("whatsapp")}
                />
                {errors.whatsapp && <p className="text-red-400 text-sm mt-1">{errors.whatsapp.message}</p>}
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-white mb-1" htmlFor="date">Data</label>
                <input
                  className="w-full rounded-lg text-sm py-2 px-3 outline-none"
                  style={inputStyle}
                  id="date" type="date"
                  onFocusCapture={focusIn} onBlurCapture={focusOut}
                  {...register("date")}
                />
                {errors.date && <p className="text-red-400 text-sm mt-1">{errors.date.message}</p>}
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-semibold text-white mb-1" htmlFor="time">Horário</label>
                <Select value={watch("time") || ""} onValueChange={(val) => setValue("time", val, { shouldValidate: true })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um horário" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeOptions.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.time && <p className="text-red-400 text-sm mt-1">{errors.time.message}</p>}
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-white mb-1" htmlFor="message">Mensagem (Opcional)</label>
                <textarea
                  className="w-full rounded-lg text-sm py-2 px-3 outline-none resize-none"
                  style={inputStyle}
                  id="message" placeholder="Alguma observação especial?" rows={3}
                  onFocusCapture={focusIn} onBlurCapture={focusOut}
                  {...register("message")}
                />
              </div>
              <div className="md:col-span-2 flex items-start gap-2 mt-2">
                <input
                  className="mt-1 rounded accent-[#E9003F]"
                  id="terms" type="checkbox"
                  {...register("terms")}
                />
                <label className="text-sm" style={{ color: "var(--text-secondary)" }} htmlFor="terms">
                  Concordo com os <a className="hover:underline" style={{ color: "var(--accent)" }} href="#">Termos de Uso</a> e a <a className="hover:underline" style={{ color: "var(--accent)" }} href="#">Política de Privacidade</a> da WebCarros.
                </label>
              </div>
              {errors.terms && <p className="text-red-400 text-sm md:col-span-2">{errors.terms.message}</p>}
              <div className="md:col-span-2 mt-4">
                <button
                  type="submit"
                  className="w-full py-4 rounded-lg text-sm font-semibold text-white shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                  style={{ background: "var(--accent)" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-hover)" }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent)" }}
                >
                  <Calendar className="h-5 w-5" />
                   Solicitar Agendamento
                </button>
              </div>
            </form>
          </div>

          <div className="lg:col-span-5 flex flex-col gap-4">
             {[
               { icon: <Car className="h-5 w-5" />, title: "Teste o carro antes de comprar", desc: "Sinta a performance e o conforto na prática." },
               { icon: <Calendar className="h-5 w-5" />, title: "Test drive de 30 minutos", desc: "Tempo ideal para avaliar todos os detalhes do veículo." },
               { icon: <FileText className="h-5 w-5" />, title: "Sem compromisso, sem taxa", desc: "Agende gratuitamente, sem obrigação de compra." },
               { icon: <Shield className="h-5 w-5" />, title: "Acompanhamento de um consultor", desc: "Tire todas as suas dúvidas com um especialista durante o trajeto." },
             ].map((card) => (
                <div
                   key={card.title}
                className="rounded-xl shadow-sm p-6 flex items-center gap-6 transition-all"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-default)",
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = "rgba(233,0,63,0.45)"
                  el.style.transform = "translateY(-2px)"
                  el.style.boxShadow = "0 12px 32px rgba(0,0,0,0.3)"
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget
                  el.style.borderColor = "var(--border-default)"
                  el.style.transform = "translateY(0)"
                  el.style.boxShadow = "none"
                }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                  style={{
                    background: "rgba(233,0,63,0.08)",
                    border: "1px solid rgba(233,0,63,0.20)",
                  }}
                 >
                   {card.icon}
                 </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{card.title}</h4>
                  <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>{card.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
