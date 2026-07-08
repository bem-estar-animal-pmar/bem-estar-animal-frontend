"use client"

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/translation-map";

import { Card, Button, Dialog, Input, Label, Select, DatePicker, DetailsField} from "@/src/components/ui"; 
import { AdminNeuteringCalendar } from "@/src/components/features/admin-dashboard/AdminNeuteringCalendar";
import { CalendarIcon, } from "@/src/components/icons/outline";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";

interface QuotaData {
    WEEKDAY: { 
        MORNING: { limit: number }; 
        AFTERNOON: { limit: number } 
    };
    FRIDAY: { 
        MORNING: { limit: number }; 
        AFTERNOON: { limit: number } 
    };
    EXCEPTIONS: Array<{
        date: string;
        morningLimit: number;
        afternoonLimit: number;
    }>;
}

interface MonthForm {
    weekdayMorningLimit: number | string;
    weekdayAfternoonLimit: number | string;
    fridayMorningLimit: number | string;
    fridayAfternoonLimit: number | string;
}

interface DayForm {
    date: Date | undefined;
    morningLimit: number | string;
    afternoonLimit: number | string;
}

const monthOptions = [
    { label: "Janeiro", value: "1" },
    { label: "Fevereiro", value: "2" },
    { label: "Março", value: "3" },
    { label: "Abril", value: "4" },
    { label: "Maio", value: "5" },
    { label: "Junho", value: "6" },
    { label: "Julho", value: "7" },
    { label: "Agosto", value: "8" },
    { label: "Setembro", value: "9" },
    { label: "Outubro", value: "10" },
    { label: "Novembro", value: "11" },
    { label: "Dezembro", value: "12" }
];

export default function AdminQuotasPage() {
    const [quotas, setQuotas] = useState<QuotaData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [activeMonth, setActiveMonth] = useState(new Date().getMonth() + 1);
    const [activeYear, setActiveYear] = useState(new Date().getFullYear());

    // Temporary state to hold the input before the debounce updates activeYear
    const [inputYear, setInputYear] = useState(activeYear);

    const [editMonthDialogOpen, setEditMonthDialogOpen] = useState(false);
    const [editDayDialogOpen, setEditDayDialogOpen] = useState(false);

    const [monthForm, setMonthForm] = useState<MonthForm>({
        weekdayMorningLimit: 0, weekdayAfternoonLimit: 0,
        fridayMorningLimit: 0, fridayAfternoonLimit: 0,
    });

    const [dayForm, setDayForm] = useState<DayForm>({
        date: undefined, morningLimit: 0, afternoonLimit: 0
    });

    // --- DEBOUNCE EFFECT FOR THE YEAR INPUT ---
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            // Only trigger a fetch if the year is within a valid range
            if (inputYear >= 2024 && inputYear <= 2100) {
                setActiveYear(inputYear);
            }
        }, 600); // 600ms delay

        return () => clearTimeout(timeoutId);
    }, [inputYear]);

    const refetchQuotas = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/neuterings/quotas?month=${activeMonth}&year=${activeYear}`, {
                credentials: "include",
            });
            const data = await response.json();
            
            if (!response.ok) throw new ApiError(data.message, data.code, data.details);

            setQuotas(data);
            setMonthForm({
                weekdayMorningLimit: data.WEEKDAY.MORNING.limit,
                weekdayAfternoonLimit: data.WEEKDAY.AFTERNOON.limit,
                fridayMorningLimit: data.FRIDAY.MORNING.limit,
                fridayAfternoonLimit: data.FRIDAY.AFTERNOON.limit,
            });
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { message: translateError(err.details?.[0]?.message || err.message) });
            } else {
                toast.danger("Erro desconhecido", { message: "Não foi possível carregar as cotas de castração." });
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Main fetch effect triggers whenever activeMonth or activeYear changes
    useEffect(() => {
        let isMounted = true;

        if (activeYear < 2024 || activeYear > 2100) return;

        const loadData = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/neuterings/quotas?month=${activeMonth}&year=${activeYear}`, {
                    credentials: "include",
                });
                const data = await response.json();
                
                if (!response.ok) throw new ApiError(data.message, data.code, data.details);

                if (isMounted) {
                    setQuotas(data);
                    setMonthForm({
                        weekdayMorningLimit: data.WEEKDAY.MORNING.limit,
                        weekdayAfternoonLimit: data.WEEKDAY.AFTERNOON.limit,
                        fridayMorningLimit: data.FRIDAY.MORNING.limit,
                        fridayAfternoonLimit: data.FRIDAY.AFTERNOON.limit,
                    });
                }
            } catch (err: unknown) {
                if (isMounted) {
                    if (err instanceof ApiError) {
                        toast.danger(translateError(err.code), { message: translateError(err.details?.[0]?.message || err.message) });
                    } else {
                        toast.danger("Erro desconhecido", { message: "Não foi possível carregar as cotas." });
                    }
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, [activeMonth, activeYear]);

    const handleUpdateMonthQuotas = async () => {
        setIsSubmitting(true);
        try {
            const payload = {
                weekdayMorningLimit: Number(monthForm.weekdayMorningLimit) || 0,
                weekdayAfternoonLimit: Number(monthForm.weekdayAfternoonLimit) || 0,
                fridayMorningLimit: Number(monthForm.fridayMorningLimit) || 0,
                fridayAfternoonLimit: Number(monthForm.fridayAfternoonLimit) || 0,
                month: activeMonth, 
                year: activeYear
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/neuterings/quotas/month`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) throw new ApiError(data.message, data.code, data.details);

            toast.success("Cotas mensais atualizadas com sucesso!");
            setEditMonthDialogOpen(false);
            refetchQuotas(); 
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { message: translateError(err.details?.[0]?.message || err.message) });
            } else {
                toast.danger("Erro desconhecido", { message: "Não foi possível atualizar as cotas de castração." });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateDayException = async () => {
        if (!dayForm.date) {
            return; 
        }

        setIsSubmitting(true);
        try {
            const payload = {
                date: format(dayForm.date, 'yyyy-MM-dd'),
                morningLimit: Number(dayForm.morningLimit) || 0,
                afternoonLimit: Number(dayForm.afternoonLimit) || 0
            };

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/neuterings/quotas/day`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) throw new ApiError(data.message, data.code, data.details);

            toast.success("Exceção diária aplicada com sucesso!");
            setEditDayDialogOpen(false);
            setDayForm({ date: undefined, morningLimit: 0, afternoonLimit: 0 }); 
            refetchQuotas();
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { message: translateError(err.details?.[0]?.message || err.message) });
            } else {
                toast.danger("Erro desconhecido", { message: "Não foi possível aplicar a alteração dessa data." });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleMonthInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setMonthForm(prev => ({ 
            ...prev, 
            [name]: value === "" ? "" : parseInt(value, 10) 
        }));
    };

    return (
        <div className="w-full flex flex-col gap-4 pt-4">
            <section className="flex w-full flex-wrap justify-between items-center border-b border-default-border pb-6 gap-4">
                <div className="flex flex-col">
                    <h1 className="font-semibold text-xl sm:text-xl lg:text-2xl text-default-fg">
                        Gerenciamento de agenda
                    </h1>
                    <p className="text-muted-fg text-sm sm:text-base">
                        Controle vagas mensais e bloqueie dias específicos.
                    </p>
                </div>
                
                <div className="flex gap-2 items-center">
                    <Select
                        options={monthOptions}
                        value={String(activeMonth)}
                        onChange={(val) => setActiveMonth(Number(val))}
                    />
                    <Input 
                        type="number" 
                        value={inputYear} 
                        onChange={(e) => setInputYear(Number(e.target.value))}
                    />
                    <div className="w-18 flex items-center justify-center">
                        {isLoading && <SpinnerIcon size={20} />}
                    </div>
                </div>
            </section>

            {isLoading ? (
                <div className="p-8 text-center flex justify-center"><SpinnerIcon size={28} /></div>
            ) : quotas ? (
                <section className="w-full flex flex-col gap-4">
                    <div className="flex justify-between items-center w-full mt-4">
                        <h2 className="text-default-fg font-semibold text-base lg:text-lg">
                            Vagas de {new Date(0, activeMonth - 1).toLocaleString('pt-BR', { month: 'long' })} {activeYear}
                        </h2>
                        <div className="flex gap-2">
                            <Button 
                                variant="primary" 
                                size="sm" 
                                onClick={() => setEditMonthDialogOpen(true)}
                                className="flex gap-2"
                            >
                                <CalendarIcon size={16}/> Editar mês
                            </Button>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-4 w-full">
                        <div className="flex flex-col gap-4 w-full">
                            <Card size="lg" className="shadow-sm! flex flex-col gap-4 w-full">
                                <h3 className="text-lg font-semibold pb-2 border-b border-default-border text-default-fg">Limites semanais</h3>
                                <div className="flex flex-col gap-4 w-full mt-2">
                                    <DetailsField title="Manhã (Gatos)"><span className="text-xl font-bold">{quotas.WEEKDAY.MORNING.limit}</span> vagas / dia</DetailsField>
                                    <DetailsField title="Tarde (Cães)"><span className="text-xl font-bold">{quotas.WEEKDAY.AFTERNOON.limit}</span> vagas / dia</DetailsField>
                                </div>
                            </Card>

                            <Card size="lg" className="shadow-sm! flex flex-col gap-4 w-full">
                                <h3 className="text-lg font-semibold pb-2 border-b border-default-border text-default-fg">Sextas-feiras</h3>
                                <div className="flex flex-col gap-4 w-full mt-2">
                                    <DetailsField title="Manhã (Gatos Machos)"><span className="text-xl font-bold">{quotas.FRIDAY.MORNING.limit}</span> vagas / dia</DetailsField>
                                    <DetailsField title="Tarde (Cães Machos)"><span className="text-xl font-bold">{quotas.FRIDAY.AFTERNOON.limit}</span> vagas / dia</DetailsField>
                                </div>
                            </Card>
                        </div>
                        <AdminNeuteringCalendar
                            activeMonth={activeMonth}
                            activeYear={activeYear}
                            exceptions={quotas.EXCEPTIONS || []}
                            onDayClick={(date, morningLimit, afternoonLimit) => {
                                setDayForm({
                                    date: date,
                                    morningLimit: morningLimit,
                                    afternoonLimit: afternoonLimit
                                });
                                setEditDayDialogOpen(true);
                            }}
                        />
                    </div>
                </section>
            ) : null}

            <Dialog isOpen={editMonthDialogOpen} onClose={() => setEditMonthDialogOpen(false)} title="Editar Cotas Mensais" size="lg">
                <div className="flex flex-col gap-4 py-4 text-sm">
                    <p className="text-muted-fg mb-4">Defina o padrão para o mês selecionado. Deixe em 0 para fechar a agenda.</p>
                    <div className="max-h-80 flex flex-col gap-4 overflow-auto p-4 border border-default-border rounded-md">
                        <h4 className="font-semibold text-default-fg border-b border-default-border pb-1">Segunda à Quinta</h4>
                        
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label>Manhã (Gatos)</Label>
                                <Input type="number" name="weekdayMorningLimit" value={monthForm.weekdayMorningLimit} onChange={handleMonthInputChange} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label>Tarde (Cães)</Label>
                                <Input type="number" name="weekdayAfternoonLimit" value={monthForm.weekdayAfternoonLimit} onChange={handleMonthInputChange} />
                            </div>
                        </div>
                        
                        <h4 className="font-semibold text-default-fg border-b border-default-border pb-1 mt-2">Sexta-feira</h4>
                        
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col gap-1">
                                <Label>Manhã (Gatos machos)</Label>
                                <Input type="number" name="fridayMorningLimit" value={monthForm.fridayMorningLimit} onChange={handleMonthInputChange} />
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label>Tarde (Cães machos)</Label>
                                <Input type="number" name="fridayAfternoonLimit" value={monthForm.fridayAfternoonLimit} onChange={handleMonthInputChange} />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-default-border">
                    <Button variant="outline" onClick={() => setEditMonthDialogOpen(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleUpdateMonthQuotas} disabled={isSubmitting}>Salvar Mês</Button>
                </div>
            </Dialog>

            <Dialog isOpen={editDayDialogOpen} onClose={() => setEditDayDialogOpen(false)} title="Exceção de Dia Específico" size="md">
                <div className="flex flex-col gap-4 py-4 text-sm">
                    <p className="text-muted-fg mb-2">Selecione uma data para alterar suas vagas (ex: feriados). Para bloquear o dia, defina ambas as vagas como 0.</p>
                    <div className="flex flex-col gap-4 p-4 border border-default-border rounded-md">
                        
                        <div className="flex flex-col gap-1">
                            <Label>Data</Label>
                            <DatePicker 
                                value={dayForm.date} 
                                onChange={(date) => setDayForm(prev => ({ ...prev, date }))} 
                                placeholder="Selecione uma data"
                            />
                        </div>
                        
                        <div className="flex flex-col gap-1">
                            <Label>Vagas Manhã</Label>
                            <Input 
                                type="number" 
                                value={dayForm.morningLimit} 
                                onChange={(e) => setDayForm(prev => ({ 
                                    ...prev, 
                                    morningLimit: e.target.value === "" ? "" : Number(e.target.value) 
                                }))} 
                            />
                        </div>

                        <div className="flex flex-col gap-1">
                            <Label>Vagas Tarde</Label>
                            <Input 
                                type="number" 
                                value={dayForm.afternoonLimit} 
                                onChange={(e) => setDayForm(prev => ({ 
                                    ...prev, 
                                    afternoonLimit: e.target.value === "" ? "" : Number(e.target.value) 
                                }))} 
                            />
                        </div>

                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-default-border">
                    <Button variant="outline" onClick={() => setEditDayDialogOpen(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleUpdateDayException} disabled={isSubmitting || !dayForm.date}>Aplicar Exceção</Button>
                </div>
            </Dialog>
        </div>
    );
}