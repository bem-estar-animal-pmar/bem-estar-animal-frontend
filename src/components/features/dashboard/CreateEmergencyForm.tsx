"use client";

import { useState, useEffect } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";

import { Label } from "@/src/components/ui/Label";
import { Select } from "@/src/components/ui/Select";
import { Button } from "@/src/components/ui/Button";
import { Card } from "@/src/components/ui/Card";
import { Textarea } from "@/src/components/ui/TextArea";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";

import { petSizeOptions, petSpeciesOptions } from "@/src/constants/constants";
import { Pet } from "@/src/constants/interfaces";

export interface RequestEmergencyFormProps {
    pets: Pet[];
    defaultPetId: string;
    onSuccess: () => void;
}

export const CreateEmergencyForm = ({ pets, defaultPetId, onSuccess }: RequestEmergencyFormProps) => {
    const [targetSelection, setTargetSelection] = useState("STRAY");
    
    /* form states */
    const [species, setSpecies] = useState("");
    const [size, setSize] = useState("");
    const [description, setDescription] = useState("");
    
    const [temporaryHomeAccepted, setTemporaryHomeAccepted] = useState(false);
    const [animalChipAccepted, setAnimalChipAccepted] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [isSubmitting, setIsSubmitting] = useState(false);

    /* set initial pet if passed via props */
    useEffect(() => {
        if (defaultPetId && pets.some(p => p.id === defaultPetId)) {
            setTargetSelection(defaultPetId);
        }
    }, [defaultPetId, pets]);

    /* auto-fill species and reset size when selection changes */
    useEffect(() => {
        setSize("");
        setSpecies("");
        if (targetSelection !== "STRAY") {
            const selectedPet = pets.find((pet) => {
                return pet.id === targetSelection;
            });
            if (selectedPet) {
                setSpecies(selectedPet.species);
                setSize(selectedPet.size);
            }
            return;
        }
    }, [targetSelection, pets]);

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!species || !size || !description || description.length < 10) {
            toast.warning("Preencha todos os campos corretamente.");
            return;
        }

        try {
            setIsSubmitting(true);

            const payload = {
                species,
                size,
                description,
                temporaryHomeAccepted,
                animalChipAccepted,
                termsAccepted,
                // Only attach petId if a specific pet was selected
                ...(targetSelection !== "STRAY" && { petId: targetSelection })
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emergencies`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success("Solicitação de atendimento enviada! A clínica entrará em contato em breve.");
            
            setDescription("");
            setSize("");
            setTemporaryHomeAccepted(false);
            setAnimalChipAccepted(false);
            setTermsAccepted(false);
            if (targetSelection === "STRAY") setSpecies("");
            /* notify parent to update history */
            onSuccess();

        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.warning(err.message, { message: err.details?.[0]?.message });
                return;
            }
            toast.danger("Erro ao solicitar atendimento.");
        } finally {
            setIsSubmitting(false);
        }
    };

    /* combine STRAY option with the user's pets */
    const targetOptions = [
        { value: "STRAY", label: "Animal de Rua" },
        ...pets.map(p => ({ value: p.id, label: `Meu Pet: ${p.name}` }))
    ];

    return (
        <Card className="border-t-4 border-primary-border rounded-2xl p-6 flex flex-col">
            <div className="pb-4">
                <h2 className="text-xl font-semibold text-default-fg mb-1">Solicitar atendimento</h2>
                <p className="text-sm text-muted-fg">Preencha os dados abaixo para solicitar uma avaliação clínica.</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                
                {/* Unified Target Selection */}
                <div className="flex flex-col gap-2">
                    <Label htmlFor="targetSelection">Quem precisa de atendimento?</Label>
                    <Select
                        id="targetSelection"
                        value={targetSelection}
                        onChange={(val) => setTargetSelection(val)}
                        options={targetOptions}
                        placeholder="Selecione o animal..."
                    />
                </div>
                <div className="flex justify-between">
                    <div className="flex flex-col gap-2 w-7/20">
                        <Label htmlFor="species">Espécie</Label>
                        <Select
                            id="species"
                            value={species}
                            onChange={(val) => setSpecies(val as "DOG" | "CAT")}
                            options={petSpeciesOptions}
                            placeholder="Selecione..."
                            disabled={targetSelection !== "STRAY"} /* disables if a specific pet is selected */
                        />
                    </div>
                    <div className="flex flex-col gap-2 w-6/10">
                        <Label htmlFor="size">Porte do Animal</Label>
                        <Select
                            id="size"
                            value={size}
                            onChange={(val) => setSize(val as "SMALL" | "MEDIUM" | "LARGE")}
                            options={petSizeOptions}
                            placeholder="Selecione o porte..."
                            disabled={targetSelection !== "STRAY"} /* disables if a specific pet is selected */
                        />
                    </div>
                </div>


                <div className="flex flex-col gap-2">
                    <Label htmlFor="description">Descrição da Emergência</Label>
                    <Textarea 
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        resize="none"
                        placeholder="Descreva com detalhes a ocorrência..."
                    />
                    <span className="text-xs text-muted-fg self-end">
                        {description.length}/500 caracteres
                    </span>
                </div>

                <div className="flex flex-col gap-3 mt-2">
                    <label className="flex items-start gap-2 text-sm text-default-fg cursor-pointer">
                        <input 
                            type="checkbox" 
                            required 
                            checked={temporaryHomeAccepted}
                            onChange={(e) => setTemporaryHomeAccepted(e.target.checked)}
                            className="mt-0.5" 
                        />
                        <span className="text-xs text-muted-fg">
                            Comprometo-me a ser o lar temporário deste animal durante o tratamento, caso ele não tenha dono.
                        </span>
                    </label>

                    <label className="flex items-start gap-2 text-sm text-default-fg cursor-pointer">
                        <input 
                            type="checkbox" 
                            required 
                            checked={animalChipAccepted}
                            onChange={(e) => setAnimalChipAccepted(e.target.checked)}
                            className="mt-0.5" 
                        />
                        <span className="text-xs text-muted-fg">
                            Autorizo a microchipagem do animal durante o procedimento.
                        </span>
                    </label>

                    <label className="flex items-start gap-2 text-sm text-default-fg cursor-pointer">
                        <input 
                            type="checkbox" 
                            required 
                            checked={termsAccepted}
                            onChange={(e) => setTermsAccepted(e.target.checked)}
                            className="mt-0.5" 
                        />
                        <span className="text-xs text-muted-fg">
                            Li e aceito os termos de responsabilidade do agendamento emergencial.
                        </span>
                    </label>
                </div>

                <Button 
                    type="submit" 
                    variant="primary" 
                    className="w-full py-6 text-base mt-2"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? <SpinnerIcon /> : "Solicitar Atendimento"}
                </Button>
            </form>
        </Card>
    );
};