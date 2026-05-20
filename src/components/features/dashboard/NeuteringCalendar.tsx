"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/translation-map";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import { Card } from "@/src/components/ui";

type CalendarData = Record<string, { MORNING: number; AFTERNOON: number }>;

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
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                setCalendarData({});
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível solicitar pedido."
            });
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
        const prevMonthDays = new Date(year, month, 0).getDate();

        const days = [];
        
        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            days.push(new Date(year, month - 1, prevMonthDays - i));
        }

        for (let i = 1; i <= daysInMonth; i++) {
            days.push(new Date(year, month, i));
        }

        const totalDaysSoFar = days.length;
        const remainingDays = totalDaysSoFar % 7 === 0 ? 0 : 7 - (totalDaysSoFar % 7);
        
        for (let i = 1; i <= remainingDays; i++) {
            days.push(new Date(year, month + 1, i));
        }

        return days;
    };

    const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
    const gridDays = getDaysInMonth();

    return (
        <Card 
            className="w-full max-w-116 shadow-sm! flex flex-col gap-2 items-center mx-auto"
            size="md"
        >
            <div className="flex w-full items-center justify-between">
                <h3 className="text-base font-semibold capitalize text-default-fg">
                    Vagas disponíveis: {format(currentDate, "MMMM yyyy", { locale: ptBR })}
                </h3>
                <div className="flex items-center gap-2">
                    <button 
                        type="button"
                        onClick={handlePrevMonth}
                        disabled={isLoading}
                        className="p-1 rounded-md text-muted-fg hover:bg-muted hover:text-default-fg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button 
                        type="button"
                        onClick={handleNextMonth}
                        disabled={isLoading}
                        className="p-1 rounded-md text-muted-fg hover:bg-muted hover:text-default-fg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                </div>
            </div>

            <div className="relative w-fit">
                {isLoading && (
                    <div className="absolute inset-0 bg-card/60 z-10 flex items-center justify-center backdrop-blur-[2px] rounded-md">
                        <SpinnerIcon />
                    </div>
                )}

                {/* weekdays */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDays.map((day) => (
                        <div key={day} className="text-center font-medium text-muted-fg text-[13px] py-1">
                            {day}
                        </div>
                    ))}
                </div>

                {/* days grid */}
                <div className="grid grid-cols-7 gap-1">
                    {gridDays.map((date) => {
                        const dateStr = formatDateString(date);
                        const isPast = date < today;
                        const isToday = date.getTime() === today.getTime();
                        const isWeekend = date.getDay() === 0 || date.getDay() === 6;
                        
                        const isCurrentMonth = date.getMonth() === currentDate.getMonth();
                        
                        const dayData = calendarData[dateStr];
                        const morningSlots = dayData?.MORNING || 0;
                        const afternoonSlots = dayData?.AFTERNOON || 0;
                        const totalSlots = morningSlots + afternoonSlots;

                        const isDisabled = isPast || isWeekend || !isCurrentMonth;

                        let boxStyleClasses = "";
                        
                        if (!isCurrentMonth || isPast) {
                            boxStyleClasses = "text-muted-fg/30 cursor-default bg-transparent";
                        } else if (isDisabled || !totalSlots) {
                            boxStyleClasses = "bg-gray-100 text-muted-fg cursor-not-allowed";
                        } else if (totalSlots === 0) {
                            boxStyleClasses = "bg-danger-fg/20 text-danger-fg hover:opacity-80 cursor-pointer";
                        } else if (morningSlots <= 5 || afternoonSlots <= 5) {
                            boxStyleClasses = "bg-alert-fg/20 text-alert-fg hover:opacity-80 cursor-pointer";
                        } else {
                            boxStyleClasses = "text-default-fg hover:bg-default cursor-pointer";
                        }

                        const todayClasses = isToday ? "text-default-fg font-bold border border-muted-fg" : "";

                        return (
                            <div key={dateStr} className="flex justify-center items-center">
                                <button 
                                    disabled={isDisabled}
                                    className={`
                                        group relative flex flex-col items-center focus:font-semibold justify-center h-9 w-9 rounded-sm text-sm
                                        ${boxStyleClasses}
                                        ${todayClasses}
                                    `}
                                >
                                    <span>
                                        {date.getDate()}
                                    </span>
                                    
                                    {!isDisabled && isCurrentMonth && (
                                        <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-focus:flex flex-col items-center z-20 w-32 bg-card">
                                            <div className="text-default-fg text-xs rounded-md shadow-md p-2.5 w-full border border-default-border">
                                                <div className="flex justify-between items-center mb-1 text-default-fg">
                                                    <span>Manhã:</span>
                                                    <span className={`font-bold ${morningSlots > 5 ? "text-success-fg" : morningSlots > 0 ? "text-alert-fg" : "text-danger-fg"}`}>
                                                        {morningSlots > 5 ? "6+" : morningSlots}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <span>Tarde:</span>
                                                    <span className={`font-bold ${afternoonSlots > 5 ? "text-success-fg" : afternoonSlots > 0 ? "text-alert-fg" : "text-danger-fg"}`}>
                                                        {afternoonSlots > 5 ? "6+" : afternoonSlots}
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