
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
                className=" w-full border border-[#878787] rounded-md h-11 px-2"
                type={type}
                placeholder={placeholder}
                {...register(name, rules)}
                id={name}
            />
            {error && (
                <div className=" w-full flex items-center">
                    <p className=" text-red-500 px-1">{error}</p>
                </div>
            )}
        </div>
    )
}