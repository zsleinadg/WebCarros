
import type { RegisterOptions, UseFormRegister } from "react-hook-form"

interface InputProps {
    type: string,
    placeholder: string,
    name: string,
    register: UseFormRegister<any>,
    error?: string,
    rules?: RegisterOptions
}

export default function Input({ type, placeholder, name, register, error, rules }: InputProps) {
    return (
        <div>
            <input
                className=" w-full rounded-md h-11 px-2 outline-none"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                type={type}
                placeholder={placeholder}
                {...register(name, rules)}
                id={name}
                onFocusCapture={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(233,0,63,0.12)" }}
                onBlurCapture={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.boxShadow = "none" }}
            />
            {error && (
                <div className=" w-full flex items-center">
                    <p className=" text-red-500 px-1">{error}</p>
                </div>
            )}
        </div>
    )
}