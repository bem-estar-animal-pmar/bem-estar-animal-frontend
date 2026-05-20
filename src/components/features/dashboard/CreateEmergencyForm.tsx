"use client";

import { useState, useEffect } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/translation-map";

import { Label, Input, Select, Button, Card, Textarea, Dialog, Radio } from "@/src/components/ui";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import { petSizeOptions, petSpeciesOptions, petGenderOptions } from "@/src/constants/constants";

import { Pet, TriageData } from "@/src/constants/interfaces"; 
import { AppointmentScheduleIcon } from "../../icons/outline";

export interface RequestEmergencyFormProps {
    pets: Pet[];
    defaultPetId: string;
    onSuccess: () => void;
}

export const CreateEmergencyForm = ({ pets, defaultPetId, onSuccess }: RequestEmergencyFormProps) => {
    const [targetSelection, setTargetSelection] = useState("STRAY");
    
    /* form states */
    const [name, setName] = useState("");
    const [species, setSpecies] = useState("");
    const [gender, setGender] = useState("");
    const [size, setSize] = useState("");
    const [description, setDescription] = useState("");
    
    const [temporaryHomeAccepted, setTemporaryHomeAccepted] = useState(false);
    const [animalChipAccepted, setAnimalChipAccepted] = useState(false);
    const [termsAccepted, setTermsAccepted] = useState(false);

    const [isTriageModalOpen, setIsTriageModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const defaultTriageState: Required<TriageData> = {
        isNeutered: "DONT_KNOW",
        isConscious: "DONT_KNOW",
        isHeadRaised: "DONT_KNOW",
        isBleeding: "DONT_KNOW",
        bleedingLocation: "",
        isStanding: "DONT_KNOW",
        hasStoodUp: "DONT_KNOW",
        supportsAllPaws: "DONT_KNOW",
        unsupportedPaw: "",
        hasWalked: "DONT_KNOW",
        hasExposedBone: "DONT_KNOW",
        exposedBone: "",
        breathingDifficulty: "DONT_KNOW",
        hasEaten: "DONT_KNOW",
        hasDrunk: "DONT_KNOW",
        hasVomited: "DONT_KNOW",
        hasDiarrhea: "DONT_KNOW",
        symptomsDuration: "",
        otherSymptoms: "",
    };

    const [triageData, setTriageData] = useState(defaultTriageState);

    /* set initial pet if passed via props */
    useEffect(() => {
        if (defaultPetId && pets.some(p => p.id === defaultPetId && p.allowEmergency)) {
            setTargetSelection(defaultPetId);
        }
    }, [defaultPetId, pets]);

    /* auto-fill fields and reset when selection changes */
    useEffect(() => {
        setName("");
        setSpecies("");
        setGender("");
        setSize("");
        
        if (targetSelection !== "STRAY") {
            const selectedPet = pets.find((pet) => pet.id === targetSelection);
            if (selectedPet) {
                setName(selectedPet.name || "");
                setSpecies(selectedPet.species || "");
                setGender(selectedPet.gender || ""); 
                setSize(selectedPet.size || "");
            }
            return;
        }
    }, [targetSelection, pets]);

    const handleOpenTriage = (e: React.SubmitEvent) => { 
        e.preventDefault();

        if (!name || !species || !size || !description || description.length < 10) {
            toast.warning("Preencha todos os campos corretamente.");
            return;
        }
        
        setIsTriageModalOpen(true);
    };

    const handleFinalSubmit = async () => {
        try {
            setIsSubmitting(true);

            const payload = {
                name,
                species,
                ...(gender && { gender }), 
                size,
                description,
                temporaryHomeAccepted,
                animalChipAccepted,
                termsAccepted,
                ...(targetSelection !== "STRAY" && { petId: targetSelection }),
                triageData: triageData
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
            
            setIsTriageModalOpen(false);
            setDescription("");
            setTemporaryHomeAccepted(false);
            setAnimalChipAccepted(false);
            setTermsAccepted(false);
            setTriageData(defaultTriageState);
            
            if (targetSelection === "STRAY") {
                setName("");
                setSpecies("");
                setGender("");
                setSize("");
            }
            
            onSuccess();

        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível solicitar agendamento."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const targetOptions = [
        { value: "STRAY", label: "Animal de Rua" },
        ...pets.filter(p => p.allowEmergency && p.adoptionStatus !== "ADOPTED").map(p => ({ value: p.id, label: `Meu Pet: ${p.name}` }))
    ];

    const renderTriageRadio = (field: keyof typeof defaultTriageState, label: string) => (
        <div className="flex flex-col gap-2 bg-muted-bg/50 p-3 rounded-md border border-default-border">
            <span className="text-sm font-medium text-default-fg">{label}</span>
            <div className="flex gap-4">
                <Radio 
                    name={field} 
                    value="YES" 
                    label="Sim" 
                    variant="primary"
                    checked={triageData[field] === "YES"} 
                    onChange={() => setTriageData(prev => ({...prev, [field]: "YES"}))} 
                />
                <Radio 
                    name={field} 
                    value="NO" 
                    label="Não" 
                    variant="primary"
                    checked={triageData[field] === "NO"} 
                    onChange={() => setTriageData(prev => ({...prev, [field]: "NO"}))} 
                />
                <Radio 
                    name={field} 
                    value="DONT_KNOW" 
                    label="Não sei" 
                    variant="primary"
                    checked={triageData[field] === "DONT_KNOW"} 
                    onChange={() => setTriageData(prev => ({...prev, [field]: "DONT_KNOW"}))} 
                />
            </div>
        </div>
    );

    return (
        <>
            <Card className="border-t-4 border-primary-border rounded-2xl p-6 flex flex-col">
                <div className="pb-4">
                    <h2 className="text-xl font-semibold text-default-fg mb-1">Solicitar atendimento</h2>
                    <p className="text-sm text-muted-fg">Preencha os dados abaixo para solicitar uma avaliação clínica.</p>
                </div>

                <form onSubmit={handleOpenTriage} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="targetSelection">Quem precisa de atendimento?</Label>
                        <Select
                            id="targetSelection"
                            value={targetSelection}
                            disabled={targetOptions.length === 1}
                            onChange={(val) => setTargetSelection(val)}
                            options={targetOptions}
                            placeholder="Selecione o animal..."
                        />
                    </div>
                    
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Nome (ou apelido do animal)</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Ex: Caramelo, Rex..."
                            disabled={targetSelection !== "STRAY"} 
                            maxLength={28}
                        />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="species">Espécie</Label>
                            <Select
                                id="species"
                                value={species}
                                onChange={(val) => setSpecies(val as "DOG" | "CAT")}
                                options={petSpeciesOptions}
                                placeholder="Selecione..."
                                disabled={targetSelection !== "STRAY"}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="gender">Sexo (Opcional)</Label>
                            <Select
                                id="gender"
                                value={gender}
                                onChange={(val) => setGender(val as "MALE" | "FEMALE" | "")}
                                options={petGenderOptions}
                                placeholder="Selecione..."
                                disabled={targetSelection !== "STRAY"}
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <Label htmlFor="size">Porte do Animal</Label>
                            <Select
                                id="size"
                                value={size}
                                onChange={(val) => setSize(val as "SMALL" | "MEDIUM" | "LARGE")}
                                options={petSizeOptions}
                                placeholder="Selecione..."
                                disabled={targetSelection !== "STRAY"}
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
                            <input type="checkbox" required checked={temporaryHomeAccepted} onChange={(e) => setTemporaryHomeAccepted(e.target.checked)} className="mt-0.5" />
                            <span className="text-xs text-muted-fg">Comprometo-me a ser o lar temporário deste animal durante o tratamento, caso ele não tenha dono.</span>
                        </label>
                        <label className="flex items-start gap-2 text-sm text-default-fg cursor-pointer">
                            <input type="checkbox" required checked={animalChipAccepted} onChange={(e) => setAnimalChipAccepted(e.target.checked)} className="mt-0.5" />
                            <span className="text-xs text-muted-fg">Autorizo a microchipagem do animal durante o procedimento.</span>
                        </label>
                        <label className="flex items-start gap-2 text-sm text-default-fg cursor-pointer">
                            <input type="checkbox" required checked={termsAccepted} onChange={(e) => setTermsAccepted(e.target.checked)} className="mt-0.5" />
                            <span className="text-xs text-muted-fg">Li e aceito os termos de responsabilidade do agendamento emergencial.</span>
                        </label>
                    </div>

                    <Button type="submit" variant="primary" className="w-full py-6 text-base mt-2">
                        <span className="flex gap-2 items-center">
                            <AppointmentScheduleIcon/> Prosseguir para Triagem
                        </span>
                    </Button>
                </form>
            </Card>

            <Dialog 
                isOpen={isTriageModalOpen} 
                onClose={() => !isSubmitting && setIsTriageModalOpen(false)}
                title="Ficha de Triagem Rápida"
                size="xl"
            >
                <div className="flex flex-col gap-4 mt-4 max-h-[65vh] overflow-y-auto pr-2 custom-scrollbar">

                    {renderTriageRadio("isNeutered", "O animal é castrado?")}
                    {renderTriageRadio("isConscious", "O animal está consciente?")}
                    {renderTriageRadio("isHeadRaised", "O animal está com a cabeça levantada?")}
                    
                    <div className="flex flex-col gap-2 bg-muted-bg/50 p-3 rounded-md border border-default-border">
                        <span className="text-sm font-medium text-default-fg">O animal está sangrando?</span>
                        <div className="flex gap-4">
                            <Radio name="isBleeding" value="YES" label="Sim" variant="primary" checked={triageData.isBleeding === "YES"} onChange={() => setTriageData(prev => ({...prev, isBleeding: "YES"}))} />
                            <Radio name="isBleeding" value="NO" label="Não" variant="primary" checked={triageData.isBleeding === "NO"} onChange={() => setTriageData(prev => ({...prev, isBleeding: "NO", bleedingLocation: ""}))} />
                            <Radio name="isBleeding" value="DONT_KNOW" label="Não sei" variant="primary" checked={triageData.isBleeding === "DONT_KNOW"} onChange={() => setTriageData(prev => ({...prev, isBleeding: "DONT_KNOW", bleedingLocation: ""}))} />
                        </div>
                        {triageData.isBleeding === "YES" && (
                            <div className="mt-2">
                                <Label>Aonde é o sangramento?</Label>
                                <Input value={triageData.bleedingLocation} onChange={e => setTriageData(prev => ({...prev, bleedingLocation: e.target.value}))} placeholder="Ex: Pata traseira..." />
                            </div>
                        )}
                    </div>

                    {renderTriageRadio("isStanding", "O animal está em pé?")}
                    {renderTriageRadio("hasStoodUp", "Ficou em pé em algum momento?")}

                    <div className="flex flex-col gap-2 bg-muted-bg/50 p-3 rounded-md border border-default-border">
                        <span className="text-sm font-medium text-default-fg">Apoia todas as patas?</span>
                        <div className="flex gap-4">
                            <Radio name="supportsAllPaws" value="YES" label="Sim" variant="primary" checked={triageData.supportsAllPaws === "YES"} onChange={() => setTriageData(prev => ({...prev, supportsAllPaws: "YES", unsupportedPaw: ""}))} />
                            <Radio name="supportsAllPaws" value="NO" label="Não" variant="primary" checked={triageData.supportsAllPaws === "NO"} onChange={() => setTriageData(prev => ({...prev, supportsAllPaws: "NO"}))} />
                            <Radio name="supportsAllPaws" value="DONT_KNOW" label="Não sei" variant="primary" checked={triageData.supportsAllPaws === "DONT_KNOW"} onChange={() => setTriageData(prev => ({...prev, supportsAllPaws: "DONT_KNOW", unsupportedPaw: ""}))} />
                        </div>
                        {triageData.supportsAllPaws === "NO" && (
                            <div className="mt-2">
                                <Label>Qual pata não apoia?</Label>
                                <Input value={triageData.unsupportedPaw} onChange={e => setTriageData(prev => ({...prev, unsupportedPaw: e.target.value}))} placeholder="Ex: Traseira direita..." />
                            </div>
                        )}
                    </div>

                    {renderTriageRadio("hasWalked", "O animal já andou?")}
                    
                    <div className="flex flex-col gap-2 bg-muted-bg/50 p-3 rounded-md border border-default-border">
                        <span className="text-sm font-medium text-default-fg">Tem algum osso exposto?</span>
                        <div className="flex gap-4">
                            <Radio name="hasExposedBone" value="YES" label="Sim" variant="primary" checked={triageData.hasExposedBone === "YES"} onChange={() => setTriageData(prev => ({...prev, hasExposedBone: "YES"}))} />
                            <Radio name="hasExposedBone" value="NO" label="Não" variant="primary" checked={triageData.hasExposedBone === "NO"} onChange={() => setTriageData(prev => ({...prev, hasExposedBone: "NO", exposedBone: ""}))} />
                            <Radio name="hasExposedBone" value="DONT_KNOW" label="Não sei" variant="primary" checked={triageData.hasExposedBone === "DONT_KNOW"} onChange={() => setTriageData(prev => ({...prev, hasExposedBone: "DONT_KNOW", exposedBone: ""}))} />
                        </div>
                        {triageData.hasExposedBone === "YES" && (
                            <div className="mt-2">
                                <Label>Qual osso?</Label>
                                <Input value={triageData.exposedBone} onChange={e => setTriageData(prev => ({...prev, exposedBone: e.target.value}))} placeholder="Ex: Perna dianteira..." />
                            </div>
                        )}
                    </div>

                    {renderTriageRadio("breathingDifficulty", "Está com dificuldade de respirar?")}
                    {renderTriageRadio("hasEaten", "Já comeu?")}
                    {renderTriageRadio("hasDrunk", "Bebeu água?")}
                    {renderTriageRadio("hasVomited", "Teve vômito?")}
                    {renderTriageRadio("hasDiarrhea", "Teve diarreia?")}

                    <div className="flex flex-col gap-2">
                        <Label>Há quantos dias apresenta sintomas?</Label>
                        <Input 
                            value={triageData.symptomsDuration} 
                            onChange={e => setTriageData(prev => ({...prev, symptomsDuration: e.target.value}))}
                            placeholder="Ex: 2 dias..."
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <Label>Algum outro sintoma?</Label>
                        <Textarea 
                            value={triageData.otherSymptoms} 
                            onChange={e => setTriageData(prev => ({...prev, otherSymptoms: e.target.value}))}
                            rows={2}
                            placeholder="Descreva outros sintomas observados..."
                        />
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-default-border flex justify-end gap-3">
                    <Button 
                        variant="outline" 
                        onClick={() => setIsTriageModalOpen(false)}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={handleFinalSubmit}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                            <span className="flex gap-2 items-center"><SpinnerIcon/> Enviando...</span>
                        ) : "Confirmar e Enviar"}
                    </Button>
                </div>
            </Dialog>
        </>
    );
};