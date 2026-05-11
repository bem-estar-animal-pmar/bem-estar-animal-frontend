"use client";

import { useState, useEffect, use } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/error-map";
import { translateTable } from "@/src/lib/table-map";
import { formatRequestNumber } from "@/src/lib/request-formatter";
import type { AdminNeuteringAppointmentById } from "@/src/constants/interfaces";

import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import { UpdateNeuteringForm } from "@/src/components/features/admin-dashboard/UpdateNeuteringForm";
import { MedicalRecordSection } from "@/src/components/features/admin-dashboard/MedicalRecordSection";
import { ButtonLink, Card, TextLink } from "@/src/components/ui";
import { NeuteringCalendar } from "@/src/components/features/dashboard/NeuteringCalendar";
import { DetailsField } from "@/src/components/ui/DetailsField";
import { PrintIcon } from "@/src/components/icons/outline";

export default function AdminNeuteringDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: appointmentId } = use(params);
    const [appointment, setAppointment] = useState<AdminNeuteringAppointmentById | null>(null);
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
                    const firstError = err.details[0]?.message || ""
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
            <section className="flex w-full flex-wrap justify-between items-center border-b border-default-border mb-4 pb-2">
                <div className="flex flex-col pb-4">
                    <h1 className="font-semibold text-xl sm:text-xl lg:text-2xl text-default-fg">
                        <TextLink
                            href="/admin/dashboard/neuterings"
                            variant="primary"
                            className="font-semibold! text-xl! sm:text-xl! lg:text-2xl!"
                        >
                            Castrações
                        </TextLink>
                        {" "} - Agendamento Nº: {formatRequestNumber("NEUTERING", appointment.requestNumber)}
                    </h1>
                    <p className="text-muted-fg text-sm sm:text-base">
                        Visualize as informações e gerencie o agendamento do pet {appointment.pet.name}.
                    </p>
                </div>
                <div className="flex flex-col gap-4 items-center">
                    <ButtonLink 
                        href={`/neutering-template?id=${appointment.id}`}
                        target="_blank"
                        variant="outline" 
                    >
                        <span className="flex gap-2 items-center">
                            <PrintIcon /> Imprimir formulário de castração
                        </span>
                    </ButtonLink>
                </div>
            </section>
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-284">
                <div className="flex flex-col gap-4 w-full">
                    <Card
                        size="lg"
                        className="shadow-sm!"
                    >
                        <h3 className="text-base lg:text-lg font-semibold pb-4">
                            Gerenciar Agendamento
                        </h3>
                        <UpdateNeuteringForm 
                            appointment={appointment} 
                            onSuccess={handleAppointmentUpdate}
                        />
                    </Card>      
                    <MedicalRecordSection 
                        medicalRecord={appointment.medicalRecord} 
                        onUpdateSuccess={handleMedicalRecordUpdate} 
                    />
                </div>
                <div className="flex flex-col w-full gap-4 md:max-w-104">
                    <NeuteringCalendar />
                    <Card
                        size="lg"
                        className="shadow-sm! flex flex-col gap-4"
                    >
                        <h3 className="text-lg font-semibold pb-2 border-b border-default-border">
                            Dados do Animal
                        </h3>
                        <div className="flex flex-row gap-4">
                            <DetailsField title="Nome">
                                {appointment.pet.name}
                            </DetailsField>
                            <DetailsField title="Nº do chip">
                                {translateTable(appointment.pet.chip === "NO_CHIP" ? "Sem chip" : appointment.pet.chip)}
                            </DetailsField>
                        </div>
                        <div className="flex flex-row gap-4">
                            <DetailsField className="w-1/2!" title="Espécie">
                                {translateTable(appointment.pet.species)}
                            </DetailsField>
                            <DetailsField className="w-1/2!" title="Gênero">
                                {translateTable(appointment.pet.gender)}
                            </DetailsField>
                        </div>
                        <div className="flex flex-row gap-4">
                            <DetailsField className="w-2/4!" title="Porte">
                                {translateTable(appointment.pet.size)}
                            </DetailsField>
                            <DetailsField className="w-2/4!" title="Raça">
                                {translateTable(appointment.pet.breed)}
                            </DetailsField>
                        </div>
                    </Card>
                    <Card
                        size="lg"
                        className="shadow-sm flex flex-col gap-4"
                    >
                        <h3 className="text-lg font-semibold border-b border-default-border pb-2">
                            Contato do Solicitante
                        </h3>
                        <div className="flex gap-4">
                            <DetailsField title="Nome completo">
                                {appointment.user.name} {appointment.user.lastName}
                            </DetailsField>
                            <DetailsField title="Telefone / celular">
                                {appointment.user.phone}
                            </DetailsField>
                        </div>
                        <DetailsField title="E-mail">
                            {appointment.user.email}
                        </DetailsField>
                        <div className="flex flex-col w-full gap-4">
                            <h3 className="text-base font-semibold">
                                Informações de endereço
                            </h3>
                            <div className="flex gap-2">
                                <div className="pb-2 w-1/3"> 
                                    <DetailsField title="CEP">
                                        {appointment.user.cep}
                                    </DetailsField>
                                </div>
                                <div className="pb-2 w-2/3">
                                    <DetailsField title="Cidade">
                                        {appointment.user.city}
                                    </DetailsField>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="pb-2 w-3/4">
                                    <DetailsField title="Rua">
                                        {appointment.user.street}
                                    </DetailsField>
                                </div>

                                <div className="pb-2 w-1/4">
                                    <DetailsField title="Número">
                                        {appointment.user.number}
                                    </DetailsField>
                                </div>
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex gap-2">
                                    <div className="pb-2 w-2/3">
                                        <DetailsField title="Bairro">
                                            {appointment.user.neighborhood}
                                        </DetailsField>
                                    </div>
                                    <div className="pb-2 w-1/3">
                                        <DetailsField title="Estado">
                                            {appointment.user.state}
                                        </DetailsField>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}