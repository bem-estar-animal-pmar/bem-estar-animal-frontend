"use client"

import { useState } from "react"
import { ApiError } from "@/src/lib/api-error"
import { format } from "date-fns"
import { translateError } from "@/src/lib/error-map"
import { toast } from "@/src/lib/toast-store"
import { getTodayInBrasilia } from "@/src/lib/scheduling"

import { DatePicker, Label, Select, Button } from "@/src/components/ui"
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon"

interface NeuteringFormProps {
    onCancel: () => void;
    onSuccess: () => void;
    petId: string;
    isBrachycephalic: boolean;
}

export const CreateNeuteringForm = ({ onCancel, onSuccess, petId, isBrachycephalic = false, }: NeuteringFormProps) => {
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
    const [selectedPeriod, setSelectedPeriod] = useState<"MORNING" | "AFTERNOON" | "">("");

    const [animalFastAccepted, setAnimalFastAccepted] = useState(false);
    const [animalChipAccepted, setAnimalChipAccepted] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const datePickerTodayDate = getTodayInBrasilia();

    const handleCreateAppointment = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!petId) {
            toast.warning("Pet inválido.");
            return;
        }
        const missingDate = !selectedDate || !selectedPeriod;
        if (!isBrachycephalic && missingDate) {
            toast.warning("Preencha todos os campos para agendar");
            return;
        }

        try {
            setIsSubmitting(true);
            
            const payload = {
                petId,
                scheduleDate: selectedDate ? format(selectedDate, "yyyy-MM-dd") : undefined,
                period: selectedPeriod ? selectedPeriod : undefined,
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

                <div className="flex flex-col gap-2 pt-4">
                    <Label htmlFor="date">Data da castração</Label>
                    <DatePicker
                        className="w-full"
                        id="date"
                        value={selectedDate}
                        placeholder="Selecione no calendário"
                        disabledBefore={datePickerTodayDate} 
                        disabled={isBrachycephalic}
                        onChange={(date: Date | undefined) => {
                            setSelectedDate(date);
                        }}
                    />
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="period">Período</Label>
                    <Select 
                        id="period"
                        value={selectedPeriod}
                        onChange={(val: any) => setSelectedPeriod(val)} 
                        disabled={isBrachycephalic}
                        options={[
                            { value: "MORNING", label: "Manhã" },
                            { value: "AFTERNOON", label: "Tarde" }
                        ]}
                        placeholder="Selecione um período..."
                    />
                </div>
                {isBrachycephalic && (
                    <p className="text-xs italic text-danger-fg">
                        A data e período serão definidas pela clínica por se tratar de um animal braquicefálico que precisa de exames específicos.
                    </p>
                )}

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
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? <SpinnerIcon /> : "Confirmar Agendamento"}
                    </Button>
                </div>
            </form>
    );
};
