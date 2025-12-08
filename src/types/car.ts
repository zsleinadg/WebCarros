import z from "zod";
import { UF_OPTIONS } from "../constants/ufList";

export const CarSchema = z.object({
    name: z.string().nonempty("O campo nome é obrigatório"),
    model: z.string().nonempty("O modelo é obrigatório"),
    year: z.string().nonempty("O ano do carro é obrigatório"),
    km: z.string().nonempty("O KM do carro é obrigatório"),
    price: z.string().nonempty("O preço é obrigatório"),
    city: z.string().nonempty("A cidade é obrigatório"),
    uf: z.string().min(2, "Selecione o estado").refine(value => UF_OPTIONS.includes(value), {message: "Selecione uma UF válida"}),
    whatsapp: z.string().min(1, "O telefone é obrigatório").refine((value) => /^(\d{11,12})$/.test(value), {
        message: "Número de telefone inválido"
    }),
    description: z.string().nonempty("A descrição é obrigatória")
})

export type FormData = z.infer<typeof CarSchema>

export interface CarProps {
    readonly id: string,
    name: string,
    year: string,
    price: string | number,
    city: string,
    uf: string,
    km: string,
    images: CarImagesDBProps[],
    owner: string | undefined,
    description: string,
    readonly created_at?: string,
    user_id?: string,
    model: string,
    whatsapp: string,
}


export interface CarImagesProps {
    name: string,
    uid: string,
    path: string,
    url: string,
    previewUrl: string
}

export interface CarImagesDBProps {
    name: string,
    uid: string,
    path: string,
    url: string,
}