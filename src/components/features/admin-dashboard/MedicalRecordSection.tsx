"use client";

import { useState } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/error-map";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import { Button, Card, Label, Textarea } from "../../ui";
import type { MedicalRecord } from "@/src/constants/interfaces";

interface MedicalRecordSectionProps {
    medicalRecord?: MedicalRecord;
    onUpdateSuccess: (updatedRecord: MedicalRecord) => void;
}

export const MedicalRecordSection = ({ medicalRecord, onUpdateSuccess }: MedicalRecordSectionProps) => {
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

            if (notes.length < 11) {
                toast.danger("As anotações devem conter pelo menos 10 caracteres.");
                return;
            }
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
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível salvar notas médicas."
            });
        } finally {
            setIsSaving(false);
        }
    };

    const parseLogEntry = (log: string) => {
        const match = log.match(/^\[(.*?)\]\s*(.*)$/);
        if (match) {
            return { timestamp: match[1], message: match[2] };
        }
        return { timestamp: null, message: log };
    };

    return (
        <Card
            size="lg"
            className="shadow-sm! h-fit!"
        >
            <section className="flex flex-col pb-4">
                <h3 className="text-base lg:text-lg font-semibold pb-2 mb-4 border-b border-default-border">
                    Prontuário Médico
                </h3>
                <span className="text-sm lg:text-base font-medium text-default-fg pb-2">Histórico</span>
                <div className="rounded-md p-4 text-sm h-44 overflow-y-auto border border-default-border bg-default/30">
                    {historyLogs.length > 0 ? (
                        <div className="relative border-l-2 border-default-border/60 ml-2 space-y-5 my-2">
                            {historyLogs.map((log, index) => {
                                const { timestamp, message } = parseLogEntry(log);
                                const color = index === historyLogs.length - 1 ? "bg-primary-fg animate-bounce h-3 w-3" : "bg-muted-fg"
                                return (
                                    <div key={index} className="relative pl-5">
                                        <div className={`absolute w-2.5 h-2.5 ${color} rounded-full -left-[5.5px] top-1.5 ring-4 ring-default/30`} />
                                        
                                        <div className="flex flex-col">
                                            {timestamp && (
                                                <span className="text-xs font-semibold text-muted-fg mb-1">
                                                    {timestamp}
                                                </span>
                                            )}
                                            <span className="text-default-fg text-sm leading-relaxed">
                                                {message}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <span className="text-muted-fg text-sm">Nenhum histórico registrado.</span>
                    )}
                </div>
            </section>

            <section className="flex flex-col">
                <Label 
                    htmlFor="medical-notes" 
                    className="text-sm lg:text-base font-medium text-default-fg pb-2"
                >
                    Anotações
                </Label>
                <Textarea
                    id="medical-notes"
                    className="min-h-76! mb-1 rounded-md"
                    resize="y"
                    placeholder="Adicione observações cirúrgicas, medicações ou notas gerais..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                />
                <span className="text-xs text-muted-fg self-end mb-4">
                    {notes.length}/5000 caracteres
                </span>
                <Button
                    onClick={handleSaveNotes}
                    disabled={isSaving || notes === medicalRecord.notes}
                    variant="primary"
                    className="self-end"
                >
                    {isSaving ? 
                        <span className="flex gap-2 items-center">
                            <SpinnerIcon /> Salvando...
                        </span> 
                        :
                        "Salvar notas"
                    }
                    
                </Button>
            </section>
        </Card>
    );
}