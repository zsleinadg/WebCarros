import { Link } from "react-router"
import logoIMG from "../../assets/logo.svg"
import { FiUser, FiLogIn } from "react-icons/fi"
import { UserAuth } from "../../contexts/AuthContext"

export default function Header() {
    const {signed, loadingAuth, signOut} = UserAuth()

    async function handleSignOut() {
        await signOut()
        
    }


    return (
        <div className=" bg-white w-full flex h-16 items-center drop-shadow mb-4">
            <header className=" w-full max-w-7xl flex justify-between items-center mx-auto px-4">
                <Link to={"/"}>
                    <img
                        src={logoIMG}
                        alt="Logo do site" />
                </Link>


                {!loadingAuth && signed && (
                    <div className="flex gap-2" >
                    <Link to={"/dashboard"}>
                    <div className=" border-2 rounded-full p-1 border-gray-900">
                        <FiUser size={24} color="#000" />
                    </div>
                </Link>
                <button className=" text-red-800 font-medium cursor-pointer hover:bg-slate-200" onClick={handleSignOut}>Sair</button>
                    </div>
                )}

                {!loadingAuth && !signed && (
                    <Link to={"/login"}>
                    <div className=" p-1">
                        <FiLogIn size={24} color="#000" />
                    </div>
                </Link>
                )}


            </header>
        </div>
    )
}