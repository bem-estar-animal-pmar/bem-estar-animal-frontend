"use client";

import React from "react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns"
import { translateError } from "@/src/lib/translation-map";

import { CreatePetFormData, createPetSchema } from "@/src/constants/schemas";
import { catBreedOptions, dogBreedOptions, petSpeciesOptions, petGenderOptions, petSizeOptions, homeStatusOptions, userHomeStatusOptions } from "@/src/constants/constants";

import { Select, DatePicker, Input, Button, Label, InfoPopUp } from "@/src/components/ui";
import { toast } from "@/src/lib/toast-store";
import { SpinnerIcon } from "../../icons/SpinnerIcon";
import { PetCreateIcon } from "../../icons/outline";
import { ApiError } from "@/src/lib/api-error";

interface CreatePetFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

export const CreatePetForm = ({ onSuccess, onCancel }: CreatePetFormProps) => {
    const { control, watch, setValue, formState, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreatePetFormData>({
        resolver: zodResolver(createPetSchema),
        defaultValues: {
            name: "",
            species: undefined,
            gender: undefined,
            breed: undefined,
            weight: 0,
            size: undefined,
            coatColor: "",
            homeStatus: undefined,
            birthDate: undefined, 
            image: undefined
        },
    });

    const selectedSpecies = watch("species");
    
    // 1. Watch the image field to get the selected file
    const selectedImage = watch("image");
    
    // 2. State for the preview URL
    const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

    // 3. Effect to handle object URL creation and cleanup
    React.useEffect(() => {
        if (!selectedImage) {
            setPreviewUrl(null);
            return;
        }

        // Assuming selectedImage is a File object here
        const objectUrl = URL.createObjectURL(selectedImage as unknown as File);
        setPreviewUrl(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
        };
    }, [selectedImage]);

    const filteredBreedOptions = React.useMemo(() => {
        if (!selectedSpecies) {
            return [];
        }

        if (selectedSpecies === "DOG") {
            return dogBreedOptions;
        }
        if (selectedSpecies === "CAT") {
            return catBreedOptions;
        }

        return [];
    }, [selectedSpecies]);

    const handleCreatePet = async (data: CreatePetFormData) => {
        try {
            const formData = new FormData();
            formData.append("name", data.name);
            formData.append("species", data.species!);
            formData.append("gender", data.gender!);
            formData.append("breed", data.breed!);
            formData.append("weight", data.weight.toString());
            formData.append("size", data.size!);
            formData.append("coatColor", data.coatColor);

            if (data.homeStatus) {
                formData.append("homeStatus", data.homeStatus);
            }

            if (data.birthDate) {
                formData.append("birthDate", format(data.birthDate, "yyyy-MM-dd"));
            }

            if (data.image) {
                formData.append("image", data.image);
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets`, {
                method: "POST",
                credentials: "include",
                body: formData
            });

            const dataRes = await response.json();

            if (!response.ok) {
                throw new ApiError(dataRes.message, dataRes.code, dataRes.details);
            }

            toast.success("Pet cadastrado com sucesso!");
            onSuccess();
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível cadastrar pet."
            });
        }
    };

return (
        <form onSubmit={handleSubmit(handleCreatePet)} className="flex flex-col gap-4">

            <div className="flex flex-col gap-4 p-3 h-fit! max-h-[calc(70vh)] overflow-y-auto">
                <div>
                    <Label htmlFor="name">Nome do pet</Label>
                    <Controller
                        name="name"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="name"
                                placeholder="Ex: Rex"
                                {...field}
                                variant={errors.name ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.name && <span className="text-danger-fg text-sm">{errors.name.message}</span>}
                </div>

                <div className="flex flex-col gap-2">
                    <Label htmlFor="image">Foto do pet</Label>
                    
                    <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-end">
                        <div className="sm:order-1 flex items-center justify-center py-2">
                            {previewUrl ? (
                                <img 
                                    src={previewUrl} 
                                    alt="Preview da foto do pet" 
                                    className="w-28 aspect-square object-cover h-fit rounded-full border-2 border-primary"
                                />
                            ) : (
                                <div className="w-28 aspect-square object-cover h-fit rounded-full bg-card border border-dashed border-default-border flex items-center justify-center text-xs text-muted-fg text-center p-4">
                                    Nenhuma foto selecionada
                                </div>
                            )}
                        </div>

                        <div>
                            <Controller
                                name="image"
                                control={control}
                                render={({ field: { onChange, onBlur, name } }) => (
                                    <Input
                                        type="file"
                                        id="image"
                                        name={name}
                                        onBlur={onBlur}
                                        accept="image/jpeg, image/jpg, image/png, image/webp" 
                                        variant={errors.image ? "danger" : "primary"}
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            // The Controller triggers onChange with the file,
                                            // which updates the form state, triggering our watch & useEffect
                                            onChange(file); 
                                        }}
                                    />
                                )}
                            />
                            {errors.image && <span className="text-danger-fg text-sm">{errors.image.message as string}</span>}
                        </div>
                    </div>

                </div>

                <div className="flex gap-4 w-full">
                    <div className="flex-1">
                            <Label htmlFor="species">Espécie</Label>
                            <Controller
                                name="species"
                                control={control}
                                render={({ field: { value, onChange, name, onBlur } }) => (
                                    <Select
                                        id="species"
                                        name={name}
                                        placeholder="Selecione..."
                                        value={value}
                                        onChange={(val) => {
                                            onChange(val);
                                            setValue("breed", undefined as any);
                                        }}
                                        onBlur={onBlur}
                                        options={petSpeciesOptions}
                                        variant={errors.species ? "danger" : "default"}
                                    />
                                )}
                            />
                            {errors.species && <span className="text-danger-fg text-sm">{errors.species.message}</span>}
                    </div>

                    <div className="flex-1">
                        <Label htmlFor="gender">Gênero</Label>
                        <Controller
                            name="gender"
                            control={control}
                            render={({ field: { value, onChange, name, onBlur } }) => (
                                <Select
                                    id="gender"
                                    name={name}
                                    placeholder="Selecione..."
                                    value={value}
                                    onChange={onChange}
                                    onBlur={onBlur}
                                    options={petGenderOptions}
                                    variant={errors.gender ? "danger" : "default"}
                                />
                            )}
                        />
                        {errors.gender && <span className="text-danger-fg text-sm">{errors.gender.message}</span>}
                    </div>
                </div>

                <div>
                    <Label htmlFor="birthDate">Data de Nascimento (Opcional)</Label>
                    <Controller
                        name="birthDate"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <DatePicker
                                value={value}
                                disabledBefore={new Date("2000-01-01")}
                                onChange={onChange}
                                placeholder="Selecione uma data..."
                                variant={errors.birthDate ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.birthDate && <span className="text-danger-fg text-sm">{errors.birthDate.message}</span>}
                </div>

                <div className="flex gap-4 w-full">
                    <div className="w-2/3">
                        <Label htmlFor="breed">Raça</Label>
                        <Controller
                            name="breed"
                            control={control}
                            render={({ field: { value, onChange, name, onBlur } }) => (
                            <Select
                                id="breed"
                                name={name}
                                placeholder={selectedSpecies ? "Selecione a raça..." : "Selecione a espécie primeiro"}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                options={filteredBreedOptions} 
                                disabled={!selectedSpecies}    
                                variant={errors.breed ? "danger" : "default"}
                            />
                            )}
                        />
                        {errors.breed && <span className="text-danger-fg text-sm">{errors.breed.message}</span>}
                    </div>

                    <div className="w-1/3">
                        <Label htmlFor="weight">Peso (kg)</Label>
                        <Controller
                            name="weight"
                            control={control}
                            render={({ field: { value, onChange, ...restField } }) => (
                            <Input
                                id="weight"
                                type="number"
                                step="0.1"
                                placeholder="Ex: 10.5"
                                value={value === 0 ? "" : value}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    onChange(val === "" ? 0 : Number(val));
                                }}
                                {...restField}
                                variant={errors.weight ? "danger" : "default"}
                            />
                            )}
                        />
                        {errors.weight && <span className="text-danger-fg text-sm">{errors.weight.message}</span>}
                    </div>
                </div>

                <div className="flex gap-4 w-full">
                    <div className="w-2/4">
                        <Label htmlFor="coatColor">Cor da pelagem</Label>
                        <Controller
                            name="coatColor"
                            control={control}
                            render={({ field }) => (
                            <Input
                                id="coatColor"
                                placeholder="Ex: Preto, Branco..."
                                {...field}
                                variant={errors.coatColor ? "danger" : "default"}
                            />
                            )}
                        />
                        {errors.coatColor && <span className="text-danger-fg text-sm">{errors.coatColor.message}</span>}
                    </div>
                    <div className="w-2/4">
                        <Label htmlFor="size">Porte</Label>
                        <Controller
                            name="size"
                            control={control}
                            render={({ field: { value, onChange, name, onBlur } }) => (
                            <Select
                                id="size"
                                name={name}
                                placeholder={"Selecione a porte..."}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                options={petSizeOptions}
                                variant={errors.size ? "danger" : "default"}
                            />
                            )}
                        />
                        {errors.size && <span className="text-danger-fg text-sm">{errors.size.message}</span>}
                    </div>
                </div>

                <div>
                    <Label className="flex gap-2 pb-1 items-end" htmlFor="homeStatus">
                        Situação de moradia
                        <InfoPopUp>
                            Se você é o responsável legal pelo pet em questão selecione como tutor, caso seja um animal que você está cuidando temporariamente marque como lar temporário.
                        </InfoPopUp>
                    </Label>
                    <Controller
                        name="homeStatus"
                        control={control}
                        render={({ field: { value, onChange, name, onBlur } }) => (
                            <Select
                                id="homeStatus"
                                name={name}
                                placeholder="Selecione..."
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                options={userHomeStatusOptions}
                                variant={errors.homeStatus ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.homeStatus && <span className="text-danger-fg text-sm">{errors.homeStatus.message}</span>}
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="flex gap-2 items-center">
                            <SpinnerIcon/> Salvando... 
                        </span>
                    )
                    : 
                        <span className="flex gap-2 items-center">
                            <PetCreateIcon/> Salvar pet 
                        </span>
                    }
                </Button>
            </div>
        </form>
    );
};