"use client"

import { useState } from "react"
import { ApiError } from "@/src/lib/api-error"
import { format } from "date-fns"
import { translateError } from "@/src/lib/error-map"

import { Label } from "@/src/components/ui/Label"
import { Select } from "@/src/components/ui/Select"
import { Button } from "@/src/components/ui/Button"
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon"
import { toast } from "@/src/lib/toast-store"

interface NeuteringFormProps {
    onCancel: () => void;
    onSuccess: () => void;
    petId: string;
}

export const CreateNeuteringForm = ({ onCancel, onSuccess, petId }: NeuteringFormProps) => {
    const [animalFastAccepted, setAnimalFastAccepted] = useState(false);
    const [animalChipAccepted, setAnimalChipAccepted] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCreateAppointment = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!petId) {
            toast.warning("Preencha todos os campos para agendar.");
            return;
        }

        try {
            setIsSubmitting(true);
            
            const payload = {
                petId,
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
                    toast.warning(translateError(err.message), { message: firstError })
                    return;
                }
                toast.warning(translateError(err.message));
                return;
            }
            toast.danger("Erro desconhecido ao solicitar castração.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
            <form onSubmit={handleCreateAppointment} className="flex flex-col gap-4">
                <div className="gap-2 flex flex-col">
                    <p className="text-sm text-muted-fg py-4">
                        Antes de concluir a solicitação, você deve aceitar todos os termos abaixo.
                    </p>
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
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <SpinnerIcon /> : "Confirmar Agendamento"}
                    </Button>
                </div>
            </form>
    );
};
