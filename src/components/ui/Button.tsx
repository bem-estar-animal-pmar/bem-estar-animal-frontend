"use client";

import React from "react";

/* buttons should be used only for actions not related to navigation, like login buttons, logout buttons, etc.
link buttons are anchors (or Link component on next) and they should be used almost always when you just need to travel to a
new page, it is better for SEO */

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    variant?: 'default'| 'primary' | 'danger' | 'outline' | 'outline-default' | 'ghost' | 'ghost-default';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    pill?: 'true' | 'false';
}

const sizeVariants = {
    sm: "h-8 px-3 text-xs",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-8 text-base",
    xl: "h-14 px-10 text-lg",
};

const colorVariants = {
    default: "bg-btn-default text-btn-default-fg border-transparent hover:opacity-90 focus-visible:shadow-ring-gray",
    primary: "bg-btn-primary text-btn-primary-fg border-transparent hover:opacity-90 focus-visible:shadow-ring-primary",
    danger:  "bg-btn-danger text-btn-danger-fg border-transparent hover:opacity-90 focus-visible:shadow-ring-danger",
    outline: "bg-btn-outline text-btn-outline-fg border-primary-border hover:bg-btn-accent hover:text-btn-accent-fg focus-visible:shadow-ring-primary",
    "outline-default": "bg-btn-outline text-default-fg border-default-border hover:bg-btn-accent-default hover:text-btn-accent-default-fg focus-visible:shadow-ring-gray",
    ghost:   "bg-btn-ghost text-btn-ghost-fg border-transparent hover:bg-btn-accent hover:text-btn-accent-fg focus-visible:shadow-ring-primary",
    "ghost-default": "bg-btn-ghost text-default-fg border-transparent hover:bg-btn-accent-default hover:text-btn-accent-default-fg focus-visible:shadow-ring-gray",
};

export const Button = ({ children, className = "", variant = "default", size = "md", pill = "false", ...props }: ButtonProps) => {
    
    const colors = colorVariants[variant];
    const sizing = sizeVariants[size];
    const rounding = pill === "true" ? "rounded-full" : "rounded-md";

    return (
        <button 
            className={`flex items-center justify-center font-medium transition duration-200 border
                focus:outline-none disabled:opacity-50 disabled:pointer-events-none cursor-pointer 
                ${colors} ${sizing} ${rounding} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};