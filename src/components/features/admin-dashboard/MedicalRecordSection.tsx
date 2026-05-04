"use client";

import { useState } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/error-map";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import { Button, Card, Textarea } from "../../ui";

interface MedicalRecord {
    id: string;
    notes: string;
    history: string;
}

interface MedicalRecordSectionProps {
    medicalRecord?: MedicalRecord;
    onUpdateSuccess: (updatedRecord: MedicalRecord) => void;
}

export function MedicalRecordSection({ medicalRecord, onUpdateSuccess }: MedicalRecordSectionProps) {
    const [notes, setNotes] = useState(medicalRecord?.notes || "");
    const [isSaving, setIsSaving] = useState(false);

    if (!medicalRecord) {
        return (
            <div className="flex flex-col bg-card border border-default-border rounded-xl p-6 w-full text-muted-fg text-sm">
                Nenhum prontuário médico vinculado a este agendamento.
            </div>
        );
    }

    const historyLogs = medicalRecord.history ? medicalRecord.history.split('\n') : [];

    const handleSaveNotes = async () => {
        try {
            setIsSaving(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medical-records/${medicalRecord.id}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ notes }),
                credentials: "include",
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new ApiError(responseData.message, responseData.code, responseData.details);
            }

            toast.success("Notas médicas atualizadas com sucesso!");
            onUpdateSuccess({ ...medicalRecord, notes: responseData.notes });
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                if (err.details) {
                    const firstError = err.details[0]?.message;
                    toast.danger(translateError(err.message), { message: firstError });
                    return;
                }
                toast.danger(translateError(err.message));
                return;
            }
            toast.danger("Erro desconhecido ao salvar notas médicas.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <Card
            size="lg"
            className="shadow-sm! h-fit!"
        >
            <h3 
                className="text-base lg:text-lg font-semibold pb-4"
            >
                Prontuário Médico
            </h3>
            
            <div className="flex flex-col pb-4">
                <span className="text-sm font-medium text-default-fg pb-2">Histórico</span>
                <div className="rounded-md p-3 text-xs sm:text-sm text-muted-fg h-44 overflow-y-auto border border-default-border space-y-3">
                    {historyLogs.length > 0 ? (
                        historyLogs.map((log, index) => (
                            <div 
                                key={index}
                                className="border-l-2 border-primary-border pl-2"
                            >
                                {log}
                            </div>
                        ))
                    ) : (
                        <span>Nenhum histórico registrado.</span>
                    )}
                </div>
            </div>

            <div className="flex flex-col">
                <label htmlFor="medical-notes" className="text-sm font-medium text-default-fg pb-2">
                    Anotações
                </label>
                <Textarea
                    id="medical-notes"
                    className="min-h-104! mb-4"
                    resize="y"
                    placeholder="Adicione observações cirúrgicas, medicações ou notas gerais..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <Button
                    onClick={handleSaveNotes}
                    disabled={isSaving || notes === medicalRecord.notes}
                    variant="outline"
                    className="self-end"
                >
                    {isSaving && <SpinnerIcon/>}
                    Salvar Notas
                </Button>
            </div>
        </Card>
    );
}