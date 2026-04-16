"use client";

import React, { useState, useId } from "react";
import { ChevronDownIcon } from "@/src/components/icons/outline";

export interface AccordionProps {
    title: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    children: React.ReactNode;
    defaultOpen?: boolean;
    className?: string;
    
}

const sizeVariants = {
    sm: "h-10 px-4 text-xs",
    md: "h-12 px-4 text-sm",
    lg: "h-14 px-5 text-base",
};

const iconSizeVariants = {
    sm: 18,
    md: 24,
    lg: 28,
    xl: 32,
}

export const Accordion = ({ title, children, defaultOpen = false, size = 'md', className = "" }: AccordionProps) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const contentId = useId(); /* ensures accessibility IDs are unique if multiple accordions are used */
    
    const sizing = sizeVariants[size];
    const iconSize = iconSizeVariants[size];

    return (
        <div 
            className={`w-full rounded-md bg-card shadow-sm border border-default-border ${className}`}
        >
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-controls={contentId}
                className={` ${sizing} flex w-full items-center justify-between font-medium text-default-fg
                    transition-colors focus:outline-none cursor-pointer`}
            >
                <p>{title}</p>
                <span className="flex items-center pt-0.5">
                    <ChevronDownIcon 
                            className={`opacity-50 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                            size={iconSize} 
                    />
                </span>
            </button>
            <div
                id={contentId}
                role="region"
                className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
            >
                <div className="overflow-hidden">
                    <div className="px-4 py-4">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};