import { Link, useNavigate } from "react-router"
import LogoIMG from "../../assets/logo.svg"
import Container from "../../components/container"
import Input from "../../components/input"

import { useForm } from "react-hook-form"
import z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserAuth } from "../../contexts/AuthContext"
import toast from "react-hot-toast"


const schema = z.object({
    email: z.string().email("Insira um email válido!!!").nonempty("O campo email é obrigatório!!!"),
    password: z.string().nonempty("O campo password é obrigatório!!!")
})

type FormData = z.infer<typeof schema>


export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })
    const { signIn } = UserAuth()
    const navigate = useNavigate()



    async function onSubmit(data: FormData) {

        try {
            const result = await signIn(
                data.email,
                data.password
            )
            if (result.success) {
                toast.success("Bem-vindo a WebCarros!")
                navigate("/dashboard")
            }
        }
        catch (error) {
            console.error("DEU ERRO: ", error)
            toast.error("Erro ao fazer login")
        }

    }



    return (
        <div className="w-full min-h-screen flex items-center justify-center" style={{ background: "var(--bg-main)" }}>
            <Container>
                <div className="w-full flex justify-center items-center flex-col">
                    <Link to={"/"}>
                        <img
                            className="w-full"
                            src={LogoIMG}
                            alt="Logo do site" />
                    </Link>

                    <form
                        className="max-w-xl w-full rounded-lg flex flex-col p-6 gap-4 mt-4"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}
                        onSubmit={handleSubmit(onSubmit)}
                    >

                        <div className="flex flex-col gap-3">
                            <Input
                                type="text"
                                placeholder="Digite seu email..."
                                name="email"
                                error={errors.email?.message}
                                register={register}
                            />

                            <Input
                                type="password"
                                placeholder="Digite sua senha..."
                                name="password"
                                error={errors.password?.message}
                                register={register}
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-md h-10 font-medium cursor-pointer text-white transition-all"
                            style={{ background: "var(--accent)" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-hover)" }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent)" }}
                        >
                            Acessar
                        </button>

                    </form>

                    <Link to={"/register"} className="text-sm mt-3 transition-colors" style={{ color: "var(--text-secondary)" }}>
                        Ainda não possui uma conta? <span style={{ color: "var(--accent)" }}>Cadastre-se!</span>
                    </Link>

                </div>
            </Container>
        </div>
    )
}
