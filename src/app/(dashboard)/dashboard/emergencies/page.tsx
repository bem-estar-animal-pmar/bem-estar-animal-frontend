"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { ApiError } from "@/src/lib/api-error"
import { toast } from "@/src/lib/toast-store"

import { Card } from "@/src/components/ui/Card"
import { Badge } from "@/src/components/ui"
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon"
import { CreateEmergencyForm } from "@/src/components/features/dashboard/CreateEmergencyForm"

import { Pet, EmergencyAppointment } from "@/src/constants/interfaces"
import { emergencyStatusMap } from "@/src/constants/constants"

const EmergencyContent = () => {
    const searchParams = useSearchParams();
    const petIdParam = searchParams.get("petId") || "";

    const [pets, setPets] = useState<Pet[]>([]);
    const [appointments, setAppointments] = useState<EmergencyAppointment[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadInitialData();
    }, []);

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
                        Atendimento de <span className="text-primary-fg">emergência</span>
                    </h1>
                </div>

                <p className="text-muted-fg text-sm sm:text-base pb-1">
                    Este serviço é destinado ao socorro de animais em situação de rua ou casos graves de pets já cadastrados. 
                </p>
                <p className="text-muted-fg text-sm sm:text-base pb-4">
                    Nossa equipe avaliará a gravidade e a disponibilidade de vagas para definir o horário do atendimento. Por favor, forneça o máximo de detalhes possível.     
                </p>

                <section className="pb-8">
                    <h2 className="text-default-fg font-bold text-lg sm:text-xl mb-4">Como funciona o atendimento?</h2>
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
                                const statusInfo = emergencyStatusMap[appt.status];
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
                <CreateEmergencyForm 
                    pets={pets} 
                    defaultPetId={petIdParam} 
                    onSuccess={loadInitialData} 
                />
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
                            const statusInfo = emergencyStatusMap[appt.status];
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