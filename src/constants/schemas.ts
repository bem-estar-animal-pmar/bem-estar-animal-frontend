import * as z from "zod";

/* pets */
export const checkDogBreed = (breed: string) => {
    return ![ "ABYSSINIAN", "ANGORA", "BENGAL", "BIRMAN", "CHARTREUX", "RUSSIAN_BLUE", "HIMALAYAN", "MAINE_COON", "MUNCHKIN", "SPHYNX", "SIAMESE", "RAGDOLL", "SCOTTISH_FOLD", "AMERICAN_BURMESE", "PERSIAN", "EXOTIC_SHORTHAIR"
    ].includes(breed);
}

export const checkCatBreed = (breed: string) => {
    return [ "MIXED_BREED", "ABYSSINIAN", "ANGORA", "BENGAL", "BIRMAN", "CHARTREUX", "RUSSIAN_BLUE", "HIMALAYAN", "MAINE_COON", "MUNCHKIN", "SPHYNX", "SIAMESE", "RAGDOLL", "SCOTTISH_FOLD", "AMERICAN_BURMESE", "PERSIAN", "EXOTIC_SHORTHAIR"
    ].includes(breed);
}

export const createPetSchema = z.object({
    name: z.string()
        .min(1, "O nome do pet é obrigatório.")
        .max(60, "O nome deve ter no máximo 60 caracteres."),
    species: z.enum(["DOG", "CAT"]),
    gender: z.enum(["MALE", "FEMALE"]),
    breed: z.enum(["AKITA","AMERICAN_STAFFORDSHIRE_TERRIER","AMERICAN_BULLY","BASSET_HOUND","BEAGLE","AUSTRALIAN_CATTLE_DOG","BERNESE_MOUNTAIN_DOG","BORDER_COLLIE","BORDER_TERRIER","BOSTON_TERRIER","BOXER","FRENCH_BULLDOG","ENGLISH_BULLDOG","BULL_TERRIER","CANE_CORSO","CAVALIER_KING_CHARLES_SPANIEL","CHIHUAHUA","CHOW_CHOW","AMERICAN_COCKER_SPANIEL","ENGLISH_COCKER_SPANIEL","COLLIE","DACHSHUND","DALMATIAN","DOBERMAN","DOGO_ARGENTINO","GREAT_DANE","FILA_BRASILEIRO","FOX_TERRIER","GOLDEN_RETRIEVER","SIBERIAN_HUSKY","JACK_RUSSELL_TERRIER","LABRADOODLE","LABRADOR_RETRIEVER","LHASA_APSO","POMERANIAN","MALTESE","GERMAN_SHEPHERD","AUSTRALIAN_SHEPHERD","MINIATURE_PINSCHER","PIT_BULL","POODLE","PUG","ROTTWEILER","SHIH_TZU","STAFFORDSHIRE_BULL_TERRIER","NEWFOUNDLAND","SCOTTISH_TERRIER","WEIMARANER","WELSH_CORGI","YORKSHIRE_TERRIER","ABYSSINIAN","ANGORA","BENGAL","BIRMAN","CHARTREUX","RUSSIAN_BLUE","HIMALAYAN","MAINE_COON","MUNCHKIN","SPHYNX","SIAMESE","RAGDOLL","SCOTTISH_FOLD","AMERICAN_BURMESE","PERSIAN","EXOTIC_SHORTHAIR","MIXED_BREED"]),
    weight: z.number("O peso é obrigatório.").positive("O peso deve ser maior que zero."),
    size: z.enum(["SMALL", "MEDIUM", "LARGE"]),
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


export type CreatePetFormData = z.infer<typeof createPetSchema>;