"use client";

import React from "react";

/* this component is also a button but with the styling of a simple text anchor */

/* buttons should be used only for actions not related to navigation, like login buttons, logout buttons, etc.
link buttons are anchors (or Link component on next) and they should be used almost always when you just need to travel to a
new page, it is better for SEO */

interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
    variant?: 'default'| 'muted' | 'primary' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeVariants = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
};

const colorVariants = {
    default: "text-default-fg",
    muted: "text-muted-fg",
    primary: "text-brand-fg",
    danger: "text-danger-fg"
};

export const TextButton = ({ children, className = "", variant = "default", size = "md", ...props }: TextButtonProps) => {

    const colors = colorVariants[variant];
    const sizing = sizeVariants[size];

    return (
        <button 
            type="button"
            className={`font-medium hover:underline transition-colors bg-transparent border-none p-0 inline-flex 
                focus:outline-none disabled:pointer-events-none cursor-pointer ${colors} ${sizing} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};