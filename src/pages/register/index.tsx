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
    name: z.string().nonempty("O campo name é obrigatório!!!"),
    email: z.string().email("Insira um email válido!!!").nonempty("O campo email é obrigatório!!!"),
    password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres!!!").nonempty("O campo password é obrigatório!!!")
})

type FormData = z.infer<typeof schema>


export default function Register() {

    const navigate = useNavigate()
    const {signUp} = UserAuth()

    const {register, handleSubmit, formState: { errors }} = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange"
    })



    async function onSubmit(data: FormData){
        
        try {
            const result = await signUp(data.email, data.password, data.name)

            if(result.success) {
                toast.success("Usuário cadastrado com sucesso!")
                navigate("/login")
            }
        }
        catch(error){
            console.error("DEU ERRO: ", error)
            toast.error("Não foi possivel realizar o cadastro")
        }
        finally{

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
                        placeholder="Digite seu nome completo..."
                        name="name"
                        error={errors.name?.message}
                        register={register}
                        />

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
                    
                    <button type="submit" className=" bg-zinc-900 w-full rounded-md text-white h-10 font-medium cursor-pointer hover:scale-101">Cadastrar</button>

                </form>

                <Link to={"/login"}>
                    Já possui uma conta? Faça login!
                </Link>


            </div>
        </Container>
    )
}