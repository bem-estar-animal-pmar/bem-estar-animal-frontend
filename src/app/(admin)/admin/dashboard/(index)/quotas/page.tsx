"use client"

import { useState, useEffect } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/error-map";

import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import { Card, Button, Dialog, Input } from "@/src/components/ui"; 
import { DetailsField } from "@/src/components/ui/DetailsField";
import { CalendarIcon } from "@/src/components/icons/outline";

type QuotaData = {
    WEEKDAY: {
        MORNING: { species: string; limit: number };
        AFTERNOON: { species: string; limit: number };
    };
    FRIDAY: {
        MORNING: { species: string; gender: string; limit: number };
        AFTERNOON: { species: string; gender: string; limit: number };
    };
};

export default function AdminQuotasPage() {
    const [quotas, setQuotas] = useState<QuotaData | null>(null);
    const [isLoadingQuotas, setIsLoadingQuotas] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [formData, setFormData] = useState({
        weekdayMorningLimit: 0,
        weekdayAfternoonLimit: 0,
        fridayMorningLimit: 0,
        fridayAfternoonLimit: 0,
    });

    const fetchQuotas = async () => {
        try {
            setIsLoadingQuotas(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/neuterings/quotas`, {
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }
            
            setQuotas(data);
            setFormData({
                weekdayMorningLimit: data.WEEKDAY.MORNING.limit,
                weekdayAfternoonLimit: data.WEEKDAY.AFTERNOON.limit,
                fridayMorningLimit: data.FRIDAY.MORNING.limit,
                fridayAfternoonLimit: data.FRIDAY.AFTERNOON.limit,
            });
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível carregar dados das cotas de castração."
            });
        } finally {
            setIsLoadingQuotas(false);
        }
    };

    useEffect(() => {
        fetchQuotas();
    }, []);

    const handleUpdateQuotas = async () => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/neuterings/quotas`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success("Cotas atualizadas com sucesso!");
            setEditDialogOpen(false);
            fetchQuotas(); 
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível atualizar cotas de castração."
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCloseDialog = () => {
        setEditDialogOpen(false);
        if (quotas) {
            setFormData({
                weekdayMorningLimit: quotas.WEEKDAY.MORNING.limit,
                weekdayAfternoonLimit: quotas.WEEKDAY.AFTERNOON.limit,
                fridayMorningLimit: quotas.FRIDAY.MORNING.limit,
                fridayAfternoonLimit: quotas.FRIDAY.AFTERNOON.limit,
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: parseInt(value, 10) || 0
        }));
    };

    return (
        <div className="w-full flex flex-col gap-4 pt-4">
            <section className="flex w-full flex-wrap justify-between items-center border-b border-default-border pb-6 gap-4">
                <div className="flex flex-col">
                    <h1 className="font-semibold text-xl sm:text-xl lg:text-2xl text-default-fg">
                        Cotas de castração
                    </h1>
                    <p className="text-muted-fg text-sm sm:text-base">
                        Gerencie as cotas de castração mensais.
                    </p>
                </div>
            </section>

            {isLoadingQuotas && (
                <section className="w-full flex flex-col gap-4 ">
                    <div className="flex justify-between items-center w-full">
                        <h2 className="text-default-fg font-semibold text-base lg:text-lg">
                            Cotas de castração
                        </h2>
                    </div>
                    <div className="p-8 text-center text-muted-fg border shadow-xs rounded-md border-default-border justify-center flex">
                        <SpinnerIcon size={28} />
                    </div>
                </section>
            )}

            {!isLoadingQuotas && !quotas && (
                <section className="w-full flex flex-col gap-4 ">
                    <div className="flex justify-between items-center w-full">
                        <h2 className="text-default-fg font-semibold text-base lg:text-lg">
                            Cotas de Castração
                        </h2>
                    </div>
                    <div className="p-8 text-center text-muted-fg border shadow-xs rounded-md border-default-border">
                        Nenhum dado de cota encontrado.
                    </div>
                </section>
            )}

            {!isLoadingQuotas && quotas && (
                <section className="w-full flex flex-col gap-4">
                    <div className="flex justify-between items-center w-full">
                        <h2 className="text-default-fg font-semibold text-base lg:text-lg">
                            Cotas de castração
                        </h2>
                        <Button 
                            variant="primary" 
                            size="sm"
                            onClick={() => setEditDialogOpen(true)}
                            className="gap-1 items-center"
                        >
                            <CalendarIcon size={16}/> Editar
                        </Button>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-4 w-full">
                        <Card size="lg" className="shadow-sm! flex flex-col gap-4 w-full lg:w-1/2">
                            <h3 className="text-lg font-semibold pb-2 border-b border-default-border text-default-fg">
                                Limites Semanais (Segunda a Quinta)
                            </h3>
                            
                            <div className="flex flex-col gap-4 w-full mt-2">
                                <DetailsField title="Manhã (gatos)">
                                    <span className="text-xl font-bold">{quotas.WEEKDAY.MORNING.limit}</span> vagas / dia
                                </DetailsField>
                                <DetailsField title="Tarde (cães)">
                                    <span className="text-xl font-bold">{quotas.WEEKDAY.AFTERNOON.limit}</span> vagas / dia
                                </DetailsField>
                            </div>
                        </Card>

                        <Card size="lg" className="shadow-sm! flex flex-col gap-4 w-full lg:w-1/2">
                            <h3 className="text-lg font-semibold pb-2 border-b border-default-border text-default-fg">
                                Limites de Sexta-feira
                            </h3>
                            
                            <div className="flex flex-col gap-4 w-full mt-2">
                                <DetailsField title="Manhã (gatos Machos)">
                                    <span className="text-xl font-bold">{quotas.FRIDAY.MORNING.limit}</span> vagas / dia
                                </DetailsField>
                                <DetailsField title="Tarde (cães Machos)">
                                    <span className="text-xl font-bold">{quotas.FRIDAY.AFTERNOON.limit}</span> vagas / dia
                                </DetailsField>
                            </div>
                        </Card>
                    </div>

                    <Dialog
                        isOpen={editDialogOpen} 
                        onClose={handleCloseDialog} 
                        title="Editar cotas de costração"
                        size="lg"
                    >
                        <div className="flex flex-col gap-4 py-4 text-sm">
                            <p className="text-muted-fg mb-2">
                                Defina o número máximo de agendamentos permitidos por período.
                            </p>
                            
                            <div className="max-h-80 flex flex-col gap-4 overflow-auto p-4 pr-6 border border-default-border rounded-md">
                                <h4 className="font-semibold text-default-fg border-b border-default-border pb-1">Segunda à quinta</h4>
                                <div className="flex flex-col gap-2">
                                    <label className="flex flex-col gap-1">
                                        <span className="font-medium">Manhã (Gatos)</span>
                                        <Input 
                                            type="number" 
                                            name="weekdayMorningLimit"
                                            min="0"
                                            value={formData.weekdayMorningLimit} 
                                            onChange={handleInputChange}
                                            variant="default"
                                        />
                                    </label>
                                    <label className="flex flex-col gap-1">
                                        <span className="font-medium">Tarde (Cães)</span>
                                        <Input 
                                            type="number" 
                                            name="weekdayAfternoonLimit"
                                            min="0"
                                            value={formData.weekdayAfternoonLimit} 
                                            onChange={handleInputChange}
                                            variant="default"
                                        />
                                    </label>
                                </div>

                                <h4 className="font-semibold text-default-fg border-b border-default-border pb-1 mt-2">Sexta-feira</h4>
                                <div className="flex flex-col gap-2">
                                    <label className="flex flex-col gap-1">
                                        <span className="font-medium">Manhã (Gatos machos)</span>
                                        <Input 
                                            type="number" 
                                            name="fridayMorningLimit"
                                            min="0"
                                            value={formData.fridayMorningLimit} 
                                            onChange={handleInputChange}
                                            variant="default"
                                        />
                                    </label>
                                    <label className="flex flex-col gap-1">
                                        <span className="font-medium">Tarde (Cães machos)</span>
                                        <Input 
                                            type="number" 
                                            name="fridayAfternoonLimit"
                                            min="0"
                                            value={formData.fridayAfternoonLimit} 
                                            onChange={handleInputChange}
                                            variant="default"
                                        />
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4 border-t border-default-border">
                            <Button 
                                variant="outline" 
                                onClick={handleCloseDialog}
                                disabled={isSubmitting}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                variant="primary" 
                                onClick={handleUpdateQuotas}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <span className="flex gap-2 items-center">
                                        <SpinnerIcon /> Salvando...
                                    </span>
                                ) : (
                                    "Salvar Cotas"
                                )}
                            </Button>
                        </div>
                    </Dialog>
                </section>
            )}
        </div>
    );
}