import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "../services/supabaseClient";
import type { Session } from "@supabase/supabase-js";


interface AuthContextData {
    session: Session | null;
    user: UserProps | null;
    signed: boolean
    loadingAuth: boolean

    signUp: (email: string, password: string, name: string) => Promise<any>;
    signIn: (email: string, password: string) => Promise<any>;
    signOut: () => Promise<any>;
}

interface AuthProviderProps {
    children: ReactNode
}

interface UserProps {
    id: string;
    name?: string;
    email?: string
}



export const AuthContext = createContext({} as AuthContextData)

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<UserProps | null>(null)
    const [loadingAuth, setLoadingAuth] = useState(true)

    // REGISTER
    const signUp = async (email: string, password: string, name: string) => {
        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name
                }
            }
        })

        if (error) {
            console.error("ERRO QUE DEU: ", error)
            return { success: false, error }
        }

        console.log("CADASTRADO COM SUCESSO: ", data)

        return { success: true, data }
    }

    // LOGIN
    const signIn = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            })
            if (error) {
                alert("Falha ao fazer login, tente novamente!")
                console.error("Deu erro no login: ", error)
                return { success: false, error: error.message }
            }
            console.log("Sucesso no login: ", data)
            return { success: true, data }
        }
        catch (error) {
            console.error("DEU ERRO: ", error)
        }

    }

    // LOGOUT
    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) {
            console.error("ERRO QUE DEU: ", error)
        }
    }


    useEffect(() => {
        const setup = async () => {
            const { data } = await supabase.auth.getSession()
            setSession(data.session)

            if (data.session) {
                setUser({
                    id: data.session.user.id,
                    email: data.session.user.email,
                    name: data.session.user.user_metadata.name
                })
            }
            setLoadingAuth(false)
        }

        setup()

        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)

            if (session) {
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    name: session.user.user_metadata.name
                })
                setLoadingAuth(false)
            }
            else {
                setUser(null)
                setLoadingAuth(false)
            }
        })

        return () => {
            listener.subscription.unsubscribe()
        }
    }, [])

    // VALUES
    const values: AuthContextData = {
        session, user, signed: !!user, loadingAuth, signUp, signIn, signOut
    }

    return (
        <AuthContext.Provider value={values}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(AuthContext)
}