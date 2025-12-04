import { Link } from "react-router";
import logoIMG from "../../assets/logo.svg"


export default function NotFound(){
    return(
        <div className=" w-full h-screen flex items-center justify-center flex-col gap-2">
            <Link to={"/"}>
            <img src={logoIMG} alt="Logo da WebCarros" />
            </Link>
            <h2 className=" font-medium text-7xl">404</h2>
            <h3 className=" font-medium text-2xl">Not Found</h3>

            <Link className=" text-blue-400" to={"/"}>Ir para página home</Link>
        </div>
    )
}