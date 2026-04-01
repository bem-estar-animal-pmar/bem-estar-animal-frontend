"use client";

import React, { useState, useRef, useEffect, ButtonHTMLAttributes } from "react";
import { CheckIcon, ChevronDownIcon } from "../icons/outline";

/* this component works by emulating a select element. it does have a hidden input inside to correctly work when wrapped
by form elements. 

it has a button that triggers a dropdown to emulate the select input, it passes 'props' to this main button, allowing 
attributes like 'id', 'aria-describedby', 'disabled', 'onBlur, onFocus', etc. 

it has its own internalValue state, so it can work as an uncontrolled component (it works when we dont pass value + 
onChange props to it)

it has highlighting selected option feature and it also has keyboard navigation. 

!!! on React, best alternative to use this select is to use like a native controlled select element: putting inside a form, 
adding 'name' to it, and handling the value and onchage with states. 

if you don't need to interact with the data in real-time, like displaying error texts, adding masks to the input, realtime 
validation, you don't need it to be CONTROLLED at all. if you only care about validation after the user clicks "Submit", you
can pretty much let the form handle its values, like adding a submit fuction and extracting the form data onSubmit */

export interface SelectProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "value" | "onChange"> {
    options: {
        label: string;
        value: string;
    }[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    variant?: "default" | "primary" | "danger";
    name?: string;
    selectClassName?: string;
    dropdownClassName?: string;
}

const variantStyles = {
    default: "border-default-border focus:border-default-accent-border focus:shadow-ring-gray",
    primary: "border-primary-border focus:border-primary-accent-border focus:shadow-ring-primary",
    danger:  "border-danger-border focus:border-danger-border focus:shadow-ring-danger",
};

export const Select = ({ options, value, onChange, placeholder, variant = "default", className = "", selectClassName = "", dropdownClassName = "", name, ...props }: SelectProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    
    const [internalValue, setInternalValue] = useState<string | undefined>(value);

    const containerRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    
    const colors = variantStyles[variant];
    const sizing = "h-12 px-4 text-sm";

    /* updates internal value whenever value is changed,  this exists to sync internal value when the component is CONTROLLED */
    useEffect(() => { 
        if (value !== undefined) {
            setInternalValue(value);
        }
    }, [value]);

    /* listener to close the dropdown when clicking outside */
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleOutsideClick);
        return () => document.removeEventListener("mousedown", handleOutsideClick);
    }, []);

    /* scroll to the select if the user changes options while the screen is not on it */
    useEffect(() => {
        if (isOpen && highlightedIndex >= 0 && listRef.current) {
            const highlightedElement = listRef.current.children[highlightedIndex] as HTMLElement;
            if (highlightedElement) {
                highlightedElement.scrollIntoView({ block: "nearest" });
            }
        }
    }, [highlightedIndex, isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (!isOpen) {
            if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(e.key)) {
                e.preventDefault();
                setIsOpen(true);
                const currentIndex = options.findIndex((opt) => opt.value === internalValue);
                setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
            }
            return;
        }

        switch (e.key) {
            case "ArrowDown":
                e.preventDefault();
                setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
                break;
            case "ArrowUp":
                e.preventDefault();
                setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : prev));
                break;
            case "Enter":
            case " ":
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < options.length) {
                    const newValue = options[highlightedIndex].value;
                    setInternalValue(newValue);
                    onChange?.(newValue);
                    setIsOpen(false);
                }
                break;
            case "Escape":
                e.preventDefault();
                setIsOpen(false);
                break;
            case "Tab":
                setIsOpen(false);
                break;
        }
    };

    const handleToggleSelect = () => {
        setIsOpen(!isOpen);
        setHighlightedIndex(selectedOptionIndex >= 0 ? selectedOptionIndex : 0);
    }

    const handleSelectOption = (value: string) => {
        setInternalValue(value);
        onChange?.(value);
        setIsOpen(false);
    }

    /* get index and value of current selected option (if exists) */
    const selectedOptionIndex = options.findIndex((option) => {
        return option.value === internalValue
    });
    const selectedOption = selectedOptionIndex >= 0 ? options[selectedOptionIndex] : undefined;

    return (
        <div className={`relative w-full ${className}`} ref={containerRef}>
            {/* if name doesn't exists, forms can't manage the hidden input data, so there is no point in rendering it */}
            {name && <input type="hidden" name={name} value={internalValue || ""} />}
            <button
                type="button"
                className={`flex w-full items-center justify-between rounded-md border bg-transparent text-default-fg cursor-pointer
                    transition duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-default
                    ${selectClassName} ${colors} ${sizing} ${!selectedOption ? "text-muted-fg" : ""}`}
                onClick={handleToggleSelect}
                onKeyDown={handleKeyDown}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-controls={`${name || 'select'}-listbox`}
                {...props} 
            >
                <span className="truncate">
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                
                <span className="flex items-center">
                    <ChevronDownIcon
                        className={`opacity-50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        size={20} 
                    />
                </span>
            </button>

            <div
                className={`absolute top-full z-10 mt-2 w-full overflow-hidden rounded-md border border-default-border 
                    bg-neutral origin-top transition-all duration-200 ease-out
                    ${isOpen ? "scale-100 opacity-100 translate-y-0" : "pointer-events-none scale-95 opacity-0 -translate-y-2"}`}
            >
                <ul 
                    ref={listRef}
                    id={`${name || 'select'}-listbox`}
                    role="listbox" 
                    className={`${dropdownClassName} max-h-60 overflow-auto px-1 text-default-fg py-1 focus:outline-none`}
                >
                    {options.length > 0 ? (
                        options.map((option, index) => {
                            const isSelected = internalValue === option.value;
                            const isHighlighted = index === highlightedIndex;

                            return (
                                <li
                                    key={option.value}
                                    role="option"
                                    aria-selected={isSelected}
                                    onClick={() => handleSelectOption(option.value)}
                                    className={`relative flex w-full cursor-pointer select-none items-center py-2 px-4 outline-none rounded-md transition-colors 
                                        ${isHighlighted ? "bg-default-border" : ""}
                                        ${isSelected ? "font-semibold" : ""}
                                    `}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {isSelected && isOpen && (
                                        <span className="absolute right-4 flex items-center justify-center">
                                            <CheckIcon size={16}/>
                                        </span>
                                    )}
                                </li>
                            );
                        })
                    ) : 
                        <li className="py-2 px-4 text-center rounded-md text-muted-fg">No options found.</li>
                    }
                </ul>
            </div>
        </div>
    );
};