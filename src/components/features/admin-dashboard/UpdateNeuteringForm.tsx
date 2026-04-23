"use client";

import { useState } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/error-map";
import { translateTable } from "@/src/lib/table-map";

import { Button, Select, Label, DatePicker } from "@/src/components/ui";

interface AdminUpdateNeuteringFormProps {
    appointment: any;
    onSuccess: () => void;
    onCancel: () => void;
}

export const AdminUpdateNeuteringForm = ({ appointment, onSuccess, onCancel }: AdminUpdateNeuteringFormProps) => {
    const [isLoading, setIsLoading] = useState(false);
    
    // Inicia a data com um objeto Date para o DatePicker
    const initialDate = appointment.scheduleDate
    ? new Date(
        new Date(appointment.scheduleDate).getUTCFullYear(),
        new Date(appointment.scheduleDate).getUTCMonth(),
        new Date(appointment.scheduleDate).getUTCDate()
      )
    : undefined;

    const [formData, setFormData] = useState({
        status: appointment.status,
        scheduleDate: initialDate as Date | undefined,
        period: appointment.period
    });

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/neuterings/${appointment.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    status: formData.status,
                    period: formData.period,
                    scheduleDate: formData.scheduleDate
                        ? new Date(Date.UTC(
                            formData.scheduleDate.getFullYear(),
                            formData.scheduleDate.getMonth(),
                            formData.scheduleDate.getDate()
                        )).toISOString()
                        : undefined,
                }),
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success("Agendamento atualizado com sucesso!");
            onSuccess();
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

    const statusOptions = [
        { label: "Pendente", value: "PENDING" },
        { label: "Aguardando Exames", value: "AWAITING_EXAMS" },
        { label: "Confirmado", value: "CONFIRMED" },
        { label: "Concluído", value: "COMPLETED" },
        { label: "Cancelado", value: "CANCELLED" },
    ];

    if (appointment.status === "CONFIRMED") {
        statusOptions.push({ label: "Não Compareceu (No Show)", value: "NO_SHOW" });
    }

    return (
        <div className="flex flex-col gap-4 py-2">
            
            {/* Seção de Detalhes do Agendamento (Apenas Leitura) */}
            <div className="text-sm flex flex-col gap-3">
                <div>
                    <h3 className="font-semibold text-default-fg mb-1 border-b border-default-border pb-1">Detalhes do Pet</h3>
                    <div className="grid grid-cols-2 gap-y-1 mt-2">
                        <p><span className="text-muted-fg">Nome:</span> {appointment.pet?.name}</p>
                        <p><span className="text-muted-fg">Espécie:</span> {translateTable(appointment.pet?.species)}</p>
                        <p className="col-span-2 truncate" title={appointment.pet?.ownerId}>
                            <span className="text-muted-fg">ID do Tutor:</span> {appointment.pet?.ownerId}
                        </p>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-default-fg mb-1 border-b border-default-border pb-1 mt-1">Contato do Solicitante</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-1 mt-2">
                        <p className="truncate"><span className="text-muted-fg">Nome:</span> {appointment.user?.name}</p>
                        <p className="truncate"><span className="text-muted-fg">Celular:</span> {appointment.user?.phone || "Não informado"}</p>
                        <p className="col-span-1 sm:col-span-2 truncate"><span className="text-muted-fg">Email:</span> {appointment.user?.email}</p>
                    </div>
                </div>
            </div>

            {/* Formulário de Edição */}
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
                <div className="flex flex-col">
                    <Label htmlFor="status" className="mb-1">Status do Agendamento</Label>
                    <Select
                        id="status"
                        options={statusOptions}
                        value={formData.status}
                        onChange={(val) => setFormData({ ...formData, status: val })}
                    />
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex flex-col w-full sm:w-1/2">
                        <Label htmlFor="scheduleDate" className="mb-1">Data</Label>
                        <DatePicker
                            id="scheduleDate"
                            className="w-full"
                            value={formData.scheduleDate}
                            placeholder="Selecione no calendário"
                            onChange={(date: Date | undefined) => setFormData({ ...formData, scheduleDate: date })}
                        />
                    </div>
                    <div className="flex flex-col w-full sm:w-1/2">
                        <Label htmlFor="period" className="mb-1">Período</Label>
                        <Select
                            id="period"
                            options={[
                                { label: "Manhã", value: "MORNING" },
                                { label: "Tarde", value: "AFTERNOON" }
                            ]}
                            value={formData.period}
                            onChange={(val) => setFormData({ ...formData, period: val })}
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-default-border">
                    <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
                        Cancelar
                    </Button>
                    <Button type="submit" variant="primary" disabled={isLoading}>
                        {isLoading ? "Salvando..." : "Salvar Alterações"}
                    </Button>
                </div>
            </form>
        </div>
    );
};