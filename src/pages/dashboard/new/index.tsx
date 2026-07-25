import Container from "../../../components/container";
import DashboardHeader from "../../../components/panelheader";
import { FiTrash, FiUpload } from "react-icons/fi";

import { UF_OPTIONS } from "../../../constants/ufList";
import { FUEL_OPTIONS } from "../../../constants/fuelList";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../../components/input";
import { useState, type ChangeEvent } from "react";

import { UserAuth } from "../../../contexts/AuthContext";

import { v4 as uuidV4 } from "uuid"
import { supabase } from "../../../services/supabaseClient";
import toast from "react-hot-toast";

import { type FormData, CarSchema, type CarImagesProps, type CarProps } from "../../../types/car";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "../../../components/select";
import { formatPhone } from "../../../utils/formatPhone";

type CarInsertPayload = Omit<CarProps, 'id' | 'created_at'>;


export default function New() {

    const { user } = UserAuth()

    const [carImages, setCarImages] = useState<CarImagesProps[]>([])

    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm<FormData>({
        resolver: zodResolver(CarSchema),
        mode: "onChange"
    })


    async function onSubmit(data: FormData) {
        if (!user?.id) return

        if (carImages.length === 0) {
            toast.error("Envie no mínimo 1 imagem de carro!")
            return
        }

        setLoading(true)

        const carImageList = carImages.map(image => ({
            url: image.url,
            name: image.name,
            uid: image.uid,
            path: image.path
        }))

        const carData: CarInsertPayload = {
            name: data.name,
            model: data.model,
            year: data.year,
            km: data.km,
            price: data.price,
            city: data.city,
            uf: data.uf,
            whatsapp: data.whatsapp,
            description: data.description,
            fuel: data.fuel,
            user_id: user?.id,
            images: carImageList,
            owner: user?.name
        }

        try {
            const { error } = await supabase
                .from("cars")
                .insert(carData)

            if (error) {
                console.error("Erro ao cadastrar carro no servidor: ", error)
                toast.error("Erro ao cadastrar carro no servidor")
                return
            }

            reset()
            setCarImages([])
            toast.success("Carro cadastrado com sucesso!")
        }
        catch (error) {
            console.log("Erro ao cadastrar carro: ", error)
            toast.error("Não foi possivel cadastrar o carro")
        }
        finally {
            setLoading(false)
        }
    }

    function handleFile(e: ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files[0]) {
            const image = e.target.files[0]

            const maxsize = 5 * 1024 * 1024

            if (image.type === "image/jpeg" || image.type === "image/png") {
                if (image.size > maxsize) {
                    toast.error("O arquivo é muito grande! O tamanho máximo permitido é 5MB.")
                    return
                }
                handleUpload(image)
            }
            else {
                toast.error("Envie uma imagem JPEG ou PNG!")
                return
            }
        }
    }

    async function handleUpload(image: File) {
        if (!user?.id) return

        setLoading(true)

        const currentId = user?.id
        const uidImage = uuidV4()

        const fileExt = image.name.split(".").pop()
        const fileNameWithExt = `${uidImage}.${fileExt}`

        const uploadPath = `${currentId}/${fileNameWithExt}`

        try {
            const { error } = await supabase
                .storage
                .from("images")
                .upload(uploadPath, image)

            if (error) {
                console.log("Erro no upload: ", error)
                toast.error("Erro ao fazer upload")
                return
            }

            const { data: publicUrlData } = supabase
                .storage
                .from("images")
                .getPublicUrl(uploadPath)

            if (publicUrlData.publicUrl) {

                const imageItem: CarImagesProps = {
                    name: fileNameWithExt,
                    uid: currentId,
                    path: uploadPath,
                    url: publicUrlData.publicUrl,
                    previewUrl: URL.createObjectURL(image)
                }

                setCarImages((prevImages) =>
                    [...prevImages, imageItem])

                console.log("Upload concluído: ", publicUrlData.publicUrl)
                toast.success("Imagem cadastrada com sucesso")
            }

        } catch (error) {
            console.log("Erro inesperado: ", error)
            toast.error("Erro inesperado ao cadastrar imagem")
        }
        finally {
            setLoading(false)
        }

    }

    async function handleDeleteImage(item: CarImagesProps) {
        if (!user?.id) return

        setLoading(true)

        const deletePath = item.path

        try {
            const { data, error } = await supabase
                .storage
                .from("images")
                .remove([deletePath])

            if (data && data.length === 0) {
                console.warn("AVISO: Arquivo não encontrado no Supabase")
            }

            if (error) {
                console.log("Houve um erro ao deletar a imagem no servidor: ", error)
                toast.error("Erro ao deletar imagem no servidor.")
                return
            }

            setCarImages(prevImages => prevImages.filter(car => car.path !== item.path))

            URL.revokeObjectURL(item.previewUrl)

            toast.success("imagem deletada com sucesso!")

        }
        catch (error) {
            console.log("Erro ao deletar imagem no servidor.")
            toast.error("Erro ao deletar imagem no servidor")
        }
        finally {
            setLoading(false)
        }
    }


    return (
        <div className="w-full min-h-screen" style={{ background: "var(--bg-main)" }}>
            <Container>
                <DashboardHeader />

                {loading && (
                    <div className="w-full flex justify-center my-4">
                        <div className="animate-spin h-8 w-8 border-4 rounded-full" style={{ borderColor: "var(--accent)", borderTopColor: "transparent" }} />
                    </div>
                )}

                <div className="w-full p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                    <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer h-32 md:w-48" style={{ borderColor: "var(--border-default)" }}>
                        <div className="absolute cursor-pointer">
                            <FiUpload size={30} style={{ color: "var(--text-muted)" }} />
                        </div>
                        <div className="cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                className="opacity-0 cursor-pointer"
                                onChange={handleFile}
                            />
                        </div>
                    </button>

                    {carImages.map(item => (
                        <div key={item.path} className="flex justify-center items-center relative">
                            <button
                                onClick={() => handleDeleteImage(item)}
                                className="absolute p-2 rounded-2xl opacity-45 cursor-pointer hover:scale-105 hover:opacity-65 transition-all"
                                style={{ background: "var(--bg-card)" }}
                            >
                                <FiTrash size={24} style={{ color: "var(--accent)" }} />
                            </button>
                            <img
                                src={item.previewUrl}
                                alt="Foto do carro"
                                className="rounded-lg w-full h-32 object-cover"
                            />
                        </div>
                    ))}
                </div>

                <div className="w-full p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2" style={{ background: "var(--bg-card)", border: "1px solid var(--border-default)" }}>
                    <form
                        className="w-full"
                        onSubmit={handleSubmit(onSubmit)}>

                        <div className="mb-3">
                            <p className="mb-2 font-medium text-white">Nome do carro</p>
                            <Input
                                type="text"
                                name="name"
                                placeholder="Ex: Onix 1.0..."
                                register={register}
                                error={errors.name?.message}
                            />
                        </div>

                        <div className="mb-3">
                            <p className="mb-2 font-medium text-white">Modelo do carro</p>
                            <Input
                                type="text"
                                name="model"
                                placeholder="Ex: 1.0 Flex PLUS MANUAL..."
                                register={register}
                                error={errors.model?.message}
                            />
                        </div>

                        <div className="flex flex-row w-full mb-3 items-center gap-4">
                            <div className="w-full">
                                <p className="mb-2 font-medium text-white">Ano do carro</p>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    className="no-spinner"
                                    name="year"
                                    placeholder="Ex: 2016/2020..."
                                    register={register}
                                    error={errors.year?.message}
                                    mask={(val) => val.replace(/\D/g, "")}
                                    onKeyDown={(e) => {
                                        if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault()
                                    }}
                                />
                            </div>

                            <div className="w-full">
                                <p className="mb-2 font-medium text-white">KM rodados</p>
                                <Input
                                    type="text"
                                    inputMode="numeric"
                                    className="no-spinner"
                                    name="km"
                                    placeholder="Ex: 25.700..."
                                    register={register}
                                    error={errors.km?.message}
                                    mask={(val) => val.replace(/\D/g, "")}
                                    onKeyDown={(e) => {
                                        if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault()
                                    }}
                                />
                            </div>

                            <div className="w-full">
                                <p className="mb-2 font-medium text-white">Combustível</p>
                                <Select value={watch("fuel") || ""} onValueChange={(val) => setValue("fuel", val, { shouldValidate: true })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {FUEL_OPTIONS.map(fuel => (
                                            <SelectItem key={fuel} value={fuel}>{fuel}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.fuel && (
                                    <p className="mb-1 text-red-400">{errors.fuel?.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-row w-full mb-3 items-center gap-4">
                            <div className="w-full">
                                <p className="mb-2 font-medium text-white">Telefone / Whatsapp</p>
                                <Input
                                    type="text"
                                    name="whatsapp"
                                    placeholder="(11) 99999-9999"
                                    register={register}
                                    mask={formatPhone}
                                    error={errors.whatsapp?.message}
                                />
                            </div>

                            <div className="w-full">
                                <p className="mb-2 font-medium text-white">Cidade</p>
                                <Input
                                    type="text"
                                    name="city"
                                    placeholder="Chique-Chique"
                                    register={register}
                                    error={errors.city?.message}
                                />
                            </div>

                            <div className="w-full">
                                <p className="mb-2 font-medium text-white">UF</p>
                                <Select value={watch("uf") || ""} onValueChange={(val) => setValue("uf", val, { shouldValidate: true })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {UF_OPTIONS.map(uf => (
                                            <SelectItem key={uf} value={uf}>{uf}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.uf && (
                                    <p className="mb-1 text-red-400">{errors.uf?.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="mb-3">
                            <p className="mb-2 font-medium text-white">Preço</p>
                            <Input
                                type="text"
                                inputMode="numeric"
                                className="no-spinner"
                                name="price"
                                placeholder="Ex: 25.000..."
                                register={register}
                                error={errors.price?.message}
                                mask={(val) => val.replace(/\D/g, "")}
                                onKeyDown={(e) => {
                                    if (["e", "E", "+", "-"].includes(e.key)) e.preventDefault()
                                }}
                            />
                        </div>

                        <div className="mb-3">
                            <p className="mb-2 font-medium text-white">Descrição</p>
                            <textarea
                                className="w-full rounded-md h-24 px-2 outline-none resize-none"
                                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-default)", color: "var(--text-primary)" }}
                                placeholder="Digite a descrição completa sobre o carro..."
                                {...register("description")}
                                id="description"
                                onFocusCapture={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(233,0,63,0.12)" }}
                                onBlurCapture={(e) => { e.currentTarget.style.borderColor = "var(--border-default)"; e.currentTarget.style.boxShadow = "none" }}
                            />
                            {errors.description && (
                                <p className="mb-1 text-red-400">{errors.description?.message}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            className="rounded-md w-full h-10 font-medium cursor-pointer text-white transition-all"
                            style={{ background: "var(--accent)" }}
                            onMouseEnter={(e) => { e.currentTarget.style.background = "var(--accent-hover)" }}
                            onMouseLeave={(e) => { e.currentTarget.style.background = "var(--accent)" }}
                        >
                            Cadastrar carro
                        </button>

                    </form>
                </div>

            </Container>
        </div>
    )
}
