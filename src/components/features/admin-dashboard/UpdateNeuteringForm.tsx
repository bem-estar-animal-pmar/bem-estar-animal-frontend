"use client";

import { useState, useEffect } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/error-map";
import { translateTable } from "@/src/lib/table-map";

import { Button, Select, Label, DatePicker, Input } from "@/src/components/ui";

interface AdminUpdateNeuteringFormProps {
    appointment: any;
    onSuccess: (updatedFields: any) => void;
}

export const UpdateNeuteringForm = ({ appointment, onSuccess }: AdminUpdateNeuteringFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    
    const initialDate = appointment.scheduleDate 
        ? new Date(`${appointment.scheduleDate.split('T')[0]}T00:00:00`)
        : undefined;

    const [formData, setFormData] = useState({
        scheduleDate: initialDate as Date | undefined,
        period: appointment.period || "" 
    });

    useEffect(() => {
        setFormData({
            scheduleDate: appointment.scheduleDate ? new Date(`${appointment.scheduleDate.split('T')[0]}T00:00:00`) : undefined,
            period: appointment.period || ""
        });
    }, [appointment]);

    const handleCancel = () => {
        setFormData({
            scheduleDate: initialDate as Date | undefined,
            period: appointment.period || ""
        });
        setIsEditing(false);
    };

    const executeUpdate = async (newStatus: string, newDate: Date | undefined, newPeriod: string) => {
        setIsLoading(true);

        try {
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

            toast.success("Agendamento atualizado com sucesso!");
            setIsEditing(false);
            onSuccess({
                status: newStatus,
                period: newPeriod !== "" ? newPeriod : undefined,
                scheduleDate: formattedDate,
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
            setIsLoading(false);
        }
    };

    const isFinalStatus = ["NO_SHOW", "COMPLETED", "CANCELLED"].includes(appointment.status);
    const isPendingOrAwaiting = appointment.status === "PENDING" || appointment.status === "AWAITING_EXAMS";

    if (!isEditing) {
        return (
            <div className="flex flex-col gap-6 pt-4">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col">
                        <Label className="mb-1">Status do Agendamento</Label>
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
                </div>
                
                <div className="flex justify-end gap-3 py-4 border-t border-default-border items-center">
                    {isFinalStatus && (
                        <span className="text-sm text-default-500 font-medium">
                            Nenhuma ação disponível para este status.
                        </span>
                    )}

                    {isPendingOrAwaiting && (
                        <Button 
                            variant="primary" 
                            onClick={() => setIsEditing(true)} 
                            disabled={isLoading}
                        >
                            Definir data e confirmar
                        </Button>
                    )}

                    {appointment.status === "CONFIRMED" && (
                        <>
                            <Button 
                                variant="outline" 
                                onClick={() => executeUpdate("NO_SHOW", formData.scheduleDate, formData.period)} 
                                disabled={isLoading}
                            >
                                {isLoading ? "Salvando..." : "Marcar como No Show"}
                            </Button>
                            <Button 
                                variant="primary" 
                                onClick={() => executeUpdate("COMPLETED", formData.scheduleDate, formData.period)} 
                                disabled={isLoading}
                            >
                                {isLoading ? "Salvando..." : "Marcar como Concluído"}
                            </Button>
                        </>
                    )}
                </div>
            </div>
        );
    }

    // ======= VISÃO DE EDIÇÃO =======
    return (
        <div className="flex flex-col gap-4 py-2 pt-4">
            <form 
                onSubmit={(e) => {
                    e.preventDefault();
                    // Se estiver PENDENTE/AGUARDANDO EXAMES, o objetivo de salvar a data é CONFIRMAR
                    const targetStatus = isPendingOrAwaiting ? "CONFIRMED" : appointment.status;
                    executeUpdate(targetStatus, formData.scheduleDate, formData.period);
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
                        onClick={handleCancel}
                    >
                        Cancelar
                    </Button>
                    {/* Botão desabilitado até que data e período sejam preenchidos */}
                    <Button type="submit" variant="primary" disabled={isLoading || (!formData.scheduleDate || !formData.period)}>
                        {isLoading ? "Salvando..." : (isPendingOrAwaiting ? "Confirmar Agendamento" : "Salvar Alterações")}
                    </Button>
                </div>
            </form>
        </div>
    );
};