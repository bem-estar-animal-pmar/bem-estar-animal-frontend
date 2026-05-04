"use client";

import { useState, useEffect } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/error-map";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import { Button, Card } from "@/src/components/ui";

type CalendarData = Record<string, { MORNING: number; AFTERNOON: number }>;

const ChevronLeftIcon = ({ size = 20 }: { size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="15 18 9 12 15 6"></polyline>
    </svg>
);

const ChevronRightIcon = ({ size = 20 }: { size?: number }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
);

export const NeuteringCalendar = () => {
    const [currentDate, setCurrentDate] = useState(() => {
        const now = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    });

    const [calendarData, setCalendarData] = useState<CalendarData>({});
    const [isLoading, setIsLoading] = useState(false);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const formatDateString = (date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };

    const fetchMonthData = async (date: Date) => {
        try {
            setIsLoading(true);
            const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
            const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            const startStr = formatDateString(startDate);
            const endStr = formatDateString(endDate);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/neuterings/calendar?startDate=${startStr}&endDate=${endStr}`, {
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            setCalendarData(data);
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.message));
            } else {
                toast.danger("Erro ao carregar dados do calendário.");
            }
            setCalendarData({});
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMonthData(currentDate);
    }, [currentDate]);

    const handlePrevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const handleNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getDaysInMonth = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const days = [];
        
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(null);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        return days;
    };

    const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];
    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const gridDays = getDaysInMonth();

    return (
        <Card className="w-full max-w-178 items-center shadow-sm flex flex-col p-4 divide-primary-accent-border divide-y">
            <div className="flex w-full justify-between items-center mb-2 pb-2 gap-4">
                <h2 className="text-base font-semibold text-default-fg">
                    Vagas disponíveis: {monthNames[currentDate.getMonth()]} de {currentDate.getFullYear()}
                </h2>
                <div className="flex gap-2">
                    <Button 
                        variant="primary" 
                        pill="true"
                        className="text-base! font-bold! opacity-80"
                        size="sm" 
                        onClick={handlePrevMonth} 
                        disabled={isLoading} 
                    >
                       <ChevronLeftIcon/>
                    </Button>
                    <Button 
                        variant="primary" 
                        pill="true"
                        className="text-base! font-bold! opacity-80"
                        size="sm" 
                        onClick={handleNextMonth} 
                        disabled={isLoading} 
                    >
                        <ChevronRightIcon/>
                    </Button>
                </div>
            </div>

            <div className="relative w-full max-w-76">
                {isLoading && (
                    <div className="absolute inset-0 bg-neutral/60 z-10 flex items-center justify-center backdrop-blur-xs rounded-md">
                        <SpinnerIcon />
                    </div>
                )}

                <div className="grid grid-cols-7 gap-2 mb-2 px-2">
                    {weekDays.map((day) => (
                        <div key={day} className="text-center font-medium text-primary-fg text-xs py-1 bg-primary rounded-md">
                            {day}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2 bg-primary rounded-md py-2 px-2">
                    {gridDays.map((date, index) => {
                        if (!date) {
                            return (
                                <div key={`empty-${index}`} className="flex justify-center items-center">
                                    <div className="aspect-square w-full max-w-8"/>
                                </div>
                            );
                        }

                        const dateStr = formatDateString(date);
                        const isPast = date < today;
                        const isToday = date.getTime() === today.getTime();
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                        
                        const dayData = calendarData[dateStr];
                        const morningSlots = dayData?.MORNING || 0;
                        const afternoonSlots = dayData?.AFTERNOON || 0;
                        const totalSlots = morningSlots + afternoonSlots;

                        const isDisabled = isPast || isWeekend;

                        let boxStyleClasses = "";
                        if (isDisabled || !totalSlots) {
                            boxStyleClasses = "border-default-border text-muted-fg/50 cursor-not-allowed bg-default";
                        } else if (totalSlots === 0) {
                            boxStyleClasses = "border-danger-border bg-danger-fg/20 text-danger-fg hover:opacity-80 cursor-pointer";
                        } else if (morningSlots <= 5 || afternoonSlots <= 5) {
                            boxStyleClasses = "border-alert-border bg-alert-fg/20 text-alert-fg hover:opacity-80 cursor-pointer";
                        } else {
                            boxStyleClasses = "border-default-border hover:shadow-sm cursor-pointer text-default-fg bg-card hover:border-muted-fg";
                        }

                        return (
                            <div 
                                key={dateStr}
                                className="flex justify-center items-center">
                                <button 
                                    className={`
                                        group relative flex flex-col items-center justify-center aspect-square w-full max-w-8 rounded-md border transition-all text-sm
                                        ${boxStyleClasses}
                                        ${isToday && !isDisabled ? "border-2 border-muted-fg font-bold" : ""}
                                    `}
                                >
                                    <span>
                                        {date.getDate()}
                                    </span>
                                     
                                    {!isDisabled && (
                                        <div className="absolute bottom-9 left-1/2 -translate-x-1/2 hidden group-focus:flex flex-col items-center z-20 w-32 bg-card">
                                            <div className="text-default-fg text-xs rounded-md shadow-sm p-2.5 w-full border border-default-border">
                                                <div className="flex justify-between items-center mb-1 text-default-fg">
                                                    <span>Manhã:</span>
                                                    <span className={`font-bold ${morningSlots > 5 ? "text-success-fg" : morningSlots > 0 ? "text-alert-fg" : "text-danger-fg"}`}>
                                                        {morningSlots}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span>Tarde:</span>
                                                    <span className={`font-bold ${afternoonSlots > 5 ? "text-success-fg" : afternoonSlots > 0 ? "text-alert-fg" : "text-danger-fg"}`}>
                                                        {afternoonSlots}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
};