"use client";

import React, { useId } from "react";

/* 
this component wraps a native radio input. by sharing the same 'name' prop across multiple Radio components,
the browser natively handles mutually exclusive selection (only one can be checked at a time).

like input and select components, this can be used UNCONTROLLED (letting the form handle the data onSubmit)
or CONTROLLED (passing checked and onChange props managed by React state). 

usage:

<Radio name="subscriptionPlan" value="basic" label="Basic Plan ($9/mo)" defaultChecked />
<Radio name="subscriptionPlan" value="pro" label="Pro Plan ($19/mo)" variant="primary" />
<Radio name="subscriptionPlan" value="enterprise" label="Enterprise ($99/mo)" variant="primary" disabled />

controlled:

<Radio 
    name="plan" 
    value="basic" 
    label="Basic Plan" 
    checked={selectedPlan === "basic"} 
    onChange={(e) => setSelectedPlan(e.target.value)} 
/> */

export interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    variant?: 'default' | 'primary' | 'danger';
    textSize?: 'sm' | 'md' | 'lg' | 'xl';
}

const wrapperStyles = {
    default: "border-default-border peer-checked:border-default-accent-border peer-focus-visible:shadow-ring-gray peer-checked:[&>div]:scale-100",
    primary: "border-primary-border peer-checked:border-primary-accent-border peer-focus-visible:shadow-ring-primary peer-checked:[&>div]:scale-100",
    danger:  "border-danger-border peer-checked:border-danger-border peer-focus-visible:shadow-ring-danger peer-checked:[&>div]:scale-100",
};

const dotStyles = {
    default: "bg-btn-default text-btn-default-fg",
    primary: "bg-btn-primary text-btn-primary-fg",
    danger:  "bg-btn-danger text-btn-danger-fg",
};

const textSizeVariants = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
};

const innerCircleSizeVariants = {
    sm: "w-2 h-2",
    md: "w-2 h-2",
    lg: "w-2.5 h-2.5",
    xl: "w-2.5 h-2.5",
};

const outerCircleSizeVariants = {
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
    xl: "w-5 h-5",
};

export const Radio = ({ className = "", variant = "default", textSize = "md", label, ...props}: RadioProps) => {
    const wrapperColor = wrapperStyles[variant];
    const dotColor = dotStyles[variant];
    const textSizing = textSizeVariants[textSize];
    const innerCircleSizing = innerCircleSizeVariants[textSize];
    const outerCircleSizing = outerCircleSizeVariants[textSize];

    return (
        <label className={`flex items-center cursor-pointer ${className}`}>
            <input
                type="radio"
                className="peer sr-only"
                {...props}
            />
            
            <div 
                className={`flex items-center justify-center ${outerCircleSizing} rounded-full border bg-transparent transition-all duration-200 
                    peer-disabled:opacity-50 peer-disabled:cursor-not-allowed ${wrapperColor}`}
                aria-hidden="true"
            >
                <div 
                    className={`rounded-full scale-0 transition-transform duration-200 ${dotColor} ${innerCircleSizing}`} 
                />
            </div>

            {label && (
                <span 
                    className={`ml-3 text-default-fg select-none peer-disabled:opacity-50 peer-disabled:cursor-not-allowed ${textSizing}`}
                >
                    {label}
                </span>
            )}
        </label>
    );
};