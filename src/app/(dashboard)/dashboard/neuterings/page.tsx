"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"

import { DatePicker } from "@/src/components/ui/DatePicker"
import { Label } from "@/src/components/ui/Label"
import { Select } from "@/src/components/ui/Select"
import { Button } from "@/src/components/ui/Button"
import { Card } from "@/src/components/ui/Card"
import { Dialog } from "@/src/components/ui/Dialog"
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon"
import { Badge } from "@/src/components/ui"

import { getTodayInBrasilia } from "@/src/lib/scheduling"
import { toast } from "@/src/lib/toast-store"

import pet_avatar_placeholder from "@/public/pet-avatar-placeholder.webp"

interface Pet {
    id: string;
    name: string;
    species: string;
    gender: string;
    breed: string;
    birthDate: string;
    weight: number;
    coatColor: string;
    chip?: string;
    adoptionStatus: string;
    isTemporaryHome: boolean;
}

interface NeuteringAppointment {
    id: string;
    scheduleDate: string;
    period: "MORNING" | "AFTERNOON";
    status: "PENDING" | "AWAITING_EXAMS" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "NO_SHOW";
    pet: {
        name: string;
        species: string;
        gender: string;
        breed: string;
    }
}

// Mapa de status injetando classes diretas do Tailwind para criar Badges manuais
const statusMap: Record<string, { label: string; classes: string }> = {
    PENDING: { label: "Pendente", classes: "bg-yellow-100 text-yellow-800 border-yellow-200" },
    AWAITING_EXAMS: { label: "Aguardando Exames", classes: "bg-blue-100 text-blue-800 border-blue-200" },
    CONFIRMED: { label: "Confirmado", classes: "bg-green-100 text-green-800 border-green-200" },
    COMPLETED: { label: "Concluído", classes: "bg-emerald-100 text-emerald-800 border-emerald-200" },
    CANCELLED: { label: "Cancelado", classes: "bg-gray-100 text-gray-800 border-gray-200" },
    NO_SHOW: { label: "Não Compareceu", classes: "bg-red-100 text-red-800 border-red-200" },
};

/* main component */
const NeuteringContent = () => {
    const searchParams = useSearchParams();
    const petIdParam = searchParams.get("petId") || "";
    
    /* states for initial data */
    const [pets, setPets] = useState<Pet[]>([]);
    const [appointments, setAppointments] = useState<NeuteringAppointment[]>([]);

    /* scheduling states */
    const [selectedPetId, setSelectedPetId] = useState(petIdParam);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedPeriod, setSelectedPeriod] = useState<"MORNING" | "AFTERNOON" | "">("");

    /* loading states */
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCanceling, setIsCanceling] = useState<string | null>(null);

    /* dialog state */
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
    const datePickerTodayDate = getTodayInBrasilia();

    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setIsLoading(true);

            const [petsResponse, appointmentsResponse] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/me`, { credentials: "include" }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/neuterings/me`, { credentials: "include" })
            ]);

            if (!petsResponse.ok || !appointmentsResponse.ok) {
                const [petsData, appointmentsData] = await Promise.all([
                    petsResponse.json(),
                    appointmentsResponse.json()
                ]);
                const message = !petsResponse.ok ? petsData.message : appointmentsData.message;
                throw new Error(message || "Falha ao carregar os dados iniciais.");
            }
            
            const [petsData, appointmentsData] = await Promise.all([
                petsResponse.json(),
                appointmentsResponse.json()
            ]);

            setPets(petsData);
            setAppointments(appointmentsData);

        } catch (err: unknown) { 
            if (err instanceof Error) {
                toast.warning(err.message);
                return;
            }
            toast.warning("Erro desconhecido ao carregar dados da página.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateAppointment = async () => {
        if (!selectedPetId || !selectedDate || !selectedPeriod) {
            toast.warning("Preencha todos os campos para agendar.");
            return;
        }

        try {
            setIsSubmitting(true);

            const utcDate = new Date(Date.UTC(
                selectedDate.getFullYear(), 
                selectedDate.getMonth(), 
                selectedDate.getDate()
            ));

            const payload = {
                petId: selectedPetId,
                scheduleDate: utcDate.toISOString(),
                period: selectedPeriod,
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/neuterings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erro ao solicitar castração.");
            }

            toast.success("Solicitação de castração enviada com sucesso!");
            setIsDialogOpen(false);
            setSelectedDate(undefined);
            setSelectedPeriod("");
            
            loadInitialData();

        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.warning(err.message);
                return;
            }
            toast.warning("Erro desconhecido ao solicitar castração.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancelAppointment = async (appointmentId: string) => {
        try {
            setIsCanceling(appointmentId);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/neuterings/${appointmentId}/cancel`, {
                method: "PATCH",
                credentials: "include"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Erro ao cancelar agendamento.");
            }

            toast.success("Agendamento cancelado com sucesso.");
            loadInitialData();

        } catch (err: unknown) {
            if (err instanceof Error) {
                toast.warning(err.message);
                return;
            }
            toast.warning("Erro desconhecido ao cancelar.");
        } finally {
            setIsCanceling(null);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full flex justify-center items-center h-64">
                <SpinnerIcon />
            </div>
        );
    }

    const activePet = pets.find(p => p.id === selectedPetId);

    return (
        <>
            <div className="w-full flex flex-col p-4 md:p-6">
                <div className="w-full flex justify-between items-center flex-wrap gap-y-2">
                    <h1 className="text-default-fg font-semibold text-xl sm:text-2xl lg:text-3xl text-center lg:text-start">
                        Agendamento de castração
                    </h1>
                </div>

                <p className="text-muted-fg text-sm sm:text-base pt-4 pb-6 max-w-164">
                    Nesta página você pode fazer pedidos de castração para o seu pet. O agendamento está sujeito a aprovação 
                    e limites de vagas disponíveis por dia e espécie.
                </p>

                <div className="flex flex-col w-full gap-8 items-start pb-8">
                    
                    <div className="flex flex-col sm:flex-row w-full gap-4 max-w-2xl">
                        <div className="flex flex-col w-full sm:w-1/2 gap-2">
                            <Label htmlFor="pet">Selecione o pet</Label>
                            <Select 
                                id="pet"
                                placeholder="Selecione um pet..."
                                value={selectedPetId}
                                variant="primary"
                                className="w-full"
                                selectClassName="rounded-full!"
                                onChange={(id) => {
                                    setSelectedPetId(id); 
                                    setIsDialogOpen(false);
                                    setSelectedDate(undefined);
                                }}
                                options={
                                    pets.map(p => ({ value: p.id, label: p.name }))  
                                }
                            />
                        </div>

                        <div className="flex flex-col w-full sm:w-1/2 gap-2">
                            <Label htmlFor="date">Data da castração</Label>
                            <DatePicker
                                className="w-full"
                                id="date"
                                value={selectedDate}
                                placeholder="Selecione no calendário"
                                disabled={!selectedPetId}
                                disabledBefore={datePickerTodayDate} 
                                onChange={(date: Date | undefined) => {
                                    setSelectedDate(date);
                                    if (date) setIsDialogOpen(true);
                                }}
                            />
                        </div>
                    </div>

                    <div className="w-full max-w-2xl">
                        <Label className="pb-2 block">Detalhes do pet selecionado</Label>
                        <Card 
                            className="w-full" 
                            size="md"
                        >
                            <div className="flex w-full">
                                <Image 
                                    className="max-w-24 self-start rounded-full object-cover"
                                    src={pet_avatar_placeholder}
                                    alt="Foto de perfil do pet"
                                />
                                <div className="flex flex-col w-full pl-4 justify-center"> 
                                    {activePet ? (
                                        <>
                                            <div className="flex w-full items-center justify-between gap-2 pb-2">
                                                <div className="flex justify-between items-center gap-2">
                                                    <h3 className="font-medium text-base text-default-fg truncate">
                                                        {activePet.name}
                                                    </h3>
                                                    <Badge
                                                        variant="primary"
                                                        size="sm"
                                                        pill="true"
                                                    >
                                                        {activePet.species}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs sm:text-sm text-muted-fg flex">
                                                    {activePet.isTemporaryHome ? "Lar temporário " : "" }
                                                    {activePet.adoptionStatus}
                                                </p>
                                            </div>      
                                            <div className="flex flex-wrap w-full justify-between gap-2 pb-2">
                                                <div className="flex flex-col max-w-48">   
                                                    <p className="text-xs sm:text-sm text-muted-fg flex">
                                                        Raça: {activePet.breed}
                                                    </p>
                                                    <p className="text-xs sm:text-sm text-muted-fg flex">
                                                        Gênero: {activePet.gender === "MALE" ? "Macho" : "Fêmea"}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col">   
                                                    <p className="text-xs sm:text-sm text-muted-fg flex">
                                                        Peso: {activePet.weight} kg
                                                    </p>
                                                    <p className="text-xs sm:text-sm text-muted-fg flex">
                                                        Pelagem: {activePet.coatColor}
                                                    </p>
                                                </div>
                                            </div>                          
                                            <div className="flex flex-wrap gap-2 pb-2">  
                                                <p className="text-xs sm:text-sm text-muted-fg flex">
                                                    Nascimento: {new Date(activePet.birthDate).toLocaleDateString()}
                                                </p>
                                                <p className="text-xs sm:text-sm text-muted-fg flex">
                                                    Identificação: {activePet.chip === "NO_CHIP" || !activePet.chip ? "Sem chip." : activePet.chip}
                                                </p>
                                            </div>
                                        </>
                                    ) : (
                                        <div className="flex h-full w-full items-center text-muted-fg text-sm italic">
                                            Aguardando seleção de pet...
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="w-full pt-8 border-t border-default-border">
                    <h2 className="text-default-fg font-bold text-lg sm:text-xl pb-6">
                        Histórico de agendamentos
                    </h2>
                    
                    {appointments.length === 0 ? (
                        <p className="text-muted-fg text-sm">Você ainda não possui solicitações de castração.</p>
                    ) : (
                        <div className="flex flex-col w-full gap-4">
                            {appointments.map((appt) => {
                                const statusInfo = statusMap[appt.status] || { label: appt.status, classes: "bg-gray-100 text-gray-800 border-gray-200" };
                                const canCancel = ["PENDING", "CONFIRMED", "AWAITING_EXAMS"].includes(appt.status);

                                return (
                                    <Card 
                                        key={appt.id} 
                                        size="sm"
                                        className="flex flex-row flex-wrap p-4 gap-4 items-start sm:items-center justify-between w-full"
                                    >
                                        <div className="flex items-center flex-wrap gap-y-1 gap-x-4 w-full justify-between">
                                            <div className="flex">
                                                <Image 
                                                    src={pet_avatar_placeholder} 
                                                    className="w-12 h-12 rounded-full object-cover" 
                                                    alt="Avatar" 
                                                />
                                                <div className="flex flex-col">
                                                    <h3 className="font-semibold text-default-fg truncate">{appt.pet.name}</h3>
                                                    <p className="text-xs text-muted-fg">
                                                        {appt.pet.species === "DOG" ? "Cachorro" : "Gato"} • {appt.pet.gender === "MALE" ? "Macho" : "Fêmea"}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm text-default-fg">
                                                    <span className="text-muted-fg">Data:</span> {appt.scheduleDate.split("T")[0].split("-").reverse().join("/")}
                                                </p>
                                                <p className="text-sm text-default-fg">
                                                    <span className="text-muted-fg">Período:</span> {appt.period === "MORNING" ? "Manhã" : "Tarde"}
                                                </p>
                                            </div>

                                                <div className="flex">
                                                    <span className={`px-3 py-1 border text-xs font-semibold rounded-full whitespace-nowrap ${statusInfo.classes}`}>
                                                        {statusInfo.label}
                                                    </span>
                                                </div>
                                                <div className="flex">
                                                {canCancel ? (
                                                    <Button 
                                                        variant="danger" 
                                                        size="sm" 
                                                        onClick={() => handleCancelAppointment(appt.id)}
                                                        disabled={isCanceling === appt.id}
                                                    >
                                                        {isCanceling === appt.id ? <SpinnerIcon /> : "Cancelar Castração"}
                                                    </Button>
                                                ) : (
                                                    <span className="text-xs text-muted-fg italic">Sem ações disponíveis</span>
                                                )}
                                            </div>
                                        </div>


                                        

                                    </Card>
                                )
                            })}
                        </div>
                    )}
                </div>

                <Dialog 
                    size="md"
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    title="Concluir agendamento"
                >
                    <div className="flex flex-col gap-4">
                        <p className="text-sm text-muted-fg">
                            Escolha o período desejado para a castração do seu pet no dia <strong>{selectedDate?.toLocaleDateString()}</strong>.
                        </p>
                        
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="period">Período</Label>
                            <Select 
                                id="period"
                                value={selectedPeriod}
                                onChange={(val: any) => setSelectedPeriod(val)}
                                options={[
                                    { value: "MORNING", label: "Manhã" },
                                    { value: "AFTERNOON", label: "Tarde" }
                                ]}
                                placeholder="Selecione um período..."
                            />
                        </div>

                        <div className="flex justify-end gap-2 mt-4">
                            <Button 
                                variant="outline" 
                                onClick={() => setIsDialogOpen(false)}
                                disabled={isSubmitting}
                            >
                                Voltar
                            </Button>
                            <Button 
                                variant="primary" 
                                onClick={handleCreateAppointment}
                                disabled={isSubmitting || !selectedPeriod}
                            >
                                {isSubmitting ? <SpinnerIcon /> : "Confirmar Agendamento"}
                            </Button>
                        </div>
                    </div>
                </Dialog>
            </div>   
        </>
    )
}

export default function NeuteringPage() {
  return (
    <Suspense 
        fallback={
            <div className="w-full flex justify-center items-center h-screen">
                <SpinnerIcon />
            </div>
        }
    >
        <NeuteringContent />
    </Suspense>
  )
}