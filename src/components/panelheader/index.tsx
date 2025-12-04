import { Link } from "react-router";
import { UserAuth } from "../../contexts/AuthContext";


export default function DashboardHeader() {
    const {signOut} = UserAuth()

    async function handleSignout(){
        await signOut()
    }

    return (
        <div className=" w-full flex items-center h-10 rounded-lg text-white font-medium gap-4 px-4 bg-red-500 mb-4">
            <Link to={"/dashboard"}>
                Dashboard
            </Link>
            <Link to={"/dashboard/new"}>
                Cadastrar carro
            </Link>

            <button className=" ml-auto cursor-pointer" onClick={handleSignout}>
                Sair da conta
            </button>


        </div>
    )
}