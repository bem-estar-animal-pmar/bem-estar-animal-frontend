"use client";

import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { translateError } from "@/src/lib/error-map";
import { toast } from "@/src/lib/toast-store";

import { updatePetSchema } from "@/src/constants/schemas"; 
import { z } from "zod";

import type { Pet } from "@/src/constants/interfaces";
import { 
    catBreedOptions, 
    dogBreedOptions, 
    petSpeciesOptions, 
    petSizeOptions 
} from "@/src/constants/constants";

import { Select, DatePicker, Input, Button, Label } from "@/src/components/ui";
import { ApiError } from "@/src/lib/api-error";

type UpdatePetFormData = z.infer<typeof updatePetSchema>;

const adoptionStatusOptions = [
    { label: "Possui Dono", value: "HAS_OWNER" },
    { label: "Para Adoção", value: "FOR_ADOPTION" },
    { label: "Adotado", value: "ADOPTED" },
    { label: "Lar Temporário", value: "TEMPORARY_HOME" },
    { label: "Animal de Rua", value: "STRAY_ANIMAL" }
];

interface AdminUpdatePetFormProps {
    pet: Pet;
    onSuccess: () => void;
    onCancel: () => void;
}

export const AdminUpdatePetForm = ({ pet, onSuccess, onCancel }: AdminUpdatePetFormProps) => {
    
    const { control, watch, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm<UpdatePetFormData>({
        resolver: zodResolver(updatePetSchema) as any,
        defaultValues: {
            name: pet.name,
            species: pet.species as any,
            breed: pet.breed as any,
            weight: pet.weight,
            size: pet.size as any,
            coatColor: pet.coatColor,
            birthDate: pet.birthDate ? new Date(pet.birthDate) : undefined,
            chip: pet.chip !== "NO_CHIP" ? pet.chip : "",
            adoptionStatus: pet.adoptionStatus as any,
        },
    });

    const selectedSpecies = watch("species");

    const filteredBreedOptions = React.useMemo(() => {
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
                coatColor: data.coatColor === "" ? undefined : data.coatColor
            };  

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

            toast.success("Pet atualizado com sucesso!");
            onSuccess();
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                if (err.details) {
                    const firstError = err.details[0]?.message
                    toast.warning(translateError(err.message), { message: firstError })
                    return;
                }
                toast.warning(translateError(err.message));
                return;
            }
            toast.danger("Ocorreu um erro inesperado ao atualizar.");
        }
    };

    return (
        <form onSubmit={handleSubmit(handleUpdatePet)} className="flex flex-col gap-4 pt-4">
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


            <div className="flex gap-4 w-full">
                <div className="flex-1">
                    <Label htmlFor="chip" className="text-primary-fg flex items-center gap-2">
                        Número do Chip
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
                <div className="flex-1">
                    <Label htmlFor="adoptionStatus" className="text-primary-fg flex items-center gap-2">
                        Status do Pet
                    </Label>
                    <Controller
                        name="adoptionStatus"
                        control={control}
                        render={({ field: { value, onChange, name, onBlur } }) => (
                            <Select
                                id="adoptionStatus"
                                name={name}
                                value={value}
                                onChange={onChange}
                                onBlur={onBlur}
                                options={adoptionStatusOptions}
                                variant={errors.adoptionStatus ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.adoptionStatus && <span className="text-danger-fg text-sm">{errors.adoptionStatus.message}</span>}
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
                    
            <div className="flex gap-4 w-full">
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
                <div className="w-1/3">
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
                <div className="w-1/3">
                    <Label htmlFor="coatColor">Cor (Pelagem)</Label>
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
            </div>

            <div>
                <Label htmlFor="birthDate">Data de Nascimento</Label>
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

            <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline-default" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Salvando..." : "Salvar Alterações"}
                </Button>
            </div>
        </form>
    );
};