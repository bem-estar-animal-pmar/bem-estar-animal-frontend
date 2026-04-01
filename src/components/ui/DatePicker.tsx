"use client";

import React, { useState, useRef, useEffect } from "react";
import { format, addYears, addMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import { DayPicker, getDefaultClassNames } from "react-day-picker";
import "react-day-picker/dist/style.css";

import { CalendarIcon } from "../icons/outline";

/* this custom DatePicker returns a Date() object instead of a string, so whenever you select a date, it will automatically
converts to user timezone, in cases you don't want this behavior, ex: saving a birthdate on backend, you need to remove
the timezone from the date object before sending to the backend 

must install: npm i date-fns react-day-picker

this component is strictly CONTROLLED, it won't work on form submits unless it is intercepted and you manually set its value,
it does work on react hook form with '<Controller>' tho.

id is passed down to the button, one option would be creating a hidden input in the feature to let it use id and name (to
work natively on forms)

usage

<DatePicker
    value={blankDateUseSate}
    disabledBefore={new Date("2000-01-01")}
    disabledAfter={new Date("2030-01-01")}
    onChange={onChangeToupdateState}
    variant={errors.birthDate ? "danger" : "default"}
/> */

export interface DatePickerProps {
    value?: Date;
    onChange?: (date: Date | undefined) => void;
    placeholder?: string;
    variant?: "default" | "primary" | "danger";
    id?: string;
    className?: string;
    disabled?: boolean;
    disabledBefore?: Date;
    disabledAfter?: Date;
}

const variantStyles = {
    default: "border-default-border focus:border-default-accent-border focus:shadow-ring-gray",
    primary: "border-primary-border focus:border-primary-accent-border focus:shadow-ring-primary",
    danger:  "border-danger-border focus:border-danger-border focus:shadow-ring-danger",
};

export const DatePicker = ({ value, onChange, placeholder, variant = "default", className = "", disabled = false, disabledBefore, disabledAfter, id = "" }: DatePickerProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [placement, setPlacement] = useState<"bottom" | "top">("bottom"); 
    const [currentMonth, setCurrentMonth] = useState<Date>(value || new Date());
    
    const containerRef = useRef<HTMLDivElement>(null);
    const colors = variantStyles[variant];
    
    const defaultClassNames = getDefaultClassNames();

    const disabledDays = [];
    if (disabledBefore) {
        disabledDays.push({ before: disabledBefore })
    };
    if (disabledAfter) {
        disabledDays.push({ after: disabledAfter })
    };


    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    const handleSelect = (date: Date | undefined) => {
        onChange?.(date);
        setIsOpen(false); 
    };

    const toggleOpen = () => {
        if (!isOpen && containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const calendarHeight = 350;
            if (spaceBelow < calendarHeight && rect.top > calendarHeight) {
                setPlacement("top");
            } else {
                setPlacement("bottom");
            }
            setCurrentMonth(value || new Date());
        }
        setIsOpen(!isOpen);
    };

    const CustomHeader = () => {
        return (
            <div className="flex w-full items-center justify-between">
                <span className="text-sm font-bold capitalize text-default-fg">
                    {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                </span>
                <div className="flex items-center gap-1">
                    <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); setCurrentMonth(addYears(currentMonth, -1)); }}
                        className="p-1 rounded-md text-muted-fg hover:bg-muted hover:text-default-fg transition-colors cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/></svg>
                    </button>
                    <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); setCurrentMonth(addMonths(currentMonth, -1)); }}
                        className="p-1 rounded-md text-muted-fg hover:bg-muted hover:text-default-fg transition-colors cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                    </button>
                    <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); setCurrentMonth(addMonths(currentMonth, 1)); }}
                        className="p-1 rounded-md text-muted-fg hover:bg-muted hover:text-default-fg transition-colors cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                    </button>
                    <button 
                        type="button"
                        onClick={(e) => { e.preventDefault(); setCurrentMonth(addYears(currentMonth, 1)); }}
                        className="p-1 rounded-md text-muted-fg hover:bg-muted hover:text-default-fg transition-colors cursor-pointer"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 17 5-5-5-5"/><path d="m13 17 5-5-5-5"/></svg>
                    </button>
                </div>
            </div>
        );
    };

    return (
        <div className={`relative w-full ${className}`} ref={containerRef}>
            <button
                id={id}
                type="button"
                disabled={disabled}
                className={`flex h-12 w-full items-center justify-between rounded-md border bg-transparent px-4 text-sm text-default-fg cursor-pointer
                    transition duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-default
                    ${colors} ${!value ? "text-muted-fg" : ""}`}
                onClick={toggleOpen}
            >
                <span className="truncate">
                    {value ? format(value, "dd/MM/yyyy", { locale: ptBR }) : placeholder}
                </span>
                
                <CalendarIcon size={20} />
            </button>
            <div
                className={`absolute z-1000 p-4 overflow-hidden rounded-md border border-default-border 
                    bg-card shadow-md transition-all duration-200 ease-out
                    ${placement === "bottom" ? "top-full mt-2 origin-top" : "bottom-full mb-2 origin-bottom"}
                    ${isOpen ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"}
                `}
            >
                <DayPicker
                    mode="single"
                    selected={value}
                    onSelect={handleSelect}
                    locale={ptBR}
                    showOutsideDays
                    disabled={disabledDays}
                    startMonth={new Date(new Date().getFullYear() - 100, 0)} 
                    endMonth={new Date(new Date().getFullYear() + 10, 11)}
                    month={currentMonth}
                    onMonthChange={setCurrentMonth}
                    components={{
                            MonthCaption: CustomHeader, 
                            Nav: () => <></>
                        }}
                    style={{
                        "--rdp-day_button-height": "36px",
                        "--rdp-day_button-width": "36px",
                        "--rdp-accent-color": "currentColor", 
                        "--rdp-today-color": "currentColor",
                        "--rdp-day_button-border-radius": "12px",
                        margin: 0,
                    } as React.CSSProperties}
                    className="text-sm!"
                    classNames={{
                        day_button: `${defaultClassNames.day_button} hover:bg-default! text-default-fg! transition-colors! disabled:cursor-not-allowed!`,
                        today: `${defaultClassNames.today} text-muted-fg! font-bold!`,
                        month: `${defaultClassNames.month} text-default-fg! font-bold!`,
                        selected: `${defaultClassNames.selected} text-brand-fg! text-sm!`,
                        chevron: `${defaultClassNames.chevron} fill-current w-6`,
                        outside: `${defaultClassNames.outside} text-muted-fg!`,
                        disabled: `${defaultClassNames.disabled} bg-gray-200! dark:bg-default/50! text-muted-fg! cursor-not-allowed!`,
                    }}
                />
            </div>
        </div>
    );
};