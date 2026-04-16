"use client"

import { useEffect, useState } from "react"

import { ApiError } from "@/src/lib/api-error"
import { Label } from "@/src/components/ui/Label"
import { Select } from "@/src/components/ui/Select"
import { Button } from "@/src/components/ui/Button"
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon"
import { toast } from "@/src/lib/toast-store"

interface NeuteringDialogFormProps {
    onCancel: () => void;
    onSuccess: () => void;
    petId: string;
    scheduleDate: Date | undefined;
}

export const CreateNeuteringForm = ({ onCancel, onSuccess, petId, scheduleDate }: NeuteringDialogFormProps) => {
    const [selectedPeriod, setSelectedPeriod] = useState<"MORNING" | "AFTERNOON" | "">("");
    const [animalFastAccepted, setAnimalFastAccepted] = useState(false);
    const [animalChipAccepted, setAnimalChipAccepted] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateAppointment = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!petId || !scheduleDate || !selectedPeriod) {
            toast.warning("Preencha todos os campos para agendar.");
            return;
        }

        try {
            setIsSubmitting(true);

            const utcDate = new Date(Date.UTC(
                scheduleDate.getFullYear(), 
                scheduleDate.getMonth(), 
                scheduleDate.getDate()
            ));

            const payload = {
                petId,
                scheduleDate: utcDate.toISOString(),
                period: selectedPeriod,
                animalFastAccepted,
                animalChipAccepted,
                termsAccepted
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/neuterings`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success("Solicitação de castração enviada com sucesso!");
            onSuccess(); // Tells parent to close dialog and refresh data

        } catch (err: unknown) {
            if (err instanceof ApiError) {
                if (err.details) {
                    const firstError = err.details[0]?.message
                    toast.warning(err.message, { message: firstError })
                    return;
                }
                toast.warning(err.message);
                return;
            }
            toast.danger("Erro desconhecido ao solicitar castração.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
            <form onSubmit={handleCreateAppointment} className="flex flex-col gap-4">
                <p className="text-sm text-muted-fg">
                    Escolha o período desejado para a castração do seu pet no dia <strong>{scheduleDate?.toLocaleDateString()}</strong>.
                </p>
                
                <div className="flex flex-col gap-2">
                    <Label htmlFor="period">Período</Label>
                    <Select 
                        id="period"
                        value={selectedPeriod}
                        onChange={(val: any) => setSelectedPeriod(val)}
                        options={[
                            { value: "MORNING", label: "Manhã" },
                            { value: "AFTERNOON", label: "Tarde" }
                        ]}
                        placeholder="Selecione um período..."
                    />
                </div>

                <div className="gap-2 flex flex-col">
                    <label className="flex items-start gap-2 text-sm text-default-fg cursor-pointer">
                        <input 
                            type="checkbox" 
                            required 
                            checked={animalFastAccepted}
                            onChange={(e) => setAnimalFastAccepted(e.target.checked)}
                        />
                        <span className="text-xs text-default-fg">Estou ciente e de acordo com as instruções de jejum (alimentar e hídrico) necessárias para a cirurgia.</span>
                    </label>

                    <label className="flex items-start gap-2 text-sm text-default-fg cursor-pointer">
                        <input 
                            type="checkbox" 
                            required 
                            checked={animalChipAccepted}
                            onChange={(e) => setAnimalChipAccepted(e.target.checked)}
                        />
                        <span className="text-xs text-default-fg">Autorizo a microchipagem obrigatória do meu animal durante o procedimento.</span>
                    </label>

                    <label className="flex items-start gap-2 text-sm text-default-fg cursor-pointer">
                        <input 
                            type="checkbox" 
                            required 
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                        />
                        <span className="text-xs text-default-fg">Li e aceito os termos de responsabilidade do agendamento.</span>
                    </label>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                    <Button 
                        type="button" 
                        variant="outline" 
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Voltar
                    </Button>
                    <Button 
                        type="submit" 
                        variant="primary" 
                        disabled={isSubmitting || !selectedPeriod}
                    >
                        {isSubmitting ? <SpinnerIcon /> : "Confirmar Agendamento"}
                    </Button>
                </div>
            </form>
    );
};
