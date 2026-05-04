"use client";

import { useState, useEffect, use } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/error-map";
import { translateTable } from "@/src/lib/table-map";

import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import { UpdateNeuteringForm } from "@/src/components/features/admin-dashboard/UpdateNeuteringForm";
import { MedicalRecordSection } from "@/src/components/features/admin-dashboard/MedicalRecordSection";
import { Card } from "@/src/components/ui";
import { NeuteringCalendar } from "@/src/components/features/dashboard/NeuteringCalendar";

export default function AdminNeuteringDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: appointmentId } = use(params);
    const [appointment, setAppointment] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAppointment = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/neuterings/details/${appointmentId}`, {
                credentials: "include",
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new ApiError(responseData.message, responseData.code, responseData.details);
            }
            
            setAppointment(responseData); 
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                if (err.details) {
                    const firstError = err.details[0]?.message
                    toast.danger(translateError(err.message), { message: firstError })
                    return;
                }
                toast.danger(translateError(err.message));
                return;
            }
            toast.danger("Erro desconhecido ao carregar agendamento.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (appointmentId) {
            fetchAppointment();
        }
    }, [appointmentId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <SpinnerIcon />
            </div>
        );
    }

    const handleAppointmentUpdate = (updatedFields: any) => {
        setAppointment((prev: any) => ({
            ...prev,
            ...updatedFields
        }));
    };

    const handleMedicalRecordUpdate = (updatedRecord: any) => {
        setAppointment((prev: any) => ({
            ...prev,
            medicalRecord: updatedRecord
        }));
    };

    if (!appointment) {
        return (
            <div className="p-8 text-center text-muted-fg">
                Agendamento não encontrado.
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex w-full flex-wrap justify-between items-center border-b border-default-border mb-4 pb-2">
                <div className="flex flex-col pb-4">
                    <h1 className="font-semibold text-xl sm:text-xl lg:text-2xl text-default-fg">
                        Informações do agendamento de castração
                    </h1>
                    <p className="text-muted-fg text-sm sm:text-base">
                        Visualize as informações e gerencie o agendamento do pet {appointment.pet?.name}.
                    </p>
                </div>
            </div>
            <div className="flex flex-col md:flex-row gap-4 w-full">
                <div className="w-full flex flex-col gap-4">
                    <Card
                        size="lg"
                        className="shadow-sm! max-w-208"
                    >
                        <h3 className="text-base lg:text-lg font-semibold pb-4">Gerenciar Agendamento</h3>
                        <UpdateNeuteringForm 
                            appointment={appointment} 
                            onSuccess={handleAppointmentUpdate}
                        />
                    </Card>        
                    <NeuteringCalendar />
                </div>
                <div className="w-full flex flex-col gap-4">
                    <Card
                        size="lg"
                        className="shadow-sm flex flex-col gap-4 lg:flex-row max-w-208"
                    >
                        <div className="flex-1 flex-col">
                            <h3 className="text-lg font-semibold pb-4">Detalhes do Pet</h3>
                            <div className="flex gap-6 mb-4">
                                <div className="flex flex-col flex-1">
                                    <p className="text-sm font-medium text-default-fg">Nome do pet</p>
                                    <span className="text-muted-fg text-xs sm:text-sm">{appointment.pet?.name}</span>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <p className="text-sm font-medium text-default-fg">Espécie</p>
                                    <span className="text-muted-fg text-xs sm:text-sm">{translateTable(appointment.pet?.species)}</span>
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <p className="text-sm font-medium text-default-fg">ID do Tutor</p>
                                <p className="text-muted-fg text-xs sm:text-sm break-all">{appointment.pet?.ownerId}</p>
                            </div>
                        </div>
                        <div className="flex-1 flex-col">
                            <h3 className="text-lg font-semibold pb-4">Contato do Solicitante</h3>
                            <div className="flex gap-6 mb-4">
                                <div className="flex flex-col flex-1">
                                    <span className="text-sm font-medium text-default-fg">Nome</span>
                                    <span className="text-muted-fg text-xs sm:text-sm">{appointment.user?.name}</span>
                                </div>
                                <div className="flex flex-col flex-1">
                                    <span className="text-sm font-medium text-default-fg">Telefone / Celular</span>
                                    <span className="text-muted-fg text-xs sm:text-sm">{appointment.user?.phone || "Não informado"}</span>
                                </div>
                            </div>
                            <div className="flex flex-col w-full">
                                <span className="text-sm font-medium text-default-fg">E-mail</span>
                                <span className="text-muted-fg text-xs sm:text-sm break-all">{appointment.user?.email}</span>
                            </div>
                        </div>
                    </Card>

                    <MedicalRecordSection 
                        medicalRecord={appointment.medicalRecord} 
                        onUpdateSuccess={handleMedicalRecordUpdate} 
                    />
                </div>
            </div>
        </div>
    );
}