/* pets */
export interface Pet { /* list by user  */
    id: string;
    ownerId: string;
    owner: { /* this prop exist only when admin requests pets on list and getById backend rotes*/
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
    isNeutered: boolean;
    allowEmergency: boolean;
    chip?: string;
    adoptionStatus: string;
}

export interface AdminPet { /* list by admin */
    id: string;
    ownerId: string;
    owner: { /* this prop exist only when admin requests pets on list and getById backend rotes*/
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
    isNeutered: boolean;
    allowEmergency: boolean;
    chip?: string;
    adoptionStatus: string;
}

export interface PetById { /* list by user */
    id: string;
    ownerId: string;
    owner: { 
        name:  string, 
        lastName:  string, 
        email:  string, 
        phone:  string, 
        cep:  string,
        street:  string, 
        neighborhood:  string,
        city:  string,
        state:  string,
        number:  string
    }
    name: string;
    species: string;
    gender: string;
    breed: string;
    birthDate: string;
    weight: number;
    size: string;
    coatColor: string;
    isNeutered: boolean;
    allowEmergency: boolean;
    chip?: string;
    adoptionStatus: string;
}

export interface PetForAdoption { /* list pets with status "FOR_ADOPTION" (public adoptions page) */ 
    /* might need to include other fields later */
    id: string;
    name: string;
    species: string;
    gender: string;
    breed: string;
    weight: number;
    coatColor: string;
    birthDate: string;
}

/* neuterings */
export interface NeuteringAppointment { /* list by user */
    id: string;
    userId: string;
    petId: string;
    scheduleDate?: string;
    period?: "MORNING" | "AFTERNOON";
    status: "PENDING" | "AWAITING_EXAMS" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    pet: { 
        name: string;
        species: string;
        gender: string;
        breed: string;
    }
}

export interface AdminNeuteringAppointment { /* list by admin */
    id: string;
    userId: string;
    petId: string;
    scheduleDate?: string;
    period?: "MORNING" | "AFTERNOON";
    status: "PENDING" | "AWAITING_EXAMS" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    pet: { 
        name: string;
        species: string;
    }
    user: { 
        name:  string,  
        lastName:  string,  
        email:  string,  
        phone:  string, 
    } 
}

export interface AdminNeuteringAppointmentById { /* get by id (admin) */
    id: string;
    userId: string;
    petId: string;
    scheduleDate?: string;
    period?: "MORNING" | "AFTERNOON";
    status: "PENDING" | "AWAITING_EXAMS" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    pet: { 
        ownerId: string;
        name: string;
        species: string;
        gender: string;
        breed: string;
        chip: string;
    };
    user: { 
        name:  string, 
        lastName:  string, 
        email:  string, 
        phone:  string,
        cep?:  string, 
        street?:  string,  
        neighborhood?:  string, 
        city?:  string, 
        state?:  string, 
        number?:  string
    };
    medicalRecord: {
        id: string,
        notes: string,
        history: string
    }
}

/* emergencies */
export interface EmergencyAppointment {
    id: string;
    userId: string;
    petId?: string;
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
        allowEmergency: string;
    };
}

/* give up */
export interface GiveUpRequest {
    id: string;
    userId: string;
    status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED_BY_USER";
    reason?: string;
    petId: string;
    pet: { id: string; name: string; species: string };
    createdAt: string;
}