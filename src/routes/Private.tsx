import type { ReactNode } from "react";
import { UserAuth } from "../contexts/AuthContext";
import { Navigate } from "react-router";

interface PrivateProps {
    children: ReactNode
}

export default function Private({children}: PrivateProps) {
    const {signed, loadingAuth} = UserAuth()

    if(loadingAuth) {
        return <div></div>
    }

    if(!signed) {
        return <Navigate to={"/login"}/>
    }

    return children
}