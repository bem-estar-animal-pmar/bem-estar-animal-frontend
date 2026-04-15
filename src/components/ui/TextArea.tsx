"use client";

import React from "react";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    variant?: 'default' | 'primary' | 'danger';
    resize?: 'none' | 'x' | 'y'
}

const variantStyles = {
    default: "border-default-border focus:border-default-accent-border focus:shadow-ring-gray",
    primary: "border-primary-border focus:border-primary-accent-border focus:shadow-ring-primary",
    danger:  "border-danger-border focus:border-danger-border focus:shadow-ring-danger",
};

const resizeStyles = {
    "none": "resize-none",
    "x": "resize-x",
    "y": "resize-y",
}

export const Textarea = ({ className = "", variant = "default", resize = "none", ...props }: TextareaProps) => {
    const colors = variantStyles[variant];
    const resizing = resizeStyles[resize];
    const sizing = "min-h-[100px] py-3 px-4 text-sm";

    return (
        <textarea
            className={`flex w-full rounded-md border bg-transparent text-default-fg placeholder:text-muted-fg
                transition duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-default
                ${colors} ${sizing} ${resizing} ${className}`}
            {...props}
        />
    );
};