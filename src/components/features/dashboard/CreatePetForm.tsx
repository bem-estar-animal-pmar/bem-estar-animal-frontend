"use client";

import React from "react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns"
import { translateError } from "@/src/lib/error-map";

import { CreatePetFormData, createPetSchema } from "@/src/constants/schemas";
import { catBreedOptions, dogBreedOptions, petSpeciesOptions, petGenderOptions, petSizeOptions } from "@/src/constants/constants";

import { Select } from "../../ui/Select";
import { DatePicker } from "../../ui/DatePicker";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { Label } from "@/src/components/ui/Label";
import { toast } from "@/src/lib/toast-store";
import { SpinnerIcon } from "../../icons/SpinnerIcon";
import { PetCreateIcon } from "../../icons/outline";

/* birthDate is now a Date object because of our custom DatePicker, that means it will convert the date to our timezone,
in this case, we will need to strip the timezone before sending it to the backend. 

the same way we need to strip the timezone UTC-0 from the backend string we get before displaying to the user here (if we
want to include pet's birthday on its data showing) 

when sending to backend -> gets date with utc -3 for example, strips utc -3, backends saves as date utc-0
when getting from backend -> gets date with utc 0, strips utc 0, frontend MUST show as date utc -3 without actually 
converting */

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
            birthDate: undefined, 
        },
    });

    const selectedSpecies = watch("species");

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
            
            const payload = { 
                ...data,
                /* since our datepicker returns a date object now, we must strip the timezone out of it before sending 
                to the backend to correctly set the date */
                birthDate: data.birthDate ? format(data.birthDate, "yyyy-MM-dd") : undefined,
            };  

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || "Erro ao criar pet");
            }

            toast.success("Pet cadastrado com sucesso!");
            onSuccess();
        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.danger(translateError(err.message));
                return;
            }
            toast.danger("Ocorreu um erro inesperado.");
        }
    };

return (
        <form onSubmit={handleSubmit(handleCreatePet)} className="flex flex-col gap-4 pt-4">
            
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