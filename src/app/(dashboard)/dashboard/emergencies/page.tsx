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

    // Quando o usuário muda o tipo de requisição, resetamos os campos
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
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 py-8 px-4">
            
            <div className="flex-1 flex flex-col gap-8">
                
                <section>
                    <h1 className="text-default-fg font-bold text-2xl sm:text-3xl lg:text-4xl pb-4">
                        Atendimento <span className="text-primary-fg">Emergencial</span>
                    </h1>
                    <p className="text-muted-fg text-sm sm:text-base leading-relaxed">
                        Este serviço é destinado ao socorro de animais em situação de rua ou casos graves de pets já cadastrados. 
                        Nossa equipe avaliará a gravidade e a disponibilidade de vagas para definir o horário do atendimento. 
                        Por favor, forneça o máximo de detalhes possível.
                    </p>
                </section>

                <section className="mt-4">
                    <h2 className="text-default-fg font-bold text-xl mb-4">Como funciona o atendimento?</h2>
                    <div className="flex flex-col md:flex-row gap-4 justify-between border-b pb-8">
                        <div className="flex flex-col gap-2 relative">
                            <div className="w-4 h-4 rounded-full bg-primary-fg mb-2"></div>
                            <h3 className="font-semibold text-sm">1. Solicitação</h3>
                            <p className="text-xs text-muted-fg">Você descreve a situação e o porte do animal pelo formulário ao lado.</p>
                        </div>
                        <div className="flex flex-col gap-2 relative">
                            <div className="w-4 h-4 rounded-full bg-gray-300 mb-2"></div>
                            <h3 className="font-semibold text-sm">2. Avaliação</h3>
                            <p className="text-xs text-muted-fg">Nossa equipe avalia a gravidade e define o horário de encaixe na clínica.</p>
                        </div>
                        <div className="flex flex-col gap-2 relative">
                            <div className="w-4 h-4 rounded-full bg-gray-300 mb-2"></div>
                            <h3 className="font-semibold text-sm">3. Atendimento</h3>
                            <p className="text-xs text-muted-fg">Você leva o animal até a clínica e nós realizamos todos os procedimentos.</p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className="text-default-fg font-bold text-xl pb-6 border-b border-primary-border mb-6">
                        Meus Pedidos de Atendimento
                    </h2>
                    
                    {appointments.length === 0 ? (
                        <div className="bg-muted-bg p-6 rounded-lg text-center border border-dashed border-primary-border">
                            <p className="text-muted-fg text-sm">Você ainda não possui solicitações emergenciais.</p>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-4">
                            {appointments.map((appt) => {
                                const statusInfo = statusMap[appt.status] || { label: appt.status, classes: "bg-gray-100" };
                                const displayDate = appt.scheduleDate 
                                    ? new Date(appt.scheduleDate).toLocaleDateString() 
                                    : "Aguardando triagem";

                                return (
                                    <Card key={appt.id} className="p-4 flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
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
                                                    <p className="text-muted-fg">Período da {appt.period === "MORNING" ? "Manhã" : "Tarde"}</p>
                                                )}
                                            </div>
                                        </div>
                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </section>
            </div>

            <aside className="w-full lg:w-114 relative">
                <Card className="sticky top-8 shadow-xl! border-t-4 border-t-red-600 rounded-2xl p-6 flex flex-col gap-6">
                    <div>
                        <h2 className="text-xl font-bold text-default-fg mb-1">Novo Atendimento</h2>
                        <p className="text-sm text-muted-fg">Preencha os dados abaixo para solicitar uma avaliação clínica.</p>
                    </div>

                    <div className="flex w-full p-1 bg-gray-100 rounded-lg">
                        <button
                            type="button"
                            onClick={() => setRequestType("STRAY")}
                            className={`flex-1 text-sm py-2 rounded-md transition-colors font-medium ${
                                requestType === "STRAY" ? "bg-white shadow-sm text-default-fg" : "text-muted-fg hover:text-default-fg"
                            }`}
                        >
                            Animal de Rua
                        </button>
                        <button
                            type="button"
                            onClick={() => setRequestType("MY_PET")}
                            className={`flex-1 text-sm py-2 rounded-md transition-colors font-medium ${
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