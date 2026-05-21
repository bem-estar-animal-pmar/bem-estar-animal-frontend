"use client";

import { useState, useEffect } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError, translateTable } from "@/src/lib/translation-map";
import type { AdminEmergencyAppointmentById } from "@/src/constants/interfaces";
import { Button, Select, Label, DatePicker, Input, Dialog } from "@/src/components/ui";
import { AdminCreatePetForm } from "./AdminCreatePetForm"; 
import { CalendarIcon } from "../../icons/outline";
import { SpinnerIcon } from "../../icons/SpinnerIcon";

interface AdminUpdateEmergencyFormProps {
    appointment: AdminEmergencyAppointmentById;
    onSuccess: (updatedFields: any) => void;
}

type LoadingAction = "NO_SHOW" | "CANCEL" | "CONFIRM" | "COMPLETE" | "SAVE_DATE" | null;

const extractTime = (isoString?: string | null) => {
    if (!isoString) return "";
    const d = new Date(isoString);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
};

export const UpdateEmergencyForm = ({ appointment, onSuccess }: AdminUpdateEmergencyFormProps) => {
    const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
    const isLoading = loadingAction !== null;

    const [isEditing, setIsEditing] = useState(false);

    const [cancelWarningDialogOpen, setCancelWarningDialogOpen] = useState(false);
    const [noShowWarningDialogOpen, setNoShowWarningDialogOpen] = useState(false);
    const [createPetDialogOpen, setCreatePetDialogOpen] = useState(false);

    const initialDate = appointment.scheduleDate ? new Date(appointment.scheduleDate) : undefined;
    const initialTime = extractTime(appointment.scheduleDate);
    
    const [formData, setFormData] = useState({
        scheduleDate: initialDate as Date | undefined,
        scheduleTime: initialTime,
        period: appointment.period || "" 
    });

    const hasPet = !!appointment.pet || !!appointment.petId;

    useEffect(() => {
        setFormData({
            scheduleDate: appointment.scheduleDate ? new Date(appointment.scheduleDate) : undefined,
            scheduleTime: extractTime(appointment.scheduleDate),
            period: appointment.period || ""
        });
    }, [appointment]);

    const handleCancelEdit = () => {
        setFormData({
            scheduleDate: initialDate as Date | undefined,
            scheduleTime: initialTime,
            period: appointment.period || ""
        });
        setIsEditing(false);
    };

    const executeUpdate = async (newStatus: string, newDate: Date | undefined, newTime: string, newPeriod: string | undefined, actionName: LoadingAction, newPetId?: string) => {
        setLoadingAction(actionName);
        try {
            let formattedDate: string | undefined = undefined;
            if (newDate && newTime) {
                const combinedDate = new Date(newDate);
                const [hours, minutes] = newTime.split(':').map(Number);
                combinedDate.setHours(hours, minutes, 0, 0);
                formattedDate = combinedDate.toISOString();
            }

            const payload: any = {
                status: newStatus,
                period: newPeriod !== "" && newPeriod !== null ? newPeriod : undefined,
                scheduleDate: formattedDate,
            };

            console.log(payload)

            if (newPetId) {
                payload.petId = newPetId;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emergencies/status/${appointment.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success(newStatus === "CANCELLED" ? "Agendamento cancelado com sucesso!" : "Agendamento atualizado com sucesso!");
            setIsEditing(false);
            
            /* callback to send update fields to main page update */
            onSuccess({
                status: newStatus,
                period: newPeriod !== "" && newPeriod !== null ? newPeriod : undefined,
                scheduleDate: formattedDate,
                pet: newPetId ? { id: newPetId } : appointment.pet
            });
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível atualizar agendamento."
            });
        } finally {
            setLoadingAction(null);
        }
    };

    /* new function in case emergency didn't have a pet attached, after creating one, this will be called to finish the
    appointmnet */
    const handlePetCreated = async (newCreatedPetId: string) => {
        setCreatePetDialogOpen(false);
        await executeUpdate("COMPLETED", formData.scheduleDate, formData.scheduleTime, appointment.period, "COMPLETE", newCreatedPetId);
    };

    /* simple function to complete the appointment, if pet exists just execute update, if not, open pet create modal */
    const handleCompleteAction = () => {
        if (hasPet) {
            executeUpdate("COMPLETED", formData.scheduleDate, formData.scheduleTime, appointment.period, "COMPLETE");
            return;
        } 
        setCreatePetDialogOpen(true);
    };

    const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTime = e.target.value;
        let autoPeriod = formData.period; 

        if (newTime) {
            const hour = parseInt(newTime.split(':')[0], 10);
            autoPeriod = hour < 12 ? "MORNING" : "AFTERNOON";
        }

        setFormData({ 
            ...formData, 
            scheduleTime: newTime, 
            period: autoPeriod 
        });
    };

    const isFinalStatus = ["NO_SHOW", "COMPLETED", "CANCELLED"].includes(appointment.status);
    const isPendingOrAwaiting = appointment.status === "PENDING";
    const hasDateAndPeriod = appointment.scheduleDate && appointment.period;

    if (!isEditing) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <Label className="mb-1">Status da emergência</Label>
                        <Input 
                            readOnly 
                            disabled 
                            value={translateTable(appointment.status)} 
                            className="cursor-default! opacity-100!"
                        />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <div className="flex flex-col w-full sm:w-1/2">
                            <Label className="mb-1">Data e Hora</Label>
                            <Input 
                                readOnly 
                                disabled 
                                value={appointment.scheduleDate ? new Date(appointment.scheduleDate).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' }) : "Aguardando definição"} 
                                className="cursor-default! opacity-100!"
                            />
                        </div>
                        <div className="flex flex-col w-full sm:w-1/2">
                            <Label className="mb-1">Período</Label>
                            <Input 
                                readOnly 
                                disabled 
                                value={translateTable(appointment.period || "Aguardando definição")} 
                                className="cursor-default! opacity-100!"
                            />
                        </div>
                    </div>
                </div>
                
                <div className="flex justify-end gap-4 pt-4 border-t border-default-border items-center">
                    {isFinalStatus && (
                        <span className="text-sm text-default-500 font-medium w-full! text-center text-red-500">
                            Nenhuma ação disponível para este agendamento.
                        </span>
                    )}

                    {appointment.status === "CONFIRMED" && (
                        <Button 
                            variant="outline" 
                            onClick={() => setNoShowWarningDialogOpen(true)}
                            disabled={isLoading}
                            className="self-end! w-fit! border-danger-border! text-danger-fg! hover:bg-danger-border/10"
                        >
                            {loadingAction === "NO_SHOW" ? <span className="flex gap-2 items-center"><SpinnerIcon /> Processando...</span> : "Tutor ausente"}
                        </Button>
                    )}

                    {!isFinalStatus && (
                        <Button 
                            variant="outline" 
                            onClick={() => setCancelWarningDialogOpen(true)}
                            disabled={isLoading}
                            className="border-danger-border! text-danger-fg! hover:bg-danger-border/10"
                        >
                            {loadingAction === "CANCEL" ? <span className="flex gap-2 items-center"><SpinnerIcon /> Cancelando...</span> : "Cancelar emergência"}
                        </Button>
                    )}

                    {isPendingOrAwaiting && (
                        <>
                            <Button 
                                variant={hasDateAndPeriod ? "outline" : "primary"}
                                onClick={() => setIsEditing(true)} 
                                disabled={isLoading}
                            >
                                {hasDateAndPeriod ? 
                                    <span className="flex gap-2 items-center">
                                        <CalendarIcon /> Alterar data
                                    </span> 
                                    : 
                                    <span className="flex gap-2 items-center">
                                        <CalendarIcon /> Definir data
                                    </span>
                                }
                            </Button>

                            {hasDateAndPeriod && (
                                <Button 
                                    variant="primary" 
                                    onClick={() => executeUpdate("CONFIRMED", formData.scheduleDate, formData.scheduleTime, appointment.period, "CONFIRM")} 
                                    disabled={isLoading}
                                >
                                    {loadingAction === "CONFIRM" ? 
                                        <span className="flex gap-2 items-center"><SpinnerIcon /> Confirmando...</span> 
                                        : 
                                        "Confirmar emergência"
                                    }
                                </Button>
                            )}
                        </>
                    )}

                    {appointment.status === "CONFIRMED" && (
                        <Button 
                            variant="primary" 
                            onClick={handleCompleteAction} 
                            disabled={isLoading}
                        >
                            {loadingAction === "COMPLETE" ? <span className="flex gap-2 items-center"><SpinnerIcon /> Processando...</span> : "Marcar como concluído"}
                        </Button>
                    )}
                </div>

                <Dialog
                    isOpen={createPetDialogOpen} 
                    onClose={() => setCreatePetDialogOpen(false)} 
                    title="Vincular Pet (Animal de rua)"
                    size="xl"
                >
                    <div className="py-2">
                        <p className="text-sm text-default-fg mb-4">
                            Como este agendamento foi feito sem um pet pré-cadastrado, preencha os dados abaixo para registrar o animal na conta do tutor.
                        </p>
                        
                        <AdminCreatePetForm 
                            defaultValues={{
                                ownerId: appointment.userId,
                                name: appointment.name,
                                species: appointment.species,
                                gender: appointment.gender || undefined,
                                size: appointment.size,
                                homeStatus: "TEMPORARY_HOME",
                                allowEmergency: true,
                                isNeutered: false
                            }}
                            onSuccess={handlePetCreated}
                            onCancel={() => setCreatePetDialogOpen(false)}
                        />
                    </div>
                </Dialog>

                <Dialog 
                    isOpen={cancelWarningDialogOpen} 
                    onClose={() => setCancelWarningDialogOpen(false)} 
                    title="Aviso de cancelamento" 
                    size="lg"
                >
                    <p className="text-xs sm:text-sm text-default-fg py-4">
                        Tem certeza que deseja cancelar esta emergência? Esta ação é irreversível.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button 
                            variant="outline" 
                            onClick={() => setCancelWarningDialogOpen(false)} 
                            className="border-danger-border! text-danger-fg! hover:bg-danger-border/10!"
                        >
                            Não, voltar
                        
                        </Button>
                        <Button 
                            variant="danger" 
                            onClick={() => { 
                                setCancelWarningDialogOpen(false); 
                                executeUpdate("CANCELLED", formData.scheduleDate, formData.scheduleTime, appointment.period, "CANCEL"); 
                            }}
                        >
                            Sim, tenho certeza
                        </Button>
                    </div>
                </Dialog>

                <Dialog 
                    isOpen={noShowWarningDialogOpen} 
                    onClose={() => setNoShowWarningDialogOpen(false)} 
                    title="Confirmar não comparecimento" 
                    size="lg"
                >
                    <p className="text-xs sm:text-sm text-default-fg py-4">
                        Tem certeza que deseja registrar que o tutor não compareceu? Esta ação aplicará um bloqueio à conta do usuário por 30 dias e é irreversível.
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button 
                        variant="outline" 
                        onClick={() => setNoShowWarningDialogOpen(false)} 
                        className="border-danger-border! text-danger-fg! hover:bg-danger-border/10!"
                        >
                            Não, voltar
                        </Button>
                        <Button 
                            variant="danger" 
                            onClick={() => { 
                                setNoShowWarningDialogOpen(false); 
                                executeUpdate("NO_SHOW", formData.scheduleDate, formData.scheduleTime, appointment.period, "NO_SHOW"); 
                                }}
                        >
                            Sim, confirmar falta
                        </Button>
                    </div>
                </Dialog>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 py-2 pt-4">
            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    executeUpdate(appointment.status, formData.scheduleDate, formData.scheduleTime, formData.period, "SAVE_DATE");
                }} 
                className="flex flex-col gap-6"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col w-full sm:w-1/3">
                            <Label htmlFor="scheduleDate" className="mb-1">Nova Data</Label>
                            <DatePicker
                                id="scheduleDate"
                                className="w-full"
                                value={formData.scheduleDate}
                                placeholder="Selecione no calendário"
                                onChange={(date: Date | undefined) => setFormData({ ...formData, scheduleDate: date })}
                            />
                        </div>

                        <div className="flex flex-col w-full sm:w-1/3">
                            <Label htmlFor="scheduleTime" className="mb-1">Nova Hora</Label>
                            <Input
                                type="time"
                                id="scheduleTime"
                                className="w-full"
                                value={formData.scheduleTime}
                                onChange={handleTimeChange}
                            />
                        </div>

                        <div className="flex flex-col w-full sm:w-1/3">
                            <Label htmlFor="period" className="mb-1">Novo Período</Label>
                            <Select
                                id="period"
                                options={[
                                    { label: "Selecione...", value: "" },
                                    { label: "Manhã", value: "MORNING" },
                                    { label: "Tarde", value: "AFTERNOON" }
                                ]}
                                value={formData.period}
                                onChange={(val) => setFormData({ ...formData, period: val })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-default-border">
                    <Button 
                        type="button" 
                        variant="outline" 
                        disabled={isLoading}
                        onClick={handleCancelEdit}
                    >
                        Cancelar edição
                    </Button>
                    <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={isLoading || (!formData.scheduleDate || !formData.scheduleTime || !formData.period)}
                    >
                        {loadingAction === "SAVE_DATE" ? 
                            <span className="flex gap-2 items-center">
                                <SpinnerIcon /> Salvando...
                            </span> 
                            : 
                            "Salvar data"
                        }
                    </Button>
                </div>
            </form>
        </div>
    );
};