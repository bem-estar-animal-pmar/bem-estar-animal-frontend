"use client";

import { useState, useEffect } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/error-map";
import { translateTable } from "@/src/lib/table-map";

import { Button, Select, Label, DatePicker, Input, Dialog } from "@/src/components/ui";
import { CalendarCheckIcon, CalendarIcon } from "../../icons/outline";
import { SpinnerIcon } from "../../icons/SpinnerIcon";

interface AdminUpdateNeuteringFormProps {
    appointment: any;
    onSuccess: (updatedFields: any) => void;
}

type LoadingAction = "NO_SHOW" | "CANCEL" | "CONFIRM" | "COMPLETE" | "SAVE_DATE" | null;

export const UpdateNeuteringForm = ({ appointment, onSuccess }: AdminUpdateNeuteringFormProps) => {
    const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);
    const isLoading = loadingAction !== null;
    
    const [isEditing, setIsEditing] = useState(false);

    const [chipWarningDialogOpen, setChipWarningDialogOpen] = useState(false);
    const [cancelWarningDialogOpen, setCancelWarningDialogOpen] = useState(false);
    const [noShowWarningDialogOpen, setNoShowWarningDialogOpen] = useState(false);
    
    const initialDate = appointment.scheduleDate 
        ? new Date(`${appointment.scheduleDate.split('T')[0]}T00:00:00`)
        : undefined;

    const [formData, setFormData] = useState({
        scheduleDate: initialDate as Date | undefined,
        period: appointment.period || "" 
    });

    const [chip, setChip] = useState(appointment.pet.chip === "NO_CHIP" ? "" : appointment.pet.chip);

    useEffect(() => {
        setFormData({
            scheduleDate: appointment.scheduleDate ? new Date(`${appointment.scheduleDate.split('T')[0]}T00:00:00`) : undefined,
            period: appointment.period || ""
        });
        setChip(appointment.pet.chip === "NO_CHIP" ? "" : appointment.pet.chip);
    }, [appointment]);


    const handleCancelEdit = () => {
        setFormData({
            scheduleDate: initialDate as Date | undefined,
            period: appointment.period || ""
        });
        setIsEditing(false);
    };

    const updatePetChip = async () => {
        if (chip === appointment.pet.chip) {
            return true;
        }

        try {
            const petResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/${appointment.petId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chip: chip !== "" ? chip : undefined }),
                credentials: "include",
            });

            const data = await petResponse.json();
            if (!petResponse.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }
            return true;
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.warning(translateError(err.message));
            } else {
                toast.danger("Erro ao atualizar o chip do pet.");
            }
            return false;
        }
    };

    const executeUpdate = async (newStatus: string, newDate: Date | undefined, newPeriod: string, actionName: LoadingAction) => {
        setLoadingAction(actionName);

        try {
            /* if it is being set as completed update chip first */
            if (newStatus === "COMPLETED") {
                const isPetUpdated = await updatePetChip();
                if (!isPetUpdated) {
                    setLoadingAction(null);
                    return;
                }
            }

            const formattedDate = newDate
                ? new Date(Date.UTC(
                    newDate.getFullYear(),
                    newDate.getMonth(),
                    newDate.getDate()
                )).toISOString()
                : undefined;

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/neuterings/${appointment.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: newStatus,
                    period: newPeriod !== "" ? newPeriod : undefined,
                    scheduleDate: formattedDate,
                }),
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success(newStatus === "CANCELLED" ? "Agendamento cancelado com sucesso!" : "Agendamento atualizado com sucesso!");
            setIsEditing(false);
            onSuccess({
                status: newStatus,
                period: newPeriod !== "" ? newPeriod : undefined,
                scheduleDate: formattedDate,
                pet: { ...appointment.pet, chip: chip }
            });
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                if (err.details) {
                    const firstError = err.details[0]?.message;
                    toast.warning(translateError(err.message), { message: firstError });
                    return;
                }
                toast.warning(translateError(err.message));
                return;
            }
            toast.danger("Erro desconhecido ao atualizar agendamento.");
        } finally {
            setLoadingAction(null);
        }
    };

    const handleCompleteRequest = () => {
        if (!chip || chip.trim() === "" || chip === "NO_CHIP") {
            setChipWarningDialogOpen(true);
            return;
        } 
        executeUpdate("COMPLETED", initialDate, appointment.period, "COMPLETE");
    };

    const isFinalStatus = ["NO_SHOW", "COMPLETED", "CANCELLED"].includes(appointment.status);
    const isPendingOrAwaiting = appointment.status === "PENDING" || appointment.status === "AWAITING_EXAMS";
    const hasDateAndPeriod = appointment.scheduleDate && appointment.period;

    if (!isEditing) {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <Label className="mb-1">Status do agendamento</Label>
                        <Input 
                            readOnly 
                            disabled 
                            value={translateTable(appointment.status)} 
                            className="cursor-default! opacity-100!"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full">
                        <div className="flex flex-col w-full sm:w-1/2">
                            <Label className="mb-1">Data</Label>
                            <Input 
                                readOnly 
                                disabled 
                                value={appointment.scheduleDate ? appointment.scheduleDate.split('T')[0].split('-').reverse().join('/') : "Aguardando definição"} 
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

                    {appointment.status === "CONFIRMED" && (
                        <div className="flex flex-col pt-2">
                            <Label className="mb-1" htmlFor="chip">Número do chip (pet)</Label>
                            <Input 
                                id="chip"
                                placeholder="Insira o número do chip implantado..."
                                value={chip}
                                onChange={(e) => setChip(e.target.value)}
                                disabled={isLoading}
                            />
                        </div>
                    )}
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
                            {loadingAction === "NO_SHOW" ? 
                                <span className="flex gap-2 items-center">
                                    <SpinnerIcon /> Salvando...
                                </span> 
                                : 
                                "Tutor ausente"
                            }
                        </Button>
                    )}   

                    {!isFinalStatus && (
                        <Button 
                            variant="outline" 
                            onClick={() => setCancelWarningDialogOpen(true)}
                            disabled={isLoading}
                            className="border-danger-border! text-danger-fg! hover:bg-danger-border/10"
                        >
                            {loadingAction === "CANCEL" ? 
                                <span className="flex gap-2 items-center">
                                    <SpinnerIcon /> Cancelando...
                                </span> 
                                : 
                                "Cancelar agendamento"
                            }
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
                                    "Definir data"
                                }
                            </Button>

                            {hasDateAndPeriod && (
                                <Button 
                                    variant="primary" 
                                    onClick={() => executeUpdate("CONFIRMED", initialDate, appointment.period, "CONFIRM")} 
                                    disabled={isLoading}
                                >
                                    {loadingAction !== "CONFIRM" ? 
                                        <span className="flex gap-2 items-center">
                                            <CalendarCheckIcon /> Confirmar agendamento
                                        </span>
                                        : 
                                        <span className="flex gap-2 items-center">
                                            <SpinnerIcon/> Confirmando...
                                        </span>
                                    }
                                </Button>
                            )}
                        </>
                    )}

                    {appointment.status === "CONFIRMED" && (
                        <>
                            <Button 
                                variant="primary" 
                                onClick={handleCompleteRequest} 
                                disabled={isLoading}
                            >
                                {loadingAction === "COMPLETE" ? 
                                    <span className="flex gap-2 items-center">
                                        <SpinnerIcon /> Salvando...
                                    </span> 
                                    : 
                                    "Marcar como concluído"
                                }
                            </Button>
                        </>
                    )}
                </div>


                <Dialog
                    isOpen={cancelWarningDialogOpen} 
                    onClose={() => setCancelWarningDialogOpen(false)} 
                    title="Aviso de cancelamento"
                    size="lg"
                >
                    <p className="text-xs sm:text-sm text-default-fg py-4">
                        Tem certeza que deseja cancelar este agendamento? Esta ação é irreversível.
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
                                executeUpdate("CANCELLED", initialDate, appointment.period, "CANCEL");
                            }}
                        >
                            Sim, tenho certeza
                        </Button>
                    </div>
                </Dialog>

                <Dialog
                    isOpen={chipWarningDialogOpen} 
                    onClose={() => setChipWarningDialogOpen(false)} 
                    title="Aviso de chip"
                    size="lg"
                >
                    <p className="text-xs sm:text-sm text-default-fg py-4">
                        O número do chip não foi preenchido. Deseja realmente concluir o agendamento sem registrar um chip?
                    </p>
                    <div className="flex justify-end gap-3">
                        <Button 
                            variant="outline" 
                            onClick={() => setChipWarningDialogOpen(false)}
                        >
                            Voltar e Preencher
                        </Button>
                        <Button 
                            variant="primary" 
                            onClick={() => {
                                setChipWarningDialogOpen(false);
                                executeUpdate("COMPLETED", initialDate, appointment.period, "COMPLETE");
                            }}
                        >
                            Concluir sem Chip
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
                                executeUpdate("NO_SHOW", initialDate, appointment.period, "NO_SHOW");
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
                    executeUpdate(appointment.status, formData.scheduleDate, formData.period, "SAVE_DATE");
                }} 
                className="flex flex-col gap-6"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col w-full sm:w-1/2">
                            <Label htmlFor="scheduleDate" className="mb-1">Nova Data</Label>
                            <DatePicker
                                id="scheduleDate"
                                className="w-full"
                                value={formData.scheduleDate}
                                placeholder="Selecione no calendário"
                                onChange={(date: Date | undefined) => setFormData({ ...formData, scheduleDate: date })}
                            />
                        </div>
                        <div className="flex flex-col w-full sm:w-1/2">
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
                    <Button type="submit" variant="primary" disabled={isLoading || (!formData.scheduleDate || !formData.period)}>
                        {loadingAction === "SAVE_DATE" ? <span className="flex gap-2 items-center"><SpinnerIcon /> Salvando...</span> : "Salvar data"}
                    </Button>
                </div>
            </form>
        </div>
    );
};