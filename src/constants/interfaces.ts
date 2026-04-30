/* pets */

export interface Pet {
    id: string;
    ownerId?: string;
    owner?: { /* this prop exist only when admin requests pets on list and getById backend rotes*/
        name: string;
        lastName: string;
        email: string;
        phone: string;
    }
    name: string;
    species: string;
    gender: string;
    breed: string;
    birthDate: string;
    weight: number;
    size: string;
    coatColor: string;
    chip?: string;
    adoptionStatus: string;
}

/* neuterings */

export interface NeuteringAppointment {
    id: string;
    scheduleDate?: string;
    period?: "MORNING" | "AFTERNOON";
    status: "PENDING" | "AWAITING_EXAMS" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    pet: { /* neutering appointments on the backend return only these pet data */
        name: string;
        species: string;
        gender: string;
        breed: string;
        chip: string;
    }
}

/* emergencies */

export interface EmergencyAppointment {
    id: string;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    species: "DOG" | "CAT";
    size: "SMALL" | "MEDIUM" | "LARGE";
    description: string;
    scheduleDate?: string;
    period?: "MORNING" | "AFTERNOON";
    createdAt: string;
    pet?: { 
        id: string;
        name: string;
    };
}

/* give up */

export interface GiveUpRequest {
    id: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED_BY_USER";
    reason?: string;
    petId: string;
    pet: { id: string; name: string; species: string };
    createdAt: string;
}