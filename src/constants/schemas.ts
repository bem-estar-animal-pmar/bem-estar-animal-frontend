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
    species: z.enum(["DOG", "CAT"], "Selecione uma espécie válida."),
    gender: z.enum(["MALE", "FEMALE"], "Selecione um gênero válido."),
    breed: z.enum(["AKITA","AMERICAN_STAFFORDSHIRE_TERRIER","AMERICAN_BULLY","BASSET_HOUND","BEAGLE","AUSTRALIAN_CATTLE_DOG","BERNESE_MOUNTAIN_DOG","BORDER_COLLIE","BORDER_TERRIER","BOSTON_TERRIER","BOXER","FRENCH_BULLDOG","ENGLISH_BULLDOG","BULL_TERRIER","CANE_CORSO","CAVALIER_KING_CHARLES_SPANIEL","CHIHUAHUA","CHOW_CHOW","AMERICAN_COCKER_SPANIEL","ENGLISH_COCKER_SPANIEL","COLLIE","DACHSHUND","DALMATIAN","DOBERMAN","DOGO_ARGENTINO","GREAT_DANE","FILA_BRASILEIRO","FOX_TERRIER","GOLDEN_RETRIEVER","SIBERIAN_HUSKY","JACK_RUSSELL_TERRIER","LABRADOODLE","LABRADOR_RETRIEVER","LHASA_APSO","POMERANIAN","MALTESE","GERMAN_SHEPHERD","AUSTRALIAN_SHEPHERD","MINIATURE_PINSCHER","PIT_BULL","POODLE","PUG","ROTTWEILER","SHIH_TZU","STAFFORDSHIRE_BULL_TERRIER","NEWFOUNDLAND","SCOTTISH_TERRIER","WEIMARANER","WELSH_CORGI","YORKSHIRE_TERRIER","ABYSSINIAN","ANGORA","BENGAL","BIRMAN","CHARTREUX","RUSSIAN_BLUE","HIMALAYAN","MAINE_COON","MUNCHKIN","SPHYNX","SIAMESE","RAGDOLL","SCOTTISH_FOLD","AMERICAN_BURMESE","PERSIAN","EXOTIC_SHORTHAIR","MIXED_BREED"]),
    weight: z.number("O peso é obrigatório.").positive("O peso deve ser maior que zero."),
    size: z.enum(["SMALL", "MEDIUM", "LARGE"]),
    coatColor: z.string()
        .min(1, "A cor da pelagem é obrigatória.")
        .max(28, "A cor da pelagem de ter no máximo 28 caracteres."),
    birthDate: z.date("A data de nascimento é obrigatória."), 
    homeStatus: z.enum([
        "HAS_OWNER",
        "TEMPORARY_HOME",
    ], "Selecione um status de moradia válido.")
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

export const adminCreatePetSchema = z.object({
    ownerId: z.string()
        .max(50, "Owner ID must be less than 50 characters").optional(), /* added for admin creation */
    chip: z.string()
        .max(50)
        .optional(),
    name: z.string()
        .min(1, "O nome do pet é obrigatório.")
        .max(60, "O nome deve ter no máximo 60 caracteres."),
    species: z.enum(["DOG", "CAT"]),
    gender: z.enum(["MALE", "FEMALE"]),
    breed: z.enum(["AKITA","AMERICAN_STAFFORDSHIRE_TERRIER","AMERICAN_BULLY","BASSET_HOUND","BEAGLE","AUSTRALIAN_CATTLE_DOG","BERNESE_MOUNTAIN_DOG","BORDER_COLLIE","BORDER_TERRIER","BOSTON_TERRIER","BOXER","FRENCH_BULLDOG","ENGLISH_BULLDOG","BULL_TERRIER","CANE_CORSO","CAVALIER_KING_CHARLES_SPANIEL","CHIHUAHUA","CHOW_CHOW","AMERICAN_COCKER_SPANIEL","ENGLISH_COCKER_SPANIEL","COLLIE","DACHSHUND","DALMATIAN","DOBERMAN","DOGO_ARGENTINO","GREAT_DANE","FILA_BRASILEIRO","FOX_TERRIER","GOLDEN_RETRIEVER","SIBERIAN_HUSKY","JACK_RUSSELL_TERRIER","LABRADOODLE","LABRADOR_RETRIEVER","LHASA_APSO","POMERANIAN","MALTESE","GERMAN_SHEPHERD","AUSTRALIAN_SHEPHERD","MINIATURE_PINSCHER","PIT_BULL","POODLE","PUG","ROTTWEILER","SHIH_TZU","STAFFORDSHIRE_BULL_TERRIER","NEWFOUNDLAND","SCOTTISH_TERRIER","WEIMARANER","WELSH_CORGI","YORKSHIRE_TERRIER","ABYSSINIAN","ANGORA","BENGAL","BIRMAN","CHARTREUX","RUSSIAN_BLUE","HIMALAYAN","MAINE_COON","MUNCHKIN","SPHYNX","SIAMESE","RAGDOLL","SCOTTISH_FOLD","AMERICAN_BURMESE","PERSIAN","EXOTIC_SHORTHAIR","MIXED_BREED"]),
    weight: z.number("O peso é obrigatório.").positive("O peso deve ser maior que zero."),
    size: z.enum(["SMALL", "MEDIUM", "LARGE"]),
    homeStatus: z.enum([ /* added for admin creation */
        "HAS_OWNER",
        "TEMPORARY_HOME",
        "STRAY_ANIMAL"
    ]).optional(),
    adoptionStatus: z.enum([ 
        "FOR_ADOPTION",
        "ADOPTED",
    ]).optional(),
    isNeutered: z.boolean()
        .optional(),
    allowEmergency: z.boolean()
        .optional(),
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

export const updatePetSchema = z.object({
    name: z.string()
        .min(1, "O nome não pode estar vazio")
        .max(28, "O nome deve ter menos de 28 caracteres")
        .optional(),
    species: z.enum(["DOG", "CAT"])
        .optional(),
    breed: z.enum(["AKITA","AMERICAN_STAFFORDSHIRE_TERRIER","AMERICAN_BULLY","BASSET_HOUND","BEAGLE","AUSTRALIAN_CATTLE_DOG","BERNESE_MOUNTAIN_DOG","BORDER_COLLIE","BORDER_TERRIER","BOSTON_TERRIER","BOXER","FRENCH_BULLDOG","ENGLISH_BULLDOG","BULL_TERRIER","CANE_CORSO","CAVALIER_KING_CHARLES_SPANIEL","CHIHUAHUA","CHOW_CHOW","AMERICAN_COCKER_SPANIEL","ENGLISH_COCKER_SPANIEL","COLLIE","DACHSHUND","DALMATIAN","DOBERMAN","DOGO_ARGENTINO","GREAT_DANE","FILA_BRASILEIRO","FOX_TERRIER","GOLDEN_RETRIEVER","SIBERIAN_HUSKY","JACK_RUSSELL_TERRIER","LABRADOODLE","LABRADOR_RETRIEVER","LHASA_APSO","POMERANIAN","MALTESE","GERMAN_SHEPHERD","AUSTRALIAN_SHEPHERD","MINIATURE_PINSCHER","PIT_BULL","POODLE","PUG","ROTTWEILER","SHIH_TZU","STAFFORDSHIRE_BULL_TERRIER","NEWFOUNDLAND","SCOTTISH_TERRIER","WEIMARANER","WELSH_CORGI","YORKSHIRE_TERRIER","ABYSSINIAN","ANGORA","BENGAL","BIRMAN","CHARTREUX","RUSSIAN_BLUE","HIMALAYAN","MAINE_COON","MUNCHKIN","SPHYNX","SIAMESE","RAGDOLL","SCOTTISH_FOLD","AMERICAN_BURMESE","PERSIAN","EXOTIC_SHORTHAIR","MIXED_BREED"])
        .optional(),
    weight: z.number()
        .positive()
        .optional(),
    size: z.enum(["SMALL", "MEDIUM", "LARGE"])
        .optional(),
    coatColor: z.string()
        .max(28, "A cor da pelagem deve ter menos de 28 caracteres")
        .optional(),
    allowEmergency: z.boolean()
        .optional(),
    birthDate: z.coerce.date()
        .optional(),
    chip: z.string()
        .max(50, "O chip deve ter menos de 50 caracteres")
        .optional(),
    adoptionStatus: z.enum([
        "FOR_ADOPTION",
        "ADOPTED",
        "NONE"
    ]).optional()
}).refine((data) => {
    if (data.species === "DOG" && data.breed) {
        return checkDogBreed(data.breed);
    }
    if (data.species === "CAT" && data.breed) {
        return checkCatBreed(data.breed);
    }
    return true;
}, {
  message: "A raça selecionada não corresponde à espécie",
  path: ["breed"],
});

export type CreatePetFormData = z.infer<typeof createPetSchema>;
export type AdminCreatePetFormData = z.infer<typeof adminCreatePetSchema>;
export type UpdatePetFormData = z.infer<typeof updatePetSchema>;


/* give up */

export const giveUpFormSchema = z.object({
    petId: z.string().min(1, "Selecione um pet"),
    reason: z.string()
        .min(10, "Por favor, forneça um motivo mais detalhado")
        .max(500, "O texto do motivo é muito longo")
        .optional(),
    temporaryHomeAccepted: z.boolean().refine(val => val === true, {
        message: "Você precisa confirmar que está disposto à ser lar temporário do animal até que a adoção aconteça"
    }),
    termsAccepted: z.boolean().refine(val => val === true, {
        message: "Você precisa concordar com os termos e condições de adoção"
    }),
});

export type GiveUpFormData = z.infer<typeof giveUpFormSchema>;

/* user */


export const updateUserSchema = z.object({
    name: z.string().trim()
        .min(1, "O nome não pode ficar em branco")
        .max(20, "O nome deve ter menos de 20 caracteres")
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "O nonme deve conter apenas letras")
        .optional(),
    lastName: z.string()
        .trim()
        .min(1, "O sobrenome não pode ficar em branco")
        .max(40, "O sobrenome deve ter menos de 40 caracteres")
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "O sobrenome deve conter apenas letras")
        .optional(),
    phone: z.string().trim()
        .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Formato de telefone inválido")
        .transform((value) => value.replace(/\D/g, ""))
        .optional(),
    cpf: z.string()
        .regex(/^\d{11}$/, "CPF Inválido")
        .trim()
        .optional(),
    cep: z.string()
        .regex(/^\d{5}-?\d{3}$/, "CEP Inválido")
        .transform((value) => value.replace(/\D/g, ""))
        .optional(),
    street: z.string().trim()
        .min(1, "A rua não pode ficar em branco")
        .max(200, "A rua deve ter menos de 200 caracteres")
        .optional(),
    neighborhood: z.string().min(1, "O bairro não pode ficar em branco")
        .max(100, "O bairro deve ter menos de 200 caracteres")
        .optional(),
    city: z.string().trim()
        .min(1, "A cidade não pode ficar em branco")
        .max(100, "A cidade deve ter menos de 200 caracteres")
        .optional(),
    state: z.string().trim()
        .length(2, "Digite apenas o UF")
        .optional(),
    number: z.string().trim()
        .min(1, "O número não pode ficar em branco")
        .max(8, "O número deve ter menos de 8 caracteres")
        .optional(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;