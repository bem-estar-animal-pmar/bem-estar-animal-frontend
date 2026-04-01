"use client";

import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLElement>{
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl'; 
}

const sizeVariants = {
    sm: "p-2",
    md: "p-4",
    lg: "p-6",
    xl: "p-8",
};

export const Card = ({ children, className = "", size = "sm" }: CardProps) => {

    const colors = "bg-card text-default-fg border-default-border";
    const sizing = sizeVariants[size];

    return (
        <div 
            className={`w-full border shadow-md rounded-md ${colors} ${sizing} ${className}`}
        >
            {children}
        </div>
    );
};