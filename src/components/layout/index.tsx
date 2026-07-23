import Header from "../header";
import Footer from "../footer";
import { Outlet } from "react-router";

export default function Layout(){
    return(
        <>
        <Header/>
        <Outlet/>
        <Footer/>
        </>
    )
}
