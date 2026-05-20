"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns"
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/src/lib/api-error";
import { translateError } from "@/src/lib/error-map";
import { translateTable } from "@/src/lib/table-map";
import { toast } from "@/src/lib/toast-store";

import Image from "next/image";
import pet_avatar_placeholder from "@/public/pet-avatar-placeholder.webp";

import { updatePetSchema, UpdatePetFormData } from "@/src/constants/schemas"; 
import type { PetById } from "@/src/constants/interfaces";
import { 
    catBreedOptions, 
    dogBreedOptions, 
    petSpeciesOptions, 
    petSizeOptions 
} from "@/src/constants/constants";
import { Select, DatePicker, Input, Button, Label, Dialog } from "@/src/components/ui";
import { SpinnerIcon } from "../../icons/SpinnerIcon";

interface AdminUpdatePetFormProps {
    pet: PetById;
    onUpdateSuccess: (updatedFields: any) => void;
}

export const UpdatePetForm = ({ pet, onUpdateSuccess }: AdminUpdatePetFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updateWarningDialogOpen, setUpdateWarningDialogOpen] = useState(false);

    const { control, watch, setValue, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UpdatePetFormData>({
        resolver: zodResolver(updatePetSchema) as any,
        defaultValues: {
            name: pet.name,
            species: pet.species as any,
            breed: pet.breed as any,
            weight: pet.weight,
            size: pet.size as any,
            coatColor: pet.coatColor,
            birthDate: pet.birthDate ? (
                () => {
                    const dateOnly= pet.birthDate.split('T')[0]; 
                    return new Date(`${dateOnly}T00:00:00`); 
                }
            )() : undefined,
            chip: pet.chip !== "NO_CHIP" ? pet.chip : "",
            allowEmergency: pet.allowEmergency,
            adoptionStatus: pet.adoptionStatus
        },
    });

    const selectedSpecies = watch("species");

    const filteredBreedOptions = useMemo(() => {
        if (selectedSpecies === "DOG") return dogBreedOptions;
        if (selectedSpecies === "CAT") return catBreedOptions;
        return [];
    }, [selectedSpecies]);

    useEffect(() => {
        if (selectedSpecies !== pet.species) {
            setValue("breed", undefined as any);
        }
    }, [selectedSpecies, pet.species, setValue]);

    const handleUpdatePet = async (data: UpdatePetFormData) => {
        try {
            const payload = { 
                ...data,
                birthDate: data.birthDate ? format(data.birthDate, "yyyy-MM-dd") : undefined,
                chip: data.chip === "" ? undefined : data.chip,
                coatColor: data.coatColor === "" ? undefined : data.coatColor,
            };  

            console.log(payload)
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/${pet.id}`, {
                method: "PATCH",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const resultData = await response.json();
            if (!response.ok) {
                throw new ApiError(resultData.message, resultData.code, resultData.details);
            }
            
            onUpdateSuccess({
                ...payload,
                breed: data.breed !== undefined ? data.breed : pet.breed
            });
            toast.success("Pet atualizado com sucesso!");
            setIsEditing(false);
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível atualizar dados do pet."
            });
        }
    };

    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };

    if (!isEditing) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex w-full justify-between items-end gap-4">
                    <div className="flex flex-col gap-y-4 w-full max-w-96">
                        <div className="">
                            <Label className="mb-1">Nome do pet</Label>
                            <Input
                                readOnly 
                                disabled
                                value={pet.name} 
                                className="cursor-default! opacity-100!"
                            />
                        </div>
                        <div className="">
                            <Label>Número do chip</Label>
                            <Input 
                                readOnly 
                                disabled 
                                value={(pet.chip && pet.chip !== "NO_CHIP") ? pet.chip : "Sem chip registrado"} 
                                className="cursor-default! opacity-100!"
                            />
                        </div>
                    </div>

                    <Image 
                        className="w-24 h-24 sm:w-36 sm:h-36 sm:mr-4 rounded-full object-cover border border-default-border"
                        src={pet_avatar_placeholder}
                        alt="Foto de perfil do pet"
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <div className="flex-1">
                        <Label>Espécie</Label>
                        <Input 
                            readOnly 
                            disabled 
                            value={translateTable(pet.species)} 
                            className="cursor-default! opacity-100!"
                        />
                    </div>
                    <div className="flex-1">
                        <Label>Raça</Label>
                        <Input 
                            readOnly 
                            disabled 
                            value={translateTable(pet.breed)} 
                            className="cursor-default! opacity-100!"
                        />
                    </div>
                </div>
                            
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <div className="flex-1">
                        <Label>Peso (kg)</Label>
                        <Input 
                            readOnly 
                            disabled 
                            value={pet.weight || "Não informado"} 
                            className="cursor-default! opacity-100!"
                        />
                    </div>
                    <div className="flex-1">
                        <Label>Porte</Label>
                        <Input 
                            readOnly
                            disabled 
                            value={translateTable(pet.size)} 
                            className="cursor-default! opacity-100!"
                        />
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <div className="flex-1">
                        <Label>Cor (pelagem)</Label>
                        <Input 
                            readOnly 
                            disabled 
                            value={pet.coatColor || "Não informado"} 
                            className="cursor-default! opacity-100!"
                        />
                    </div>
                    <div className="flex-1">
                        <Label>Data de nascimento</Label>
                        <Input 
                            readOnly 
                            disabled 
                            value={pet.birthDate.split('T')[0].split('-').reverse().join('/')}
                            className="cursor-default! opacity-100!"
                        />
                    </div>
                </div>

                {/* NOVOS CAMPOS AQUI */}
                <div className="flex flex-col sm:flex-row gap-4 w-full">
                    <div className="flex-1">
                        <Label>Castrado?</Label>
                        <Input 
                            readOnly 
                            disabled 
                            value={pet.isNeutered ? "Sim" : "Não"} 
                            className="cursor-default! opacity-100!"
                        />
                    </div>
                    <div className="flex-1">
                        <Label>Permite emergências?</Label>
                        <Input 
                            readOnly 
                            disabled 
                            value={pet.allowEmergency ? "Sim" : "Não"} 
                            className="cursor-default! opacity-100!"
                        />
                    </div>
                </div>

                <div className="flex justify-end mt-2">
                    <Button 
                        variant="primary" 
                        onClick={() => setUpdateWarningDialogOpen(true)}
                    >
                        Atualizar
                    </Button>
                </div>

                <Dialog
                    isOpen={updateWarningDialogOpen} 
                    onClose={() => setUpdateWarningDialogOpen(false)} 
                    title="Confirmar"
                    size="lg"
                >
                    <p className="text-xs sm:text-sm text-default-fg py-4">
                        Tem certeza que deseja continuar? Apenas modifique detalhes do pet de alguém se for estritamente necessário ou por pedido do tutor.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setUpdateWarningDialogOpen(false)}
                        >
                            Não, voltar
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={() => {
                                setUpdateWarningDialogOpen(false);
                                setIsEditing(true);
                            }}
                        >
                            Sim, tenho certeza
                        </Button>
                    </div>
                </Dialog>
            </div>
        );
    }

    return (
        <form 
    onSubmit={handleSubmit(handleUpdatePet, (errors) => console.log("Erros de Validação:", errors))} 
    className="flex flex-col gap-4"
>
            <div className="flex w-full justify-between items-end gap-4">
                <div className="flex flex-col gap-y-4 w-full max-w-96">
                    <div className="">
                        <Label 
                            htmlFor="name"
                            className="mb-1"
                        >
                            Nome do pet
                        </Label>
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
                    <div className="">
                        <Label htmlFor="chip">
                            Número do chip
                        </Label>
                        <Controller
                            name="chip"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id="chip"
                                    placeholder="Sem chip registrado..."
                                    {...field}
                                    variant={errors.chip ? "danger" : "default"}
                                />
                            )}
                        />
                        {errors.chip && <span className="text-danger-fg text-sm">{errors.chip.message}</span>}
                    </div>
                </div>

                <Image 
                    className="w-24 h-24 sm:w-36 sm:h-36 sm:mr-4 rounded-full object-cover border border-default-border"
                    src={pet_avatar_placeholder}
                    alt="Foto de perfil do pet"
                />
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full">
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
                                onChange={onChange}
                                onBlur={onBlur}
                                options={petSpeciesOptions}
                                variant={errors.species ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.species && <span className="text-danger-fg text-sm">{errors.species.message}</span>}
                </div>

                <div className="flex-1">
                    <Label htmlFor="breed">Raça</Label>
                    <Controller
                        name="breed"
                        control={control}
                        render={({ field: { value, onChange, name, onBlur } }) => (
                            <Select
                                id="breed"
                                name={name}
                                placeholder={selectedSpecies ? "Selecione a raça..." : "Espécie primeiro"}
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
            </div>
                    
            <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex-1">
                    <Label htmlFor="weight">Peso (kg)</Label>
                    <Controller
                        name="weight"
                        control={control}
                        render={({ field: { value, onChange, ...restField } }) => (
                            <Input
                                id="weight"
                                type="number"
                                step="0.1"
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
                <div className="flex-1">
                    <Label htmlFor="size">Porte</Label>
                    <Controller
                        name="size"
                        control={control}
                        render={({ field: { value, onChange, name, onBlur } }) => (
                            <Select
                                id="size"
                                name={name}
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

            <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex-1">
                    <Label htmlFor="coatColor">Cor (pelagem)</Label>
                    <Controller
                        name="coatColor"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="coatColor"
                                {...field}
                                variant={errors.coatColor ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.coatColor && <span className="text-danger-fg text-sm">{errors.coatColor.message}</span>}
                </div>
                <div className="flex-1">
                    <Label htmlFor="birthDate">Data de nascimento</Label>
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
            </div>

            {/* NOVOS CAMPOS AQUI */}
            <div className="flex flex-col sm:flex-row gap-4 w-full">
                <div className="flex-1">
                    <Label>Castrado?</Label>
                    {/* Campo puramente visual (não controlável por aqui) */}
                    <Input 
                        readOnly 
                        disabled 
                        value={pet.isNeutered ? "Sim" : "Não"} 
                        className="cursor-default! opacity-100!"
                    />
                    <span className="text-xs text-default-fg opacity-70 mt-1 block">
                        Status de castração não modificável por aqui.
                    </span>
                </div>
                <div className="flex-1">
                    <Label htmlFor="allowEmergency">Permite Emergências?</Label>
                    <Controller
                        name="allowEmergency"
                        control={control}
                        render={({ field: { value, onChange, name, onBlur } }) => (
                            <Select
                                id="allowEmergency"
                                name={name}
                                value={value !== undefined ? String(value) : ""}
                                onChange={(val) => {
                                    if (val === "true") onChange(true);
                                    else if (val === "false") onChange(false);
                                    else onChange(undefined);
                                }}
                                onBlur={onBlur}
                                options={[
                                    { label: "Sim", value: "true" },
                                    { label: "Não", value: "false" }
                                ]}
                                variant={errors.allowEmergency ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.allowEmergency && <span className="text-danger-fg text-sm">{errors.allowEmergency.message}</span>}
                </div>
            </div>

            <div className="flex justify-end gap-4 mt-2">
                <Button
                    type="button"
                    variant="outline"
                    disabled={isSubmitting}
                    onClick={handleCancel}
                >
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 
                        <span className="flex gap-2 items-center">
                            <SpinnerIcon/> Salvando...
                        </span>
                        : 
                        "Salvar alterações"
                    }
                </Button>
            </div>
        </form>
    );
};