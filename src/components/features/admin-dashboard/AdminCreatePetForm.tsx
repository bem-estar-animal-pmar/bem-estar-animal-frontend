"use client";

import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { translateError } from "@/src/lib/translation-map";

import { AdminCreatePetFormData, adminCreatePetSchema } from "@/src/constants/schemas";
import { catBreedOptions, dogBreedOptions, petSpeciesOptions, petGenderOptions, petSizeOptions, homeStatusOptions } from "@/src/constants/constants";
import { ApiError } from "@/src/lib/api-error";
import { Select, DatePicker, Input, Button, Label } from "@/src/components/ui";
import { toast } from "@/src/lib/toast-store";

interface AdminCreatePetFormProps {
    defaultValues?: Partial<AdminCreatePetFormData>;
    onSuccess: (createdPetId: string) => void;
    onCancel: () => void;
}

export const AdminCreatePetForm = ({ defaultValues, onSuccess, onCancel }: AdminCreatePetFormProps) => {
    const { control, watch, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm<AdminCreatePetFormData>({
        resolver: zodResolver(adminCreatePetSchema),
        defaultValues: {
            name: defaultValues?.name,
            species: defaultValues?.species,
            gender: defaultValues?.gender,
            breed: "MIXED_BREED",
            weight: 0,
            size: defaultValues?.size,
            coatColor: "",
            birthDate: undefined, 
            ownerId: defaultValues?.ownerId,
            chip: "",
            homeStatus: defaultValues?.homeStatus,
            isNeutered: defaultValues?.isNeutered,
            allowEmergency: defaultValues?.allowEmergency,
        },
    });

    const selectedSpecies = watch("species");

    const filteredBreedOptions = React.useMemo(() => {
        if (!selectedSpecies) return [];
        if (selectedSpecies === "DOG") return dogBreedOptions;
        if (selectedSpecies === "CAT") return catBreedOptions;
        return [];
    }, [selectedSpecies]);

    const handleCreatePet = async (data: AdminCreatePetFormData) => {
        try {
            const payload = { 
                ...data,
                birthDate: data.birthDate ? format(data.birthDate, "yyyy-MM-dd") : undefined,
                chip: data.chip === "" ? undefined : data.chip,
            };  

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/admin/create-after-emergency`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new ApiError(responseData.message, responseData.code, responseData.details);
            }

            toast.success("Pet cadastrado e vinculado com sucesso!");
            
            const newPetId = responseData.id || responseData.data?.id;
            onSuccess(newPetId);
            
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível registrar pet."
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(handleCreatePet)} className="flex flex-col gap-4">

            <div className="flex gap-2 w-full">
                <div className="flex flex-col w-full">
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

                <div className="flex flex-col w-full">
                    <Label htmlFor="chip">Número do Chip (Opcional)</Label>
                    <Controller
                        name="chip"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="chip"
                                placeholder="Insira o chip..."
                                {...field}
                                variant={errors.chip ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.chip && <span className="text-danger-fg text-sm">{errors.chip.message}</span>}
                </div>
            </div>


            <div className="flex gap-2 w-full">
                <div className="flex flex-col w-full">
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

                <div className="flex flex-col w-full">
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

            <div className="flex gap-2 w-full">
                <div className="flex flex-col w-full">
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

                <div className="flex flex-col w-full">
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

            <div className="flex gap-2">
                <div className="flex flex-col w-full">
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

                <div className="flex flex-col w-full">
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

            <div className="flex flex-col">
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

            <div className="flex flex-col">
                <Label htmlFor="homeStatus">Status de moradia</Label>
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
                            options={homeStatusOptions}
                            variant={errors.homeStatus ? "danger" : "default"}
                        />
                    )}
                />
                {errors.homeStatus && <span className="text-danger-fg text-sm">{errors.homeStatus.message}</span>}
            </div>
            
            <p className="text-xs text-default-fg italic">
                * Caso o solicitante do atendimento tenha interesse em adotar o animal após o tratamento, defina o status de moradia como "Possui tutor". Um pedido de adoção será criado e confirmado automaticamente e você poderá imprimir o formulário diretamente por lá.
            </p>

            <div className="flex flex-col gap-2 mt-2">
                <div className="flex items-center gap-2">
                    <Controller
                        name="allowEmergency"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <input 
                                type="checkbox" 
                                id="allowEmergency"
                                checked={value}
                                onChange={(e) => onChange(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                        )}
                    />
                    <Label htmlFor="allowEmergency" className="mb-0 cursor-pointer">
                        Habilitar este pet para futuras emergências
                    </Label>
                </div>
                
                <div className="flex items-center gap-2">
                    <Controller
                        name="isNeutered"
                        control={control}
                        render={({ field: { value, onChange } }) => (
                            <input 
                                type="checkbox" 
                                id="isNeutered"
                                checked={value}
                                onChange={(e) => onChange(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                        )}
                    />
                    <Label htmlFor="isNeutered" className="mb-0 cursor-pointer">
                        Animal já castrado
                    </Label>
                </div>
            </div>

            

            <div className="flex justify-end gap-3 pt-4 border-t border-default-border mt-2">
                <Button type="button" variant="outline-default" onClick={onCancel} disabled={isSubmitting}>
                    Cancelar
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? "Salvando..." : "Criar Pet e Concluir"}
                </Button>
            </div>
        </form>
    );
};