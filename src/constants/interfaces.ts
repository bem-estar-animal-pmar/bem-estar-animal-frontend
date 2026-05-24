export type Role = "USER" | "ADMIN" | "MANAGER";
export type PetSpecies = "DOG" | "CAT";
export type PetGender = "MALE" | "FEMALE";
export type PetSize = "SMALL" | "MEDIUM" | "LARGE";
export type PetAdoptionStatus = "NONE" | "FOR_ADOPTION" | "ADOPTED";
export type PetHomeStatus = "HAS_OWNER" | "TEMPORARY_HOME" | "STRAY_ANIMAL";
export type PetBreed = "AKITA" | "AMERICAN_STAFFORDSHIRE_TERRIER" | "AMERICAN_BULLY" | "BASSET_HOUND" | "BEAGLE" | "AUSTRALIAN_CATTLE_DOG" | "BERNESE_MOUNTAIN_DOG" | "BORDER_COLLIE" | "BORDER_TERRIER" | "BOSTON_TERRIER" | "BOXER" | "FRENCH_BULLDOG" | "ENGLISH_BULLDOG" | "BULL_TERRIER" | "CANE_CORSO" | "CAVALIER_KING_CHARLES_SPANIEL" | "CHIHUAHUA" | "CHOW_CHOW" | "AMERICAN_COCKER_SPANIEL" | "ENGLISH_COCKER_SPANIEL" | "COLLIE" | "DACHSHUND" | "DALMATIAN" | "DOBERMAN" | "DOGO_ARGENTINO" | "GREAT_DANE" | "FILA_BRASILEIRO" | "FOX_TERRIER" | "GOLDEN_RETRIEVER" | "SIBERIAN_HUSKY" | "JACK_RUSSELL_TERRIER" | "LABRADOODLE" | "LABRADOR_RETRIEVER" | "LHASA_APSO" | "POMERANIAN" | "MALTESE" | "GERMAN_SHEPHERD" | "AUSTRALIAN_SHEPHERD" | "MINIATURE_PINSCHER" | "PIT_BULL" | "POODLE" | "PUG" | "ROTTWEILER" | "SHIH_TZU" | "STAFFORDSHIRE_BULL_TERRIER" | "NEWFOUNDLAND" | "SCOTTISH_TERRIER" | "WEIMARANER" | "WELSH_CORGI" | "YORKSHIRE_TERRIER" | "ABYSSINIAN" | "ANGORA" | "BENGAL" | "BIRMAN" | "CHARTREUX" | "RUSSIAN_BLUE" | "HIMALAYAN" | "MAINE_COON" | "MUNCHKIN" | "SPHYNX" | "SIAMESE" | "RAGDOLL" | "SCOTTISH_FOLD" | "AMERICAN_BURMESE" | "PERSIAN" | "EXOTIC_SHORTHAIR" | "MIXED_BREED";
export type NeuteringStatus = "PENDING" | "AWAITING_EXAMS" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
export type EmergencyStatus = "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
export type GiveUpRequestStatus = "PENDING" | "APPROVED" | "REJECTED";
export type AdoptionRequestStatus = "PENDING" | "APPROVED" | "REJECTED" | "RETURNED";
export type TriageAnswer = "YES" | "NO" | "DONT_KNOW";

export interface TriageData {
    isNeutered?: TriageAnswer;
    isConscious?: TriageAnswer;
    isHeadRaised?: TriageAnswer;
    isBleeding?: TriageAnswer;
    bleedingLocation?: string;
    isStanding?: TriageAnswer;
    hasStoodUp?: TriageAnswer;
    supportsAllPaws?: TriageAnswer;
    unsupportedPaw?: string;
    hasWalked?: TriageAnswer;
    hasExposedBone?: TriageAnswer;
    exposedBone?: string;       // <-- NEW
    breathingDifficulty?: TriageAnswer;
    hasEaten?: TriageAnswer;
    hasDrunk?: TriageAnswer;    // <-- NEW
    hasVomited?: TriageAnswer;
    hasDiarrhea?: TriageAnswer;
    symptomsDuration?: string;
    otherSymptoms?: string;
}

export interface AdminUser { /* list route */
    id: string,
    name: string,
    email: string,
    phone: string,
    lastName: string,
    role: Role
}

export interface UserById { /* get by id route  */
    id: string,
    name: string,
    lastName: string,
    email: string,
    phone: string,
    role: string,
    createdAt: string,
    cep: string,
    cpf: string,
    street: string,
    number: string,
    state: string,
    maxPetLimit: number,
    maxMonthlyNeuteringRequestLimit: number,
    neighborhood: string,
    city: string,
    blockedUntil: string | null,
    suspendedAt: string | null,
    deletedAt: string | null,
    termsAcceptedAt: string | null,
    privacyAcceptedAt: string | null,
    termsVersion: string,
    privacyVersion: string,
    updatedAt: string,
    emailVerified: boolean,
    history?: string /* only when admin asks, user does not see this field */
}

/* pets */
export interface Pet { /* default pet model, listByUser uses it */
    id: string;
    ownerId: string;
    name: string;
    image: string;
    species: PetSpecies;
    gender: PetGender;
    breed: PetBreed;
    birthDate: string;
    weight: number;
    size: PetSize;
    coatColor: string;
    isNeutered: boolean;
    allowEmergency: boolean;
    chip?: string;
    homeStatus: PetHomeStatus;
    adoptionStatus: PetAdoptionStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface AdminPet { /* list by admin */
    id: string;
    ownerId: string;
    owner: { /* this prop exist only when admin requests pets on list backend route */
        name: string;
        lastName: string;
        email: string;
        phone: string;
    }
    name: string;
    image: string;
    species: PetSpecies;
    gender: PetGender;
    breed: PetBreed;
    birthDate: string;
    weight: number;
    size: PetSize;
    coatColor: string;
    isNeutered: boolean;
    allowEmergency: boolean;
    chip?: string;
    homeStatus: PetHomeStatus;
    adoptionStatus: PetAdoptionStatus;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
}

export interface PetById { /* get by user */
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
    image: string;
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
    homeStatus: PetHomeStatus;
    adoptionStatus: PetAdoptionStatus;
}

export interface PetForAdoption { /* list pets with status "FOR_ADOPTION" (public adoptions page) */ 
    id: string;
    name: string;
    image: string;
    species: PetSpecies;
    gender: PetGender;
    breed: PetBreed;
    birthDate: string;
    weight: number;
    size: PetSize;
    coatColor: string;
    isNeutered: string;
}

/* neuterings */
export interface NeuteringAppointment { /* default neutering model, list by user uses it */
    id: string;
    requestNumber: number;
    scheduleDate?: string;
    period?: "MORNING" | "AFTERNOON";
    status: "PENDING" | "AWAITING_EXAMS" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    userId: string;
    petId: string;
    animalFastAccepted: boolean;
    animalChipAccepted: boolean;
    termsAccepted: boolean;
    pet: { 
        name: string;
        species: string;
        gender: string;
        breed: string;
    }
}

export interface AdminNeuteringAppointment { /* list by admin */
    id: string;
    requestNumber: number;
    userId: string;
    petId: string;
    scheduleDate?: string;
    period?: "MORNING" | "AFTERNOON";
    status: "PENDING" | "AWAITING_EXAMS" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    animalFastAccepted: boolean;
    animalChipAccepted: boolean;
    termsAccepted: boolean;
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

export interface AdminNeuteringAppointmentById { /* get by id (admin has medical record, user do not) */
    id: string;
    requestNumber: number;
    userId: string;
    petId: string;
    scheduleDate?: string;
    period?: "MORNING" | "AFTERNOON";
    status: "PENDING" | "AWAITING_EXAMS" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    animalFastAccepted: boolean;
    animalChipAccepted: boolean;
    termsAccepted: boolean;
    pet: { 
        name: string,
        species: string,
        gender: string,
        breed: string,
        size: string,
        ownerId: string,
        chip: string,
        isNeutered: boolean,
        allowEmergency: boolean,
    };
    user: { 
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
    };
    medicalRecord?: { /* users do not retrieve this field */
        id: string,
        notes: string,
        history: string
    }
}

/* emergencies */
export interface EmergencyAppointment { /* default, list by user */
    id: string;
    requestNumber: number;
    userId: string;
    petId?: string;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    name: string;
    gender?: "MALE" | "FEMALE"; /* gender is optional when there is no pet attached */
    species: "DOG" | "CAT";
    size: "SMALL" | "MEDIUM" | "LARGE";
    description: string;
    triageData?: TriageData;
    scheduleDate?: string;
    period?: "MORNING" | "AFTERNOON";
    temporaryHomeAccepted: boolean;
    animalChipAccepted: boolean;
    termsAccepted: boolean;
    createdAt: string;
    updatedAt: string;
    pet?: { 
        id: string;
        name: string;
        allowEmergency: boolean;
    };
}

export interface AdminEmergencyAppointment { /* list by admin */
    id: string;
    requestNumber: number;
    userId: string;
    petId?: string;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    name: string;
    gender?: "MALE" | "FEMALE"; /* gender is optional when there is no pet attached */
    species: "DOG" | "CAT";
    size: "SMALL" | "MEDIUM" | "LARGE";
    description: string;
    triageData?: TriageData;
    scheduleDate?: string;
    period?: "MORNING" | "AFTERNOON";
    temporaryHomeAccepted: boolean;
    animalChipAccepted: boolean;
    termsAccepted: boolean;
    createdAt: string;
    updatedAt: string;
    pet?: { 
        id: string;
        name: string;
        allowEmergency: boolean;
    };
    user: { 
        name: string; 
        lastName: string; 
        phone: string; 
        email: string;
    }
}

export interface AdminEmergencyAppointmentById { /* get by id  (admin has medical record, user do not) */
    id: string;
    requestNumber: number;
    userId: string;
    petId?: string;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    name: string;
    gender?: "MALE" | "FEMALE"; /* gender is optional when there is no pet attached */
    species: "DOG" | "CAT";
    size: "SMALL" | "MEDIUM" | "LARGE";
    description: string;
    triageData?: TriageData;
    scheduleDate?: string;
    period?: "MORNING" | "AFTERNOON";
    temporaryHomeAccepted: boolean;
    animalChipAccepted: boolean;
    termsAccepted: boolean;
    createdAt: string;
    updatedAt: string;
    pet: { 
        name: string,
        species: string,
        gender: string,
        breed: string,
        size: string,
        ownerId: string,
        chip: string,
        isNeutered: boolean,
        allowEmergency: boolean,
    };
    user: { 
        id: string,
        name: string,
        lastName: string,
        email: string,
        phone: string,
        cep: string,
        street: string,
        neighborhood: string,
        city: string,
        state: string,
        number: string
    };
    medicalRecord?: { /* users do not retrieve this field */
        id: string,
        notes: string,
        history: string
    }
}

/* medical record */
export interface MedicalRecord {
    id: string;
    notes: string;
    history: string;
}

/* give up */
export interface GiveUpRequest {
    id: string;
    requestNumber: number;
    status: GiveUpRequestStatus;
    reason?: string;
    history: string;
    petId: string;
    userId: string;
    approvedAt: Date;
    temporaryHomeAccepted: boolean;
    termsAccepted: boolean;
    createdAt: string;
}

export interface GiveUpRequestListByUser {
    id: string;
    requestNumber: number;
    status: GiveUpRequestStatus;
    reason?: string;
    history: string;
    petId: string;
    pet: { 
        id: string,
        name: string,
        species: string,
    };
    user: { 
        name: string; 
        lastName: string; 
        phone: string; 
        email: string;
    };
    userId: string;
    approvedAt: Date;
    temporaryHomeAccepted: boolean;
    termsAccepted: boolean;
    createdAt: string;
}

export interface AdminGiveUpRequest {
    id: string;
    requestNumber: number;
    status: GiveUpRequestStatus;
    reason?: string;
    history: string;
    petId: string;
    pet: { 
        name: string,
        species: string,
    };
    userId: string;
    approvedAt: Date;
    temporaryHomeAccepted: boolean;
    termsAccepted: boolean;
    createdAt: string;
}

export interface AdminGiveUpRequestById {
    id: string;
    requestNumber: number;
    status: GiveUpRequestStatus;
    reason?: string;
    history: string;
    petId: string;
    pet: { 
        name: string,
        species: string,
        gender: string,
        breed: string,
        size: string,
        ownerId: string,
        chip: string,
        isNeutered: boolean,
        allowEmergency: boolean,
    };
    user: { 
        id: string,
        name: string,
        lastName: string,
        email: string,
        phone: string,
        cep: string,
        street: string,
        neighborhood: string,
        city: string,
        state: string,
        number: string
    };
    userId: string;
    approvedAt: Date;
    temporaryHomeAccepted: boolean;
    termsAccepted: boolean;
    createdAt: string;
}


/* adoption */
export interface AdoptionRequest {
    id: string;
    requestNumber: number;
    status: AdoptionRequestStatus;
    history: string;
    petId: string;
    adopterName: string;
    adopterEmail: string;
    adopterPhone: string;
    adopterCep: string;
    adopterStreet: string;
    adopterNeighborhood: string;
    adopterCity: string;
    adopterState: string;
    adopterNumber: string;
    adoptedAt: Date;
    temporaryHomeAccepted: boolean;
    termsAccepted: boolean;
    createdAt: string;
}

export interface AdoptionRequestList {
    id: string;
    requestNumber: number;
    status: AdoptionRequestStatus;
    history: string;
    petId: string;
    pet: { 
        name: string,
        species: string,
    };
    adopterName: string;
    adopterEmail: string;
    adopterPhone: string;
    adopterCep: string;
    adopterStreet: string;
    adopterNeighborhood: string;
    adopterCity: string;
    adopterState: string;
    adopterNumber: string;
    adoptedAt: Date;
    termsAccepted: boolean;
    createdAt: string;
}

export interface AdoptionRequestById { /* admin only */
    id: string;
    requestNumber: number;
    status: AdoptionRequestStatus;
    history: string;
    petId: string;
    pet: { 
        name: string,
        species: string,
        gender: string,
        breed: string,
        size: string,
        ownerId: string,
        chip: string,
        isNeutered: boolean,
        allowEmergency: boolean,
    };
    adopterName: string;
    adopterEmail: string;
    adopterPhone: string;
    adopterCep: string;
    adopterStreet: string;
    adopterNeighborhood: string;
    adopterCity: string;
    adopterState: string;
    adopterNumber: string;
    adoptedAt: Date;
    termsAccepted: boolean;
    createdAt: string;
}
