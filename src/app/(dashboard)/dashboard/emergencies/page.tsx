"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import { ApiError } from "@/src/lib/api-error"

import { Label } from "@/src/components/ui/Label"
import { Select } from "@/src/components/ui/Select"
import { Button } from "@/src/components/ui/Button"
import { Card } from "@/src/components/ui/Card"
import { Badge, TextLink } from "@/src/components/ui"
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon"

import { toast } from "@/src/lib/toast-store"

import pet_avatar_placeholder from "@/public/pet-avatar-placeholder.webp"
import { Textarea } from "@/src/components/ui/TextArea"

interface Pet {
    id: string;
    name: string;
    species: "DOG" | "CAT";
    gender: string;
    breed: string;
    weight: number;
    coatColor: string;
    adoptionStatus: string;
}

interface EmergencyAppointment {
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
    petId?: string;
}

const statusMap: Record<string, { label: string; classes: string }> = {
    PENDING: { label: "Em Análise", classes: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    CONFIRMED: { label: "Agendado", classes: "bg-green-100 text-green-800 border-green-200" },
    COMPLETED: { label: "Atendido", classes: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    CANCELLED: { label: "Cancelado", classes: "bg-gray-100 text-gray-800 border-gray-200" },
    NO_SHOW: { label: "Não Compareceu", classes: "bg-red-100 text-red-800 border-red-200" },
};

const sizeMap = {
    SMALL: "Pequeno",
    MEDIUM: "Médio",
    LARGE: "Grande"
};

const EmergencyContent = () => {
    const searchParams = useSearchParams();
    const petIdParam = searchParams.get("petId") || "";
    
    /* states for initial data */
    const [pets, setPets] = useState<Pet[]>([]);
    const [appointments, setAppointments] = useState<EmergencyAppointment[]>([]);

    /* form states */
    const [requestType, setRequestType] = useState<"MY_PET" | "STRAY">("STRAY");
    const [selectedPetId, setSelectedPetId] = useState(petIdParam);
    const [species, setSpecies] = useState<"DOG" | "CAT" | "">("");
    const [size, setSize] = useState<"SMALL" | "MEDIUM" | "LARGE" | "">("");
    const [description, setDescription] = useState("");
    
    const [temporaryHomeAccepted, setTemporaryHomeAccepted] = useState(false);
    const [animalChipAccepted, setAnimalChipAccepted] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    /* loading states */
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        loadInitialData();
    }, []);

    useEffect(() => {
        if (requestType === "MY_PET" && selectedPetId) {
            const pet = pets.find(p => p.id === selectedPetId);
            if (pet) setSpecies(pet.species);
        } else {
            setSpecies("");
        }
        setSize("");
    }, [requestType, selectedPetId, pets]);

    const loadInitialData = async () => {
        try {
            setIsLoading(true);

            const [petsResponse, appointmentsResponse] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/me`, { credentials: "include" }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emergencies/me`, { credentials: "include" })
            ]);

            if (!petsResponse.ok || !appointmentsResponse.ok) {
                const data = !petsResponse.ok ? await petsResponse.json() : await appointmentsResponse.json();
                throw new ApiError(data.message, data.code, data.details);
            }
            
            const [petsData, appointmentsData] = await Promise.all([
                petsResponse.json(),
                appointmentsResponse.json()
            ]);

            setPets(petsData);
            setAppointments(appointmentsData);
            
            if (petIdParam && petsData.some((p: Pet) => p.id === petIdParam)) {
                setRequestType("MY_PET");
            }

        } catch (err: unknown) { 
            if (err instanceof ApiError) {
                toast.danger(err.message, { message: err.details?.[0]?.message });
                return;
            }
            toast.danger("Erro desconhecido ao carregar dados.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!species || !size || !description || description.length < 10) {
            toast.warning("Preencha todos os campos corretamente. A descrição precisa ter pelo menos 10 caracteres.");
            return;
        }

        if (requestType === "MY_PET" && !selectedPetId) {
            toast.warning("Selecione um dos seus pets para prosseguir.");
            return;
        }

        try {
            setIsSubmitting(true);

            const payload = {
                species,
                size,
                description,
                temporaryHomeAccepted,
                animalChipAccepted,
                termsAccepted,
                ...(requestType === "MY_PET" && { petId: selectedPetId })
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emergencies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success("Solicitação de atendimento enviada! A clínica entrará em contato em breve.");
            
            setDescription("");
            setSize("");
            setTemporaryHomeAccepted(false);
            setAnimalChipAccepted(false);
            setTermsAccepted(false);
            
            if (requestType === "STRAY") setSpecies("");
            
            loadInitialData();

        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.warning(err.message, { message: err.details?.[0]?.message });
                return;
            }
            toast.danger("Erro ao solicitar atendimento.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full flex justify-center items-center h-64">
                <SpinnerIcon />
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col lg:flex-row gap-x-8">
            <div className="flex-1 flex flex-col">
                <div className="w-full flex justify-between items-center flex-wrap gap-y-2 pb-4">
                    <h1 className="text-default-fg font-semibold text-xl sm:text-2xl lg:text-3xl text-center lg:text-start">
                        Atendimento de <span className="text-primary-fg">emergencia</span>
                    </h1>
                </div>

                <p className="text-muted-fg text-sm sm:text-base pb-1">
                    Este serviço é destinado ao socorro de animais em situação de rua ou casos graves de pets já cadastrados. 
                </p>
                <p className="text-muted-fg text-sm sm:text-base pb-4">
                    Nossa equipe avaliará a gravidade e a disponibilidade de vagas para definir o horário do atendimento. Por favor, forneça o máximo de detalhes possível.     
                </p>


                <section className="pb-8">
                    <h2 className="text-default-fg font-bold text-lg sm:text-xl lg:text-2xl mb-4">Como funciona o atendimento?</h2>
                    <div className="flex flex-col md:flex-row gap-4 justify-between">
                        <div className="flex flex-col gap-1 sm:gap-2 relative">
                            <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-primary-fg mb-1 sm:mb-2"></div>
                            <h3 className="font-semibold text-sm">1. Solicitação</h3>
                            <p className="text-xs text-muted-fg">Você descreve a situação e o porte do animal pelo formulário ao lado.</p>
                        </div>
                        <div className="flex flex-col gap-1 sm:gap-2 relative">
                            <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-gray-300 mb-1 sm:mb-2"></div>
                            <h3 className="font-semibold text-sm">2. Avaliação</h3>
                            <p className="text-xs text-muted-fg">Nossa equipe avalia a gravidade e define o horário de encaixe na clínica.</p>
                        </div>
                        <div className="flex flex-col gap-1 sm:gap-2 relative">
                            <div className="w-3 sm:w-4 h-3 sm:h-4 rounded-full bg-gray-300 mb-1 sm:mb-2"></div>
                            <h3 className="font-semibold text-sm">3. Atendimento</h3>
                            <p className="text-xs text-muted-fg">Você leva o animal até a clínica e nós realizamos todos os procedimentos.</p>
                        </div>
                    </div>
                </section>

                <section className="w-full p-4 md:p-6 border border-primary-border rounded-md hidden lg:block">
                    <h2 className="text-default-fg font-bold text-lg sm:text-xl pb-6">
                        Histórico de agendamentos
                    </h2>
                    
                    {appointments.length === 0 ? 
                        <div className="bg-muted-bg p-6 rounded-lg text-center border border-dashed border-primary-border">
                            <p className="text-muted-fg text-sm">Você ainda não possui solicitações emergenciais.</p>
                        </div>
                        : 
                        <div className="flex flex-col gap-4">
                            {appointments.map((appt) => {
                                const statusInfo = statusMap[appt.status];
                                const displayDate = appt.scheduleDate ? appt.scheduleDate.split("T")[0].split("-").reverse().join("/")  : "Aguardando data";
                                const period = appt.period ? appt.period === "MORNING" ? "Manhã" : "Tarde" : " "

                                return (
                                    <Card key={appt.id} className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center shadow-sm!">
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-center gap-2">
                                                <Badge variant="primary" size="sm" pill="true">
                                                    {appt.species === "DOG" ? "Cachorro" : "Gato"}
                                                </Badge>
                                                <span className="text-xs text-muted-fg">
                                                    Porte {appt.size === "SMALL" ? "Pequeno" : appt.size === "MEDIUM" ? "Médio" : "Grande"}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-default-fg mt-1">
                                                {appt.pet ? `Pet: ${appt.pet.name}` : "Animal de rua"}
                                            </p>
                                            <p className="text-xs text-muted-fg line-clamp-1 max-w-md">
                                                Motivo: {appt.description}
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-start sm:items-end gap-2 shrink-0 w-full sm:w-auto">
                                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.classes}`}>
                                                {statusInfo.label}
                                            </span>
                                            <div className="text-xs text-right">
                                                <p className="text-default-fg font-medium">{displayDate}</p>
                                                {appt.period && (
                                                    <p className="text-muted-fg">{period}</p>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    }
                </section>
            </div>

            <aside className="flex md:max-w-124 lg:max-w-108 self-center pb-8">
                <Card className="border-t-4 border-primary-border rounded-2xl p-6 flex flex-col">
                    <div className="pb-4">
                        <h2 className="text-xl font-semibold text-default-fg mb-1">Solicitar atendimento</h2>
                        <p className="text-sm text-muted-fg">Preencha os dados abaixo para solicitar uma avaliação clínica.</p>
                    </div>

                    <div className="flex w-full p-1 bg-gray-100 rounded-lg mb-4">
                        <button
                            type="button"
                            onClick={() => setRequestType("STRAY")}
                            className={`flex-1 text-sm py-2 rounded-md transition-colors font-medium cursor-pointer ${
                                requestType === "STRAY" ? "bg-white shadow-sm text-default-fg" : "text-muted-fg hover:text-default-fg"
                            }`}
                        >
                            Animal de Rua
                        </button>
                        <button
                            type="button"
                            onClick={() => setRequestType("MY_PET")}
                            className={`flex-1 text-sm py-2 rounded-md transition-colors font-medium cursor-pointer ${
                                requestType === "MY_PET" ? "bg-white shadow-sm text-default-fg" : "text-muted-fg hover:text-default-fg"
                            }`}
                        >
                            Meu Pet
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                        
                        {requestType === "MY_PET" ? (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="petId">Selecione seu pet</Label>
                                <Select
                                    id="petId"
                                    value={selectedPetId}
                                    onChange={(val) => setSelectedPetId(val)}
                                    options={pets.map(p => ({ value: p.id, label: p.name }))}
                                    placeholder="Escolha um pet..."
                                />
                                {pets.length === 0 && (
                                    <p className="text-xs text-red-500 mt-1">Você ainda não possui pets cadastrados.</p>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="species">Espécie do Animal</Label>
                                <Select
                                    id="species"
                                    value={species}
                                    onChange={(val) => setSpecies(val as "DOG" | "CAT")}
                                    options={[
                                        { value: "DOG", label: "Cachorro" },
                                        { value: "CAT", label: "Gato" }
                                    ]}
                                    placeholder="Cachorro ou Gato?"
                                />
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="size">Porte do Animal</Label>
                            <Select
                                id="size"
                                value={size}
                                onChange={(val) => setSize(val as "SMALL" | "MEDIUM" | "LARGE")}
                                options={[
                                    { value: "SMALL", label: "Pequeno (até 10kg)" },
                                    { value: "MEDIUM", label: "Médio (11kg a 25kg)" },
                                    { value: "LARGE", label: "Grande (acima de 25kg)" }
                                ]}
                                placeholder="Selecione o porte..."
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="description">Descrição da Emergência</Label>
                            <Textarea 
                                id="description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                resize="none"
                                placeholder="Descreva com detalhes a ocorrência..."
                            />
                            <span className="text-xs text-muted-fg self-end">
                                {description.length}/500 caracteres
                            </span>
                        </div>

                        <div className="flex flex-col gap-3 mt-2">
                            <label className="flex items-start gap-2 text-sm text-default-fg cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    required 
                                    checked={temporaryHomeAccepted}
                                    onChange={(e) => setTemporaryHomeAccepted(e.target.checked)}
                                    className="mt-0.5" 
                                />
                                <span className="text-xs text-muted-fg">
                                    Comprometo-me a ser o lar temporário deste animal durante o tratamento, caso ele não tenha dono.
                                </span>
                            </label>

                            <label className="flex items-start gap-2 text-sm text-default-fg cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    required 
                                    checked={animalChipAccepted}
                                    onChange={(e) => setAnimalChipAccepted(e.target.checked)}
                                    className="mt-0.5" 
                                />
                                <span className="text-xs text-muted-fg">
                                    Autorizo a microchipagem do animal durante o procedimento.
                                </span>
                            </label>

                            <label className="flex items-start gap-2 text-sm text-default-fg cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    required 
                                    checked={termsAccepted}
                                    onChange={(e) => setTermsAccepted(e.target.checked)}
                                    className="mt-0.5" 
                                />
                                <span className="text-xs text-muted-fg">
                                    Li e aceito os termos de responsabilidade do agendamento emergencial.
                                </span>
                            </label>
                        </div>

                        <Button 
                            type="submit" 
                            variant="primary" 
                            className="w-full py-6 text-base mt-2"
                            disabled={isSubmitting || (requestType === "MY_PET" && !selectedPetId)}
                        >
                            {isSubmitting ? <SpinnerIcon /> : "Solicitar Atendimento"}
                        </Button>
                    </form>
                </Card>
            </aside>

            <section className="w-full p-4 md:p-6 border border-primary-border rounded-md block lg:hidden">
                <h2 className="text-default-fg font-bold text-lg sm:text-xl pb-6">
                    Histórico de agendamentos
                </h2>
                
                {appointments.length === 0 ? 
                    <div className="bg-muted-bg p-6 rounded-lg text-center border border-dashed border-primary-border">
                        <p className="text-muted-fg text-sm">Você ainda não possui solicitações emergenciais.</p>
                    </div>
                    : 
                    <div className="flex flex-col gap-4">
                        {appointments.map((appt) => {
                            const statusInfo = statusMap[appt.status];
                            const displayDate = appt.scheduleDate ? appt.scheduleDate.split("T")[0].split("-").reverse().join("/")  : "Aguardando data";
                            const period = appt.period ? appt.period === "MORNING" ? "Manhã" : "Tarde" : " "

                            return (
                                <Card key={appt.id} className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center shadow-sm!">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center gap-2">
                                            <Badge variant="primary" size="sm" pill="true">
                                                {appt.species === "DOG" ? "Cachorro" : "Gato"}
                                            </Badge>
                                            <span className="text-xs text-muted-fg">
                                                Porte {appt.size === "SMALL" ? "Pequeno" : appt.size === "MEDIUM" ? "Médio" : "Grande"}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-default-fg mt-1">
                                            {appt.pet ? `Pet: ${appt.pet.name}` : "Animal de rua"}
                                        </p>
                                        <p className="text-xs text-muted-fg line-clamp-1 max-w-md">
                                            Motivo: {appt.description}
                                        </p>
                                    </div>

                                    <div className="flex flex-col items-start sm:items-end gap-2 shrink-0 w-full sm:w-auto">
                                        <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusInfo.classes}`}>
                                            {statusInfo.label}
                                        </span>
                                        <div className="text-xs text-right">
                                            <p className="text-default-fg font-medium">{displayDate}</p>
                                            {appt.period && (
                                                <p className="text-muted-fg">{period}</p>
                                            )}
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                }
            </section>
        </div>
    )
}

export default function EmergencyPage() {
  return (
    <Suspense 
        fallback={
            <div className="w-full flex justify-center items-center h-screen">
                <SpinnerIcon />
            </div>
        }
    >
        <EmergencyContent />
    </Suspense>
  )
}