/* user */

export const userRoleOptions = [
    { label: "Usuário", value: "USER" }, 
    { label: "Admin", value: "ADMIN" },
    { label: "Gerente", value: "MANAGER" }
];

/* pets */

export const petSpeciesOptions = [
    { value: "DOG", label: "Cachorro" },
    { value: "CAT", label: "Gato" },
];

export const petGenderOptions = [
    { value: "MALE", label: "Macho" },
    { value: "FEMALE", label: "Fêmea" },
];

export const petSizeOptions = [
    { value: "SMALL", label: "Pequeno" },
    { value: "MEDIUM", label: "Médio" },
    { value: "LARGE", label: "Grande" },
];

export const homeStatusOptions = [
    { label: "Possui Tutor", value: "HAS_OWNER" },
    { label: "Lar Temporário", value: "TEMPORARY_HOME" },
    { label: "Animal de Rua", value: "STRAY_ANIMAL" }
];

export const userHomeStatusOptions = [
    { label: "Possui Tutor", value: "HAS_OWNER" },
    { label: "Lar Temporário", value: "TEMPORARY_HOME" }
];

export const adoptionStatusOptions = [
    { label: "Nenhum", value: "NONE" },
    { label: "Para Adoção", value: "FOR_ADOPTION" },
    { label: "Adotado", value: "ADOPTED" },
];

export const catBreedOptions = [
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

export const dogBreedOptions = [
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
    { value: "MIXED_BREED", label: "Sem raça definida" },
];

/* neuterings */

export const neuteringStatusMap: Record<string, { label: string; classes: string }> = {
    PENDING: { label: "Em Análise", classes: "bg-yellow-100! text-yellow-800! border-yellow-200!" },
    AWAITING_EXAMS: { label: "Aguard. exames", classes: "bg-blue-100! text-blue-800! border-blue-200!" },
    CONFIRMED: { label: "Confirmado", classes: "bg-green-100! text-green-800! border-green-200!" },
    COMPLETED: { label: "Concluído", classes: "bg-emerald-100! text-emerald-800! border-emerald-200!" },
    CANCELLED: { label: "Cancelado", classes: "bg-gray-100! text-gray-800! border-gray-200!" },
    NO_SHOW: { label: "Ausente", classes: "bg-red-100! text-red-800! border-red-200!" },
};

export const BRACHYCEPHALIC_BREEDS = [
    "PUG",
    "BOSTON_TERRIER",
    "FRENCH_BULLDOG",
    "ENGLISH_BULLDOG",
    "BOXER",
    "SHIH_TZU",
    "LHASA_APSO",
    "CHIHUAHUA",
    "AMERICAN_BULLY",
    "CAVALIER_KING_CHARLES_SPANIEL",
    "MALTESE",
    "STAFFORDSHIRE_BULL_TERRIER",
    /* not on enum */
    "PEKINGESE",  
    "DOGUE_DE_BORDEAUX",
    "SHAR_PEI",

    "AMERICAN_BURMESE",
    "HIMALAYAN",
    "PERSIAN",
    "EXOTIC_SHORTHAIR"
];

/* emergencies */

export const emergencyStatusMap: Record<string, { label: string; classes: string }> = {
    PENDING: { label: "Em Análise", classes: "bg-yellow-100! text-yellow-800! border-yellow-200!" },
    CONFIRMED: { label: "Confirmado", classes: "bg-green-100! text-green-800! border-green-200!" },
    COMPLETED: { label: "Concluído", classes: "bg-emerald-100! text-emerald-800! border-emerald-200!" },
    CANCELLED: { label: "Cancelado", classes: "bg-gray-100! text-gray-800! border-gray-200!" },
    NO_SHOW: { label: "Ausente", classes: "bg-red-100! text-red-800! border-red-200!" },
};

/* give up requests */

export const giveUpStatusMap: Record<string, { label: string, classes: string }> = {
    PENDING: { label: "Em Análise", classes: "bg-yellow-100! text-yellow-800! border-yellow-200!" },
    APPROVED: { label: "Aprovado", classes: "bg-green-100! text-green-800! border-green-200!" },
    REJECTED: { label: "Rejeitado", classes: "bg-red-100! text-red-800! border-red-200!" },
};

export const adoptionStatusMap: Record<string, { label: string, classes: string }> = {
    PENDING: { label: "Em Análise", classes: "bg-yellow-100! text-yellow-800! border-yellow-200!" },
    APPROVED: { label: "Aprovado", classes: "bg-green-100! text-green-800! border-green-200!" },
    REJECTED: { label: "Rejeitado", classes: "bg-red-100! text-red-800! border-red-200!" },
    RETURNED: { label: "Devolvido", classes: "bg-gray-100! text-gray-800! border-gray-200!" },
};