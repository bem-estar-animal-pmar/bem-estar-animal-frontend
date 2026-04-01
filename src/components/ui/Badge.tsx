"use client";

import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
    variant?: 'default' | 'primary';
    size?: 'sm' | 'md' | 'lg';
    pill?: 'true' | 'false';
}

const sizeVariants = {
    sm: "h-6 px-3 text-xs",
    md: "h-8 px-4 text-sm",
    lg: "h-10 px-5 text-base",
};

const colorVariants = {
    primary: "bg-primary text-primary-fg border border-transparent",
    default: "bg-default text-default-fg border border-default-border",
};

export const Badge = ({ children, className = "", variant = "primary", size = "sm", pill = "true", ...props }: BadgeProps) => {

    const colors = colorVariants[variant];
    const sizing = sizeVariants[size];
    const rounding = pill === "true" ? "rounded-full" : "rounded-md";

    return (
        <span 
            className={`inline-flex items-center justify-center font-medium transition-colors whitespace-nowrap ${colors} ${sizing} ${rounding} ${className}`}
            {...props}
        >
            {children}
        </span>
    );
};