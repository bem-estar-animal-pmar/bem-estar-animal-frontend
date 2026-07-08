"use client";

import { Card } from "@/src/components/ui";

interface ExceptionData {
    date: string;
    morningLimit: number;
    afternoonLimit: number;
}

interface AdminNeuteringCalendarProps {
    activeMonth: number;
    activeYear: number;
    exceptions: ExceptionData[];
    onDayClick: (date: Date, morningLimit: number, afternoonLimit: number) => void;
}

export const AdminNeuteringCalendar = ({ activeMonth, activeYear, exceptions, onDayClick }: AdminNeuteringCalendarProps) => {
    const formatDateString = (date: Date) => {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    };

    const getDaysInMonth = () => {
        const year = activeYear;
        const month = activeMonth - 1;
        
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
        <Card size="lg" className="w-full lg:max-w-124 flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-8 w-full text-left text-default-fg border-b border-default-border pb-2">
                Edição de dia específico
            </h3>
            
            <div className="grid grid-cols-7 gap-2 w-full max-w-80! lg:mb-4">
                {weekDays.map(day => (
                    <div key={day} className="text-center font-medium text-muted-fg text-sm py-1">{day}</div>
                ))}
                
                {gridDays.map((date) => {
                    const dateStr = formatDateString(date);
                    const isCurrentMonth = date.getMonth() === (activeMonth - 1);
                    
                    const exceptionData = exceptions.find(e => e.date === dateStr);
                    const isEdited = !!exceptionData;

                    let buttonClass = "text-default-fg border border-transparent bg-(--neutral-100) hover:bg-(--neutral-200)";
                    
                    if (!isCurrentMonth) {
                        buttonClass = "text-muted-fg/30 cursor-default bg-transparent";
                    } else if (isEdited) {
                        buttonClass = "bg-alert-fg/10 hover:bg-alert-fg/30 text-alert-fg border-alert-fg/50 font-bold";
                    }

                    return (
                        <button
                            key={dateStr}
                            disabled={!isCurrentMonth}
                            onClick={() => {
                                onDayClick(
                                    date, 
                                    exceptionData?.morningLimit ?? 0, 
                                    exceptionData?.afternoonLimit ?? 0
                                );
                            }}
                            className={`h-10 w-10 flex items-center justify-center rounded-md text-sm transition-colors cursor-pointer disabled:cursor-not-allowed ${buttonClass}`}
                            title={isEdited ? `Manhã: ${exceptionData.morningLimit} | Tarde: ${exceptionData.afternoonLimit}` : "Editar dia"}
                        >
                            {date.getDate()}
                        </button>
                    );
                })}
            </div>
            
            <div className="flex gap-4 mt-4 text-xs text-muted-fg flex-wrap justify-center">
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-(--neutral-100) border rounded-sm"></div> Padrão</span>
                <span className="flex items-center gap-1"><div className="w-3 h-3 bg-alert-fg/10 border border-alert-fg/50 rounded-sm"></div> Exceção criada</span>
            </div>
        </Card>
    );
};