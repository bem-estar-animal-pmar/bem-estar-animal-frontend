"use client";

import { useState, useEffect, use } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/error-map";
import { translateTable } from "@/src/lib/table-map";
import { formatRequestNumber } from "@/src/lib/request-formatter";

import type { AdminEmergencyAppointmentById, TriageAnswer } from "@/src/constants/interfaces";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import { UpdateEmergencyForm } from "@/src/components/features/admin-dashboard/UpdateEmergencyForm";
import { MedicalRecordSection } from "@/src/components/features/admin-dashboard/MedicalRecordSection";
import { ButtonLink, Card, TextLink } from "@/src/components/ui";
import { DetailsField } from "@/src/components/ui/DetailsField";
import { PrintIcon } from "@/src/components/icons/outline";

export default function AdminEmergencyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: appointmentId } = use(params);
    const [appointment, setAppointment] = useState<AdminEmergencyAppointmentById | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchAppointment = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emergencies/details/${appointmentId}`, {
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
            toast.danger("Erro desconhecido ao carregar emergência.");
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
                Pedido de emergência não encontrado.
            </div>
        );
    }

    /* if there is already a pet for the emergency we use its data */
    const petName = appointment.pet?.name || appointment.name;
    const petSpecies = appointment.pet?.species || appointment.species;
    const petGender = appointment.pet?.gender || appointment.gender;
    const petSize = appointment.pet?.size || appointment.size;
    const petBreed = appointment.pet?.breed || "Não informado";
    const petChip = appointment.pet?.chip && appointment.pet.chip !== "NO_CHIP" ? appointment.pet.chip : "Sem chip";
    const isNeutered = appointment.pet?.isNeutered || "";
    
    const triage = appointment.triageData;

    return (
        <div className="w-full flex flex-col items-center">
            <section className="flex w-full flex-wrap justify-between items-center border-b border-default-border mb-4 pb-2">
                <div className="flex flex-col pb-4">
                    <h1 className="font-semibold text-xl sm:text-xl lg:text-2xl text-default-fg">
                        <TextLink
                            href="/admin/dashboard/emergencies"
                            variant="primary"
                            className="font-semibold! text-xl! sm:text-xl! lg:text-2xl!"
                        >
                            Emergências
                        </TextLink>
                        {" "} - Agendamento Nº: {formatRequestNumber("EMERGENCY", appointment.requestNumber)}
                    </h1>
                    <p className="text-muted-fg text-sm sm:text-base">
                        Visualize e gerencie a emergência médica solicitada para {petName}.
                    </p>
                </div>
                <div className="flex gap-4 items-center">
                    <ButtonLink 
                        href={`/emergency-triage-template?id=${appointment.id}`}
                        variant="outline" 
                        target="_blank"
                    >
                        <span className="flex gap-2 items-center">
                            <PrintIcon /> Ficha de triagem
                        </span>
                    </ButtonLink>
                    <ButtonLink 
                        href={`/emergency-template?id=${appointment.id}`}
                        variant="outline" 
                        target="_blank"
                    >
                        <span className="flex gap-2 items-center">
                            <PrintIcon /> Formulário de emergência
                        </span>
                    </ButtonLink>
                </div>
            </section>
            
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-284">
                <div className="flex flex-col gap-4 w-full">
                    <Card size="lg" className="shadow-sm!">
                        <h3 className="text-base lg:text-lg font-semibold pb-4">Gerenciar Emergência</h3>
                        <UpdateEmergencyForm 
                            appointment={appointment} 
                            onSuccess={handleAppointmentUpdate}
                        />
                    </Card>      
                
                    {triage && (
                        <Card size="lg" className="shadow-sm! flex flex-col gap-4">
                            <h3 className="text-lg font-semibold border-b border-default-border pb-2">
                                Ficha de Triagem Rápida
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-80 overflow-y-auto">
                                <DetailsField title="Castrado?">{translateTable(triage.isNeutered || "Não informado")}</DetailsField>
                                <DetailsField title="Consciente?">{translateTable(triage.isConscious || "Não informado")}</DetailsField>
                                <DetailsField title="Cabeça levantada?">{translateTable(triage.isHeadRaised || "Não informado")}</DetailsField>
                                
                                <DetailsField title="Sangrando?">
                                    {translateTable(triage.isBleeding || "Não informado")} 
                                    {triage.isBleeding === "YES" && triage.bleedingLocation ? ` (${triage.bleedingLocation})` : ""}
                                </DetailsField>

                                <DetailsField title="Em pé?">{translateTable(triage.isStanding || "Não informado")}</DetailsField>
                                <DetailsField title="Ficou em pé?">{translateTable(triage.hasStoodUp || "Não informado")}</DetailsField>
                                
                                <DetailsField title="Apoia as patas?">
                                    {translateTable(triage.supportsAllPaws || "Não informado")}
                                    {triage.supportsAllPaws === "NO" && triage.unsupportedPaw ? ` (${triage.unsupportedPaw})` : ""}
                                </DetailsField>

                                <DetailsField title="Já andou?">{translateTable(triage.hasWalked || "Não informado")}</DetailsField>
                                
                                <DetailsField title="Osso exposto?">
                                    {translateTable(triage.hasExposedBone || "Não informado")}
                                    {triage.hasExposedBone === "YES" && triage.exposedBone ? ` (${triage.exposedBone})` : ""}
                                </DetailsField>

                                <DetailsField title="Dificuldade de respirar?">{translateTable(triage.breathingDifficulty || "")}</DetailsField>
                                <DetailsField title="Já comeu?">{translateTable(triage.hasEaten || "Não informado")}</DetailsField>
                                <DetailsField title="Bebeu água?">{translateTable(triage.hasDrunk || "Não informado")}</DetailsField>
                                <DetailsField title="Vomitou?">{translateTable(triage.hasVomited || "Não informado")}</DetailsField>
                                <DetailsField title="Teve diarreia?">{translateTable(triage.hasDiarrhea || "Não informado")}</DetailsField>
  
                                <div className="flex flex-col gap-2">
                                    <DetailsField title="Dias de sintomas?">{triage.symptomsDuration || "Não informado"}</DetailsField>

                                    {triage.otherSymptoms && (
                                        <DetailsField title="Outros sintomas">
                                            {triage.otherSymptoms}
                                        </DetailsField>
                                    )}
                                </div>
                            </div>
                        </Card>
                    )}

                    <MedicalRecordSection 
                        medicalRecord={appointment.medicalRecord} 
                        onUpdateSuccess={handleMedicalRecordUpdate} 
                    />
                </div>
                
                <div className="flex flex-col w-full gap-4 md:max-w-104">
                    <Card size="lg" className="shadow-sm! flex flex-col gap-4">
                        <h3 className="text-lg font-semibold border-b border-default-border pb-2">
                            Detalhes da Emergência
                        </h3>
                        <DetailsField title="Descrição do quadro">
                            {appointment.description || "Nenhuma descrição fornecida."}
                        </DetailsField>
                        <DetailsField title="Está castrado?">
                            {isNeutered === "" ? "Sem informações" : isNeutered === true ? "Sim" : "Não" }
                        </DetailsField>
                            <div className="mt-2 text-xs">
                                {appointment.petId === null ?
                                    "Este é um animal de rua. O pet será registrado na conta do usuário no momento da conclusão do atendimento."
                                    :
                                    "Este atendimento possui um pet cadastrado, portanto o tutor tem permissão para agendar emergencias para esse pet"
                                }
                            </div>
                    </Card>

                    <Card 
                        size="lg" 
                        className="shadow-sm! flex flex-col gap-4"
                    >
                        <h3 className="text-lg font-semibold pb-2 border-b border-default-border">
                            Dados do animal
                        </h3>
                        <div className="flex flex-row gap-4">
                            <DetailsField className="w-1/2!" title="Nome">
                                {petName}
                            </DetailsField>
                            <DetailsField className="w-1/2!" title="Nº do chip">
                                {translateTable(petChip)}
                            </DetailsField>
                        </div>
                        <div className="flex flex-row gap-4">
                            <DetailsField className="w-1/2!" title="Espécie">
                                {translateTable(petSpecies)}
                            </DetailsField>
                            <DetailsField className="w-1/2!" title="Gênero">
                                {translateTable(petGender || "Não informado")}
                            </DetailsField>
                        </div>
                        <div className="flex flex-row gap-4">
                            <DetailsField className="w-1/2!" title="Porte">
                                {translateTable(petSize)}
                            </DetailsField>
                            <DetailsField className="w-1/2!" title="Raça">
                                {translateTable(petBreed)}
                            </DetailsField>
                        </div>
                    </Card>
                    
                    <Card size="lg" className="shadow-sm flex flex-col gap-4">
                        <h3 className="text-lg font-semibold border-b border-default-border pb-2">
                            Contato do solicitante
                        </h3>
                        <div className="flex gap-4">
                            <DetailsField title="Nome completo">
                                {appointment.user.name} {appointment.user.lastName}
                            </DetailsField>
                            <DetailsField title="Telefone">
                                {appointment.user.phone}
                            </DetailsField>
                        </div>
                        <DetailsField title="E-mail">
                            {appointment.user.email}
                        </DetailsField>
                        
                        <div className="flex flex-col w-full gap-4 mt-2">
                            <h3 className="text-base font-semibold">Endereço</h3>
                            <div className="flex gap-2">
                                <div className="pb-2 w-1/3"> 
                                    <DetailsField title="CEP">{appointment.user.cep}</DetailsField>
                                </div>
                                <div className="pb-2 w-2/3">
                                    <DetailsField title="Cidade">{appointment.user.city}</DetailsField>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="pb-2 w-2/3">
                                    <DetailsField title="Rua">{appointment.user.street}</DetailsField>
                                </div>
                                <div className="pb-2 w-1/3">
                                    <DetailsField title="Nº">{appointment.user.number}</DetailsField>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <div className="pb-2 w-2/3">
                                    <DetailsField title="Bairro">{appointment.user.neighborhood}</DetailsField>
                                </div>
                                <div className="pb-2 w-1/3">
                                    <DetailsField title="Estado">{appointment.user.state}</DetailsField>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}