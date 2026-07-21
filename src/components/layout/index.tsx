import Header from "../header";
import Footer from "../footer";
import { Outlet } from "react-router";
import { FavoritesProvider } from "../../contexts/FavoritesContext";

export default function Layout(){
    return(
        <FavoritesProvider>
        <Header/>
        <Outlet/>
        <Footer/>
        </FavoritesProvider>
    )
}
