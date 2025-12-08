import Container from "../../../components/container";
import DashboardHeader from "../../../components/panelheader";
import { FiTrash, FiUpload } from "react-icons/fi";

import { UF_OPTIONS } from "../../../constants/ufList";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Input from "../../../components/input";
import { useState, type ChangeEvent } from "react";

import { UserAuth } from "../../../contexts/AuthContext";

import { v4 as uuidV4 } from "uuid"
import { supabase } from "../../../services/supabaseClient";
import toast from "react-hot-toast";

import { type FormData, CarSchema, type CarImagesProps, type CarProps } from "../../../types/car";

type CarInsertPayload = Omit<CarProps, 'id' | 'created_at'>;


export default function New() {

    const { user } = UserAuth()

    const [carImages, setCarImages] = useState<CarImagesProps[]>([])

    const [loading, setLoading] = useState(false)

    const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
        resolver: zodResolver(CarSchema),
        mode: "onChange"
    })


    async function onSubmit(data: FormData) {
        if(!user?.id) return

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
            user_id: user?.id,
            images: carImageList,
            owner: user?.name
        }

        try {
            const {error} = await supabase
            .from("cars")
            .insert(carData)

            if(error) {
                console.error("Erro ao cadastrar carro no servidor: ", error)
                toast.error("Erro ao cadastrar carro no servidor")
                return
            }
            
            reset()
            setCarImages([])
            toast.success("Carro cadastrado com sucesso!")
        }
        catch(error) {
            console.log("Erro ao cadastrar carro: ", error)
            toast.error("Não foi possivel cadastrar o carro")
        }
        finally{
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
        finally{
         setLoading(false)   
        }

    }

    async function handleDeleteImage(item: CarImagesProps){
        if(!user?.id) return

        setLoading(true)

        const deletePath = item.path

        try{
            const { data, error } = await supabase
            .storage
            .from("images")
            .remove([deletePath])

            if(data && data.length === 0) {
                console.warn("AVISO: Arquivo não encontrado no Supabase")
            }

            if(error) {
                console.log("Houve um erro ao deletar a imagem no servidor: ", error)
                alert("Erro ao deletar imagem no servidor.")
                return
            }

            setCarImages(prevImages => prevImages.filter(car => car.path !== item.path))

            URL.revokeObjectURL(item.previewUrl)
            
            toast.success("imagem deletada com sucesso!")

        }
        catch(error){
            console.log("Erro ao deletar imagem no servidor.")
            toast.error("Erro ao deletar imagem no servidor")
        }
        finally{
            setLoading(false)
        }
    }


    return (
        <Container>
            <DashboardHeader />

            {loading && (
                <div className=" w-full flex justify-center my-4">
                    <div className=" animate-spin h-8 w-8 border-4 border-zinc-800 border-t-transparent rounded-full"></div>
                </div>
            )}

            <div className="w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2">

                <button className=" border-2 w-48 rounded-lg flex items-center justify-center cursor-pointer border-gray-600 h-32 md:w-48">
                    <div className=" absolute cursor-pointer">
                        <FiUpload size={30} color="#000" />
                    </div>
                    <div className=" cursor-pointer">
                        <input
                            type="file"
                            accept="image/*"
                            className=" opacity-0 cursor-pointer"
                            onChange={handleFile}
                        />
                    </div>
                </button>

                {carImages.map(item => (
                    <div key={item.path}
                        className=" flex justify-center items-center">
                        <button
                            onClick={ () => handleDeleteImage(item)}
                            className="absolute bg-white p-2 rounded-2xl opacity-45 cursor-pointer hover:scale-103 hover:opacity-65"
                        >
                            <FiTrash size={24} color="#000" />
                        </button>
                        <img
                            src={item.previewUrl}
                            alt="Foto do carro"
                            className=" rounded-lg w-full h-32 object-cover"
                        />
                    </div>
                ))}
            </div>

            <div className=" w-full bg-white p-3 rounded-lg flex flex-col sm:flex-row items-center gap-2 mt-2">
                <form
                    className=" w-full"
                    onSubmit={handleSubmit(onSubmit)}>

                    <div className="mb-3">
                        <p className=" mb-2 font-medium">Nome do carro</p>
                        <Input
                            type="text"
                            name="name"
                            placeholder="Ex: Onix 1.0..."
                            register={register}
                            error={errors.name?.message}
                        />
                    </div>

                    <div className="mb-3">
                        <p className=" mb-2 font-medium">Modelo do carro</p>
                        <Input
                            type="text"
                            name="model"
                            placeholder="Ex: 1.0 Flex PLUS MANUAL..."
                            register={register}
                            error={errors.model?.message}
                        />
                    </div>

                    <div className=" flex flex-row w-full mb-3 items-center gap-4 ">
                        <div className="w-full">
                            <p className=" mb-2 font-medium">Ano do carro</p>
                            <Input
                                type="text"
                                name="year"
                                placeholder="Ex: 2016/2020..."
                                register={register}
                                error={errors.year?.message}
                            />
                        </div>

                        <div className="w-full">
                            <p className=" mb-2 font-medium">KM rodados</p>
                            <Input
                                type="text"
                                name="km"
                                placeholder="Ex: 25.700..."
                                register={register}
                                error={errors.km?.message}
                            />
                        </div>
                    </div>

                    <div className=" flex flex-row w-full mb-3 items-center gap-4 ">
                        <div className="w-full">
                            <p className=" mb-2 font-medium">Telefone / Whatsapp</p>
                            <Input
                                type="text"
                                name="whatsapp"
                                placeholder="01140028922"
                                register={register}
                                error={errors.whatsapp?.message}
                            />
                        </div>

                        <div className="w-full">
                            <p className=" mb-2 font-medium">Cidade</p>
                            <Input
                                type="text"
                                name="city"
                                placeholder="Chique-Chique"
                                register={register}
                                error={errors.city?.message}
                            />
                        </div>

                        <div className="w-full">
                            <p className=" mb-2 font-medium">UF</p>
                            <select 
                            className=" border-2 border-[#878787]  w-full rounded-md h-10 px-2" 
                            id="uf"
                            {...register("uf")}
                            >
                                <option value="" disabled>Selecione</option>
                                {UF_OPTIONS.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>

                            {errors.uf && (
                                <p className=" mb-1 text-red-500">{errors.uf?.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="mb-3">
                        <p className=" mb-2 font-medium">Preço</p>
                        <Input
                            type="text"
                            name="price"
                            placeholder="Ex: 25.000..."
                            register={register}
                            error={errors.price?.message}
                        />
                    </div>

                    <div className="mb-3">
                        <p className=" mb-2 font-medium">Descrição</p>
                        <textarea
                            className="border-2 border-[#878787] w-full rounded-md h-24 px-2"
                            placeholder="Digite a descrição completa sobre o carro..."
                            {...register("description")}
                            id="description"
                        />
                        {errors.description && (
                            <p className=" mb-1 text-red-500">{errors.description?.message}</p>
                        )}
                    </div>

                    <button type="submit" className=" rounded-md w-full h-10 bg-zinc-900 text-white font-medium cursor-pointer">
                        Cadastrar carro
                    </button>



                </form>
            </div>

        </Container>
    )
}