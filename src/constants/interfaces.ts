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

/* neuterings */

export interface NeuteringAppointment {
    id: string;
    scheduleDate: string;
    period: "MORNING" | "AFTERNOON";
    status: "PENDING" | "AWAITING_EXAMS" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    pet: { /* neutering appointments on the backend return only these pet data */
        name: string;
        species: string;
        gender: string;
        breed: string;
    }
}