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
    const {signIn} = UserAuth()
    const navigate = useNavigate()



    async function onSubmit(data: FormData) {

        try{
            const result = await signIn(
                data.email,
                data.password
            )
            if(result.success) {
                toast.success("Bem-vindo a WebCarros!")
                navigate("/dashboard")
            }
        }
        catch(error){
            console.error("DEU ERRO: ", error)
            toast.error("Erro ao fazer login")
        }
        
    }



    return (
        <Container>
            <div className=" w-full min-h-screen flex justify-center items-center flex-col">
                <Link to={"/"}>
                    <img
                        className=" w-full"
                        src={LogoIMG}
                        alt="Logo do site" />
                </Link>

                <form
                    className=" bg-white max-w-xl w-full rounded-lg flex flex-col p-4 gap-3"
                    onSubmit={handleSubmit(onSubmit)}
                >

                    <div className=" flex flex-col gap-3">
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

                    <button type="submit" className=" bg-zinc-900 w-full rounded-md text-white h-10 font-medium cursor-pointer hover:scale-101">Acessar</button>

                </form>

                <Link to={"/register"}>
                    Ainda não possui uma conta? Cadastre-se!
                </Link>

            </div>
        </Container>
    )
}