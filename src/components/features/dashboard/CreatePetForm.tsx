"use client";

import React from "react";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns"

import { Select } from "../../ui/Select";
import { DatePicker } from "../../ui/DatePicker";
import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { Label } from "@/src/components/ui/Label";

import { toast } from "@/src/lib/toast-store";

/* birthDate is now a Date object because of our custom DatePicker, that means it will convert the date to our timezone,
in this case, we will need to strip the timezone before sending it to the backend. 

the same way we need to strip the timezone UTC-0 from the backend string we get before displaying to the user here (if we
want to include pet's birthday on its data showing) 

when sending to backend -> gets date with utc -3 for example, strips utc -3, backends saves as date utc-0
when getting from backend -> gets date with utc 0, strips utc 0, frontend MUST show as date utc -3 without actually 
converting */

const checkDogBreed = (breed: string) => {
    return ![ "ABYSSINIAN", "ANGORA", "BENGAL", "BIRMAN", "CHARTREUX", "RUSSIAN_BLUE", "HIMALAYAN", "MAINE_COON", "MUNCHKIN", "SPHYNX", "SIAMESE", "RAGDOLL", "SCOTTISH_FOLD", "AMERICAN_BURMESE", "PERSIAN", "EXOTIC_SHORTHAIR"
    ].includes(breed);
}

const checkCatBreed = (breed: string) => {
    return [ "MIXED_BREED", "ABYSSINIAN", "ANGORA", "BENGAL", "BIRMAN", "CHARTREUX", "RUSSIAN_BLUE", "HIMALAYAN", "MAINE_COON", "MUNCHKIN", "SPHYNX", "SIAMESE", "RAGDOLL", "SCOTTISH_FOLD", "AMERICAN_BURMESE", "PERSIAN", "EXOTIC_SHORTHAIR"
    ].includes(breed);
}

const createPetSchema = z.object({
    name: z.string()
        .min(1, "O nome do pet é obrigatório.")
        .max(60, "O nome deve ter no máximo 60 caracteres."),
    species: z.enum(["DOG", "CAT"]),
    gender: z.enum(["MALE", "FEMALE"]),
    breed: z.enum(["AKITA","AMERICAN_STAFFORDSHIRE_TERRIER","AMERICAN_BULLY","BASSET_HOUND","BEAGLE","AUSTRALIAN_CATTLE_DOG","BERNESE_MOUNTAIN_DOG","BORDER_COLLIE","BORDER_TERRIER","BOSTON_TERRIER","BOXER","FRENCH_BULLDOG","ENGLISH_BULLDOG","BULL_TERRIER","CANE_CORSO","CAVALIER_KING_CHARLES_SPANIEL","CHIHUAHUA","CHOW_CHOW","AMERICAN_COCKER_SPANIEL","ENGLISH_COCKER_SPANIEL","COLLIE","DACHSHUND","DALMATIAN","DOBERMAN","DOGO_ARGENTINO","GREAT_DANE","FILA_BRASILEIRO","FOX_TERRIER","GOLDEN_RETRIEVER","SIBERIAN_HUSKY","JACK_RUSSELL_TERRIER","LABRADOODLE","LABRADOR_RETRIEVER","LHASA_APSO","POMERANIAN","MALTESE","GERMAN_SHEPHERD","AUSTRALIAN_SHEPHERD","MINIATURE_PINSCHER","PIT_BULL","POODLE","PUG","ROTTWEILER","SHIH_TZU","STAFFORDSHIRE_BULL_TERRIER","NEWFOUNDLAND","SCOTTISH_TERRIER","WEIMARANER","WELSH_CORGI","YORKSHIRE_TERRIER","ABYSSINIAN","ANGORA","BENGAL","BIRMAN","CHARTREUX","RUSSIAN_BLUE","HIMALAYAN","MAINE_COON","MUNCHKIN","SPHYNX","SIAMESE","RAGDOLL","SCOTTISH_FOLD","AMERICAN_BURMESE","PERSIAN","EXOTIC_SHORTHAIR","MIXED_BREED"]),
    weight: z.number("O peso é obrigatório.").positive("O peso deve ser maior que zero."),
    coatColor: z.string()
        .min(1, "A cor da pelagem é obrigatória.")
        .max(28, "A cor da pelagem de ter no máximo 28 caracteres."),
    birthDate: z.date("A data de nascimento é obrigatória."), 
}).refine((data) => {
    if (data.species === "DOG") {
        return checkDogBreed(data.breed);
    }
    if (data.species === "CAT") {
        return checkCatBreed(data.breed);
    }
    return true;
}, {
  message: "A raça selecionada não combina com a espécie.",
  path: ["breed"],
});

type CreatePetFormData = z.infer<typeof createPetSchema>;

interface CreatePetFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}

const speciesOptions = [
    { value: "DOG", label: "Cachorro" },
    { value: "CAT", label: "Gato" },
];

const genderOptions = [
    { value: "MALE", label: "Macho" },
    { value: "FEMALE", label: "Fêmea" },
];

const breedOptions = [
  { value: "AKITA", label: "Akita" },
  { value: "AMERICAN_STAFFORDSHIRE_TERRIER", label: "American Staffordshire Terrier" },
  { value: "AMERICAN_BULLY", label: "American Bully" },
  { value: "BASSET_HOUND", label: "Basset Hound" },
  { value: "BEAGLE", label: "Beagle" },
  { value: "AUSTRALIAN_CATTLE_DOG", label: "Boiadeiro Australiano" },
  { value: "BERNESE_MOUNTAIN_DOG", label: "Boiadeiro Bernês" },
  { value: "BORDER_COLLIE", label: "Border Collie" },
  { value: "BORDER_TERRIER", label: "Border Terrier" },
  { value: "BOSTON_TERRIER", label: "Boston Terrier" },
  { value: "BOXER", label: "Boxer" },
  { value: "FRENCH_BULLDOG", label: "Buldogue Francês" },
  { value: "ENGLISH_BULLDOG", label: "Buldogue Inglês" },
  { value: "BULL_TERRIER", label: "Bull Terrier" },
  { value: "CANE_CORSO", label: "Cane Corso" },
  { value: "CAVALIER_KING_CHARLES_SPANIEL", label: "Cavalier King Charles Spaniel" },
  { value: "CHIHUAHUA", label: "Chihuahua" },
  { value: "CHOW_CHOW", label: "Chow Chow" },
  { value: "AMERICAN_COCKER_SPANIEL", label: "Cocker Spaniel Americano" },
  { value: "ENGLISH_COCKER_SPANIEL", label: "Cocker Spaniel Inglês" },
  { value: "COLLIE", label: "Collie" },
  { value: "DACHSHUND", label: "Dachshund" },
  { value: "DALMATIAN", label: "Dálmata" },
  { value: "DOBERMAN", label: "Dobermann" },
  { value: "DOGO_ARGENTINO", label: "Dogo Argentino" },
  { value: "GREAT_DANE", label: "Dogue Alemão" },
  { value: "FILA_BRASILEIRO", label: "Fila Brasileiro" },
  { value: "FOX_TERRIER", label: "Fox Terrier" },
  { value: "GOLDEN_RETRIEVER", label: "Golden Retriever" },
  { value: "SIBERIAN_HUSKY", label: "Husky Siberiano" },
  { value: "JACK_RUSSELL_TERRIER", label: "Jack Russell Terrier" },
  { value: "LABRADOODLE", label: "Labradoodle" },
  { value: "LABRADOR_RETRIEVER", label: "Labrador Retriever" },
  { value: "LHASA_APSO", label: "Lhasa Apso" },
  { value: "POMERANIAN", label: "Lulu da Pomerânia" },
  { value: "MALTESE", label: "Maltês" },
  { value: "GERMAN_SHEPHERD", label: "Pastor Alemão" },
  { value: "AUSTRALIAN_SHEPHERD", label: "Pastor Australiano" },
  { value: "MINIATURE_PINSCHER", label: "Pinscher" },
  { value: "PIT_BULL", label: "Pitbull" },
  { value: "POODLE", label: "Poodle" },
  { value: "PUG", label: "Pug" },
  { value: "ROTTWEILER", label: "Rottweiler" },
  { value: "SHIH_TZU", label: "Shih Tzu" },
  { value: "STAFFORDSHIRE_BULL_TERRIER", label: "Staffordshire Bull Terrier" },
  { value: "NEWFOUNDLAND", label: "Terra Nova" },
  { value: "SCOTTISH_TERRIER", label: "Terrier Escocês" },
  { value: "WEIMARANER", label: "Weimaraner" },
  { value: "WELSH_CORGI", label: "Welsh Corgi" },
  { value: "YORKSHIRE_TERRIER", label: "Yorkshire Terrier" },

  { value: "ABYSSINIAN", label: "Abissínio" },
  { value: "ANGORA", label: "Angorá" },
  { value: "BENGAL", label: "Bengal" },
  { value: "BIRMAN", label: "Birmanês" },
  { value: "CHARTREUX", label: "Chartreux" },
  { value: "RUSSIAN_BLUE", label: "Azul Russo" },
  { value: "HIMALAYAN", label: "Himalaio" },
  { value: "MAINE_COON", label: "Maine Coon" },
  { value: "MUNCHKIN", label: "Munchkin" },
  { value: "SPHYNX", label: "Sphynx" },
  { value: "SIAMESE", label: "Siamês" },
  { value: "RAGDOLL", label: "Ragdoll" },
  { value: "SCOTTISH_FOLD", label: "Scottish Fold" },
  { value: "AMERICAN_BURMESE", label: "Burmês Americano" },
  { value: "PERSIAN", label: "Persa" },
  { value: "EXOTIC_SHORTHAIR", label: "Exótico de Pelo Curto" },
  
  { value: "MIXED_BREED", label: "Sem raça definida" },
];


export const CreatePetForm = ({ onSuccess, onCancel }: CreatePetFormProps) => {
    const { control, watch, setValue, formState, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreatePetFormData>({
        resolver: zodResolver(createPetSchema),
        defaultValues: {
            name: "",
            species: undefined,
            gender: undefined,
            breed: undefined,
            weight: 0,
            coatColor: "",
            birthDate: undefined, 
        },
    });

    const selectedSpecies = watch("species");

    const filteredBreedOptions = React.useMemo(() => {
        if (!selectedSpecies) {
            return [];
        }

        return breedOptions.filter((option) => {
            if (selectedSpecies === "DOG") return checkDogBreed(option.value);
            if (selectedSpecies === "CAT") return checkCatBreed(option.value);
            return false;
        });
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
                toast.danger(err.message);
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
                                    options={speciesOptions}
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
                                options={genderOptions}
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

            <div>
                <Label htmlFor="coatColor">Cor da pelagem</Label>
                <Controller
                    name="coatColor"
                    control={control}
                    render={({ field }) => (
                    <Input
                        id="coatColor"
                        placeholder="Ex: Preto, Caramelo..."
                        {...field}
                        variant={errors.coatColor ? "danger" : "default"}
                    />
                    )}
                />
                {errors.coatColor && <span className="text-danger-fg text-sm">{errors.coatColor.message}</span>}
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
                <Button type="button" variant="outline-default" onClick={onCancel}>
                    Cancelar
                </Button>
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? "Salvando..." : "Salvar Pet"}
                </Button>
            </div>
        </form>
    );
};