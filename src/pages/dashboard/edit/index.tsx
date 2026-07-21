import { useEffect, useState, type ChangeEvent } from "react"
import { useParams, useNavigate } from "react-router"
import Container from "../../../components/container"
import DashboardHeader from "../../../components/panelheader"
import { FiTrash, FiUpload } from "react-icons/fi"

import { UF_OPTIONS } from "../../../constants/ufList"
import { FUEL_OPTIONS } from "../../../constants/fuelList"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Input from "../../../components/input"

import { UserAuth } from "../../../contexts/AuthContext"

import { v4 as uuidV4 } from "uuid"
import { supabase } from "../../../services/supabaseClient"
import toast from "react-hot-toast"

import { type FormData, CarSchema, type CarImagesProps, type CarProps } from "../../../types/car"

type CarUpdatePayload = Omit<CarProps, 'id' | 'created_at'>;

export default function Edit() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user } = UserAuth()

    const [carImages, setCarImages] = useState<CarImagesProps[]>([])
    const [existingImages, setExistingImages] = useState<CarImagesProps[]>([])
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(CarSchema),
        mode: "onChange"
    })

    useEffect(() => {
        async function loadCar() {
            if (!id || !user?.id) return

            const { data, error } = await supabase
                .from("cars")
                .select("*")
                .eq("id", id)
                .single()

            if (error || !data) {
                console.error("Erro ao buscar carro:", error)
                toast.error("Carro não encontrado")
                navigate("/dashboard")
                return
            }

            const car = data as CarProps

            if (car.user_id !== user.id) {
                toast.error("Você não tem permissão para editar este carro")
                navigate("/dashboard")
                return
            }

            reset({
                name: car.name,
                model: car.model,
                year: car.year,
                km: car.km,
                price: String(car.price),
                city: car.city,
                uf: car.uf,
                whatsapp: car.whatsapp,
                description: car.description,
                fuel: car.fuel,
            })

            const loadedImages: CarImagesProps[] = (car.images || []).map((img: any) => ({
                name: img.name,
                uid: img.uid,
                path: img.path,
                url: img.url,
                previewUrl: img.url,
            }))

            setExistingImages(loadedImages)
            setFetching(false)
        }

        loadCar()
    }, [id, user?.id, reset, navigate])

    async function onSubmit(data: FormData) {
        if (!user?.id || !id) return

        const allImages = [...existingImages, ...carImages]

        if (allImages.length === 0) {
            toast.error("Envie no mínimo 1 imagem de carro!")
            return
        }

        setLoading(true)

        const carImageList = allImages.map(image => ({
            url: image.url,
            name: image.name,
            uid: image.uid,
            path: image.path
        }))

        const carData: CarUpdatePayload = {
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
                .update(carData)
                .eq("id", id)

            if (error) {
                console.error("Erro ao atualizar carro: ", error)
                toast.error("Erro ao atualizar carro no servidor")
                return
            }

            toast.success("Carro atualizado com sucesso!")
            navigate("/dashboard")
        } catch (error) {
            console.log("Erro ao atualizar carro: ", error)
            toast.error("Não foi possível atualizar o carro")
        } finally {
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
            } else {
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

                toast.success("Imagem cadastrada com sucesso")
            }
        } catch (error) {
            console.log("Erro inesperado: ", error)
            toast.error("Erro inesperado ao cadastrar imagem")
        } finally {
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
                alert("Erro ao deletar imagem no servidor.")
                return
            }

            setCarImages(prevImages => prevImages.filter(car => car.path !== item.path))
            setExistingImages(prevImages => prevImages.filter(car => car.path !== item.path))

            URL.revokeObjectURL(item.previewUrl)

            toast.success("Imagem deletada com sucesso!")
        } catch (error) {
            console.log("Erro ao deletar imagem no servidor.")
            toast.error("Erro ao deletar imagem no servidor")
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <Container>
                <DashboardHeader />
                <div className="w-full flex justify-center my-4">
                    <div className="animate-spin h-8 w-8 border-4 border-zinc-800 border-t-transparent rounded-full"></div>
                </div>
            </Container>
        )
    }

    return (
        <Container>
            <DashboardHeader />

            {loading && (
                <div className="w-full flex justify-center my-4">
                    <div className="animate-spin h-8 w-8 border-4 border-zinc-800 border-t-transparent rounded-full"></div>
                </div>
            )}

            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">
                <button className="border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                    <div className="absolute cursor-pointer">
                        <FiUpload size={30} color="#000" />
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

                {[...existingImages, ...carImages].map(item => (
                    <div key={item.path}
                        className="flex justify-center items-center relative">
                        <button
                            onClick={() => handleDeleteImage(item)}
                            className="absolute bg-white p-2 rounded-2xl opacity-45 cursor-pointer hover:scale-103 hover:opacity-65"
                        >
                            <FiTrash size={24} color="#000" />
                        </button>
                        <img
                            src={item.previewUrl}
                            alt="Foto do carro"
                            className="rounded-lg w-full h-32 object-cover"
                        />
                    </div>
                ))}
            </div>

            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
                <form
                    className="w-full"
                    onSubmit={handleSubmit(onSubmit)}>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Nome do carro</p>
                        <Input
                            type="text"
                            name="name"
                            placeholder="Ex: Onix 1.0..."
                            register={register}
                            error={errors.name?.message}
                        />
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Modelo do carro</p>
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
                            <p className="mb-2 font-medium">Ano do carro</p>
                            <Input
                                type="text"
                                name="year"
                                placeholder="Ex: 2016/2020..."
                                register={register}
                                error={errors.year?.message}
                            />
                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">KM rodados</p>
                            <Input
                                type="text"
                                name="km"
                                placeholder="Ex: 25.700..."
                                register={register}
                                error={errors.km?.message}
                            />
                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">Combustível</p>
                            <select
                                className="border-2 border-[#878787] w-full rounded-md h-10 px-2"
                                id="fuel"
                                {...register("fuel")}
                            >
                                <option value="" disabled>Selecione</option>
                                {FUEL_OPTIONS.map(fuel => (
                                    <option key={fuel} value={fuel}>{fuel}</option>
                                ))}
                            </select>
                            {errors.fuel && (
                                <p className="mb-1 text-red-500">{errors.fuel?.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex flex-row w-full mb-3 items-center gap-4">
                        <div className="w-full">
                            <p className="mb-2 font-medium">Telefone / Whatsapp</p>
                            <Input
                                type="text"
                                name="whatsapp"
                                placeholder="01140028922"
                                register={register}
                                error={errors.whatsapp?.message}
                            />
                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">Cidade</p>
                            <Input
                                type="text"
                                name="city"
                                placeholder="Chique-Chique"
                                register={register}
                                error={errors.city?.message}
                            />
                        </div>

                        <div className="w-full">
                            <p className="mb-2 font-medium">UF</p>
                            <select
                                className="border-2 border-[#878787] w-full rounded-md h-10 px-2"
                                id="uf"
                                {...register("uf")}
                            >
                                <option value="" disabled>Selecione</option>
                                {UF_OPTIONS.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                            {errors.uf && (
                                <p className="mb-1 text-red-500">{errors.uf?.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Preço</p>
                        <Input
                            type="text"
                            name="price"
                            placeholder="Ex: 25.000..."
                            register={register}
                            error={errors.price?.message}
                        />
                    </div>

                    <div className="mb-3">
                        <p className="mb-2 font-medium">Descrição</p>
                        <textarea
                            className="border-2 border-[#878787] w-full rounded-md h-24 px-2"
                            placeholder="Digite a descrição completa sobre o carro..."
                            {...register("description")}
                            id="description"
                        />
                        {errors.description && (
                            <p className="mb-1 text-red-500">{errors.description?.message}</p>
                        )}
                    </div>

                    <button type="submit" className="rounded-md w-full h-10 bg-zinc-900 text-white font-medium cursor-pointer">
                        Salvar alterações
                    </button>
                </form>
            </div>
        </Container>
    )
}
