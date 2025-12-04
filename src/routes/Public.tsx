import type { ReactNode } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router";

interface PublicProps {
    children: ReactNode
}

export default function Public({children}: PublicProps){
    const {signed, loadingAuth} = UserAuth()

    if(loadingAuth) {
        return <div></div>
    }

    if(signed) {
        return <Navigate to={"/dashboard"}/>
    }

    return children
}