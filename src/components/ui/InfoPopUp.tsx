"use client";

import React from "react";

export interface InfoProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
}

export const InfoPopUp = ({ children, className = "", ...props }: InfoProps) => {
    return (
        <button
            type="button"
            className={`group relative flex items-center justify-center w-5 h-5 rounded-full border-2 border-muted-fg 
                text-muted-fg hover:text-primary-fg hover:border-primary-fg focus:text-primary-fg focus:border-primary-fg 
                focus:outline-none transition-colors cursor-pointer text-xs font-semibold ${className}`}
            aria-label="Mais informações"
            {...props}
        >
            <span className="ml-px">?</span>
            <div 
                className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-focus:flex flex-col items-center z-50 w-max max-w-72 bg-card cursor-default"
                onClick={(e) => e.stopPropagation()} 
            >
                <div className="text-default-fg text-xs rounded-md shadow-md p-3 w-full border border-default-border font-normal text-left">
                    {children}
                </div>
                
                {/* Opcional: pequena setinha (triângulo) apontando para baixo */}
                <div className="w-2 h-2 bg-card border-b border-r border-default-border transform rotate-45 -mt-1.5 absolute top-full"></div>
            </div>
        </button>
    );
};