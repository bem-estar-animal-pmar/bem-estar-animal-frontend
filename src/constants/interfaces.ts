/* pets */

export interface Pet {
    id: string;
    name: string;
    species: string;
    gender: string;
    breed?: string;
    birthDate: string;
    weight: number;
    coatColor: string;
    chip?: string;
    adoptionStatus: string;
}

export interface CreatePetFormProps {
    onSuccess: () => void;
    onCancel: () => void;
}