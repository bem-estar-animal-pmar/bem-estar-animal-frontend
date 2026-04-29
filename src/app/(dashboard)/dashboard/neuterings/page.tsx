"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"

import Image from "next/image"
import pet_avatar_placeholder from "@/public/pet-avatar-placeholder.webp"

import { ApiError } from "@/src/lib/api-error"
// Removido getTodayInBrasilia
import { translateError } from "@/src/lib/error-map"
import { translateTable } from "@/src/lib/table-map"

import type { Pet, NeuteringAppointment } from "@/src/constants/interfaces"
import { neuteringStatusMap } from "@/src/constants/constants"

// Removido DatePicker do import
import { Badge, TextLink, Accordion, Label, Select, Button, Card, Dialog } from "@/src/components/ui"
import { CreateNeuteringForm } from "@/src/components/features/dashboard/CreateNeuteringForm"
import { toast } from "@/src/lib/toast-store"
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon"

/* main component */
const NeuteringContent = () => {
    const searchParams = useSearchParams();
    const petIdParam = searchParams.get("petId") || "";
    
    /* states for initial data */
    const [pets, setPets] = useState<Pet[]>([]);
    const [appointments, setAppointments] = useState<NeuteringAppointment[]>([]);

    /* scheduling states */
    const [selectedPetId, setSelectedPetId] = useState(petIdParam);

    /* loading states */
    const [isLoading, setIsLoading] = useState(true);
    const [isCanceling, setIsCanceling] = useState<string | null>(null);

    /* dialog state */
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    
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
                const data = !petsResponse.ok ? petsData : appointmentsData;
                throw new ApiError(data.message, data.code, data.details);
            };
            
            const [petsData, appointmentsData] = await Promise.all([
                petsResponse.json(),
                appointmentsResponse.json()
            ]);

            setPets(petsData);
            setAppointments(appointmentsData);

        } catch (err: unknown) { 
            if (err instanceof ApiError) {
                if (err.details) {
                    const firstError = err.details[0]?.message
                    toast.danger(translateError(err.message), {
                        message: translateError(firstError)
                    })
                    return;
                }
                toast.danger(translateError(err.message));
                return;
            }
            toast.danger("Erro desconhecido ao carregar dados.");
        } finally {
            setIsLoading(false);
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
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success("Agendamento cancelado com sucesso.");
            loadInitialData();

        } catch (err: unknown) {
            if (err instanceof ApiError) {
                if (err.details) {
                    const firstError = err.details[0]?.message
                    toast.warning(translateError(err.message), {
                        message: translateError(firstError)
                    })
                    return;
                }
                toast.warning(translateError(err.message));
                return
            }
            toast.danger("Erro desconhecido ao cancelar.");
        } finally {
            setIsCanceling(null);
        }
    };

    const handleNeuteringCreated = () => {
        setIsDialogOpen(false);
        loadInitialData();
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
            <div className="w-full flex flex-col">
                <div className="w-full flex justify-between items-center flex-wrap gap-y-2 pb-4">
                    <h1 className="text-default-fg font-semibold text-xl sm:text-2xl lg:text-3xl text-center lg:text-start">
                        Agendamento de <span className="text-primary-fg">castração</span>
                    </h1>
                </div>

                <p className="text-muted-fg text-sm sm:text-base pb-8">
                    Nesta página você pode realizar pedidos de castração para o seu pet. O agendamento está sujeito a aprovação 
                    e limites de vagas disponíveis por dia e espécie. Certifique-se de ter lido as {" "}
                    <TextLink 
                        href={`/rules/neutering-rules${ petIdParam ? `?petId=${petIdParam}` : ""}`} 
                        variant="primary"
                        className="underline! text-sm! sm:text-base!"
                    >
                         regras de agendamento de castração
                    </TextLink>  {" "}
                    antes de prosseguir.
                </p>

                <div className="flex flex-col w-full gap-8 mb-4 md:mb-8 items-center border-2 border-dashed border-primary-border rounded-xl p-4">
                    <div className="flex flex-col sm:flex-row w-full gap-4 max-w-2xl items-end">
                        <div className="flex flex-col w-full gap-2">
                            <Label htmlFor="pet">Selecione o pet</Label>
                            <div className="flex gap-4 w-full items-center">
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
                                    }}
                                    options={
                                        pets.map(p => ({ value: p.id, label: p.name }))  
                                    }
                                />
                                <Button 
                                    onClick={() => setIsDialogOpen(true)}
                                    disabled={!selectedPetId}
                                    variant="primary"
                                    pill="true"
                                    className="w-full max-w-48"
                                    size="md"
                                >
                                    Solicitar Castração
                                </Button>
                            </div>

                        </div>
                    </div>

                    <div className="w-full max-w-2xl">
                        <Label className="pb-2 block">Detalhes do pet selecionado</Label>
                        <Card 
                            className="w-full shadow-sm!" 
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
                                                        {translateTable(activePet.species)}
                                                    </Badge>
                                                </div>
                                                <p className="text-xs sm:text-sm text-muted-fg flex">
                                                    {translateTable(activePet.adoptionStatus)}
                                                </p>
                                            </div>      
                                            <div className="flex flex-wrap w-full justify-between gap-2 pb-2">
                                                <div className="flex flex-col max-w-48">   
                                                    <p className="text-xs sm:text-sm text-muted-fg flex">
                                                        Raça: {translateTable(activePet.breed)}
                                                    </p>
                                                    <p className="text-xs sm:text-sm text-muted-fg flex">
                                                        Gênero: {translateTable(activePet.gender)}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col">   
                                                    <p className="text-xs sm:text-sm text-muted-fg flex">
                                                        Peso: {activePet.weight} kg ({translateTable(activePet.size)})
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

                <div className="w-full p-4 md:p-6 border border-primary-border rounded-md mb-8">
                    <h2 className="text-default-fg font-bold text-lg sm:text-xl pb-6">
                        Histórico de agendamentos
                    </h2>
                    
                    {appointments.length === 0 ? (
                        <p className="text-muted-fg text-sm">Você ainda não possui solicitações de castração.</p>
                    ) : (
                        <div className="flex flex-col w-full gap-4">
                            {appointments.map((appt) => {
                                const statusInfo = neuteringStatusMap[appt.status] || { label: appt.status, classes: "bg-gray-100 text-gray-800 border-gray-200" };
                                const canCancel = ["PENDING", "CONFIRMED", "AWAITING_EXAMS"].includes(appt.status);
                                const displayDate = appt.scheduleDate ? appt.scheduleDate.split("T")[0].split("-").reverse().join("/")  : "Aguardando data";
                                const period = appt.period ? translateTable(appt.period) : ""

                                return (
                                    <Card 
                                        key={appt.id} 
                                        size="sm"
                                        className="flex flex-row flex-wrap p-4 gap-4 items-start sm:items-center justify-between shadow-sm!"
                                    >
                                        <div className="flex items-center flex-wrap gap-y-1 gap-x-4 w-full justify-between">
                                            <div className="flex">
                                                <Image 
                                                    src={pet_avatar_placeholder} 
                                                    className="w-12 h-12 rounded-full object-cover" 
                                                    alt="Avatar" 
                                                />
                                                <div className="flex flex-col pl-3">
                                                    <h3 className="font-semibold text-default-fg truncate">{appt.pet.name}</h3>
                                                    <p className="text-xs text-muted-fg">
                                                       {translateTable(appt.pet.species)} • {translateTable(appt.pet.gender)}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col gap-1 text-xs w-full max-w-30">
                                                 <p className="text-default-fg font-medium">{displayDate}</p>
                                                {appt.period && (
                                                    <p className="text-muted-fg">Período: {period}</p>
                                                )}
                                            </div>

                                            <Badge
                                                className={` ${statusInfo.classes}`}
                                            >
                                                {statusInfo.label}
                                            </Badge>
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

                <Accordion 
                    title="Informações sobre o processo de castração"
                    size="md"
                    className="shadow-none!"
                >
                    <p className="text-muted-fg text-xs sm:text-sm pb-2">
                        Ao fazer a solicitação, o pedido ficará como pendente será avaliado pela clínica e entraremos em contato para confirmá-lo.  Após 
                        o agendamento ser confirmado, o solicitante deve levar o animal à clínica no dia e período combinados. 
                    </p>
                    <p className="text-muted-fg text-xs sm:text-sm">
                        Excessões são casos onde os animais precisam de exames (ler regras), nesse caso os pedidos ficam como 'aguardando 
                        exames', e o solicitante deve realizá-los e entrar em contato com a clínica para confirmar o agendamento.
                    </p>
                </Accordion>

                <Dialog 
                    size="md"
                    isOpen={isDialogOpen}
                    onClose={() => setIsDialogOpen(false)}
                    title="Concluir solicitação"
                >
                    {/* REMOVIDO: scheduleDate={selectedDate} */}
                    <CreateNeuteringForm
                        onCancel={() => setIsDialogOpen(false)}
                        onSuccess={handleNeuteringCreated}
                        petId={selectedPetId}
                    />
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