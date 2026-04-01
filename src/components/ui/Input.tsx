"use client";

import React from "react";
import { useState } from "react";

import { EyeIcon, EyeClosedIcon } from "@/src/components/icons/outline/";

/* this component has its own internalValue state, so it can work as an uncontrolled component (it works when we dont pass 
value + onChange props to it)

!!! on React, best alternative to use this input is to use like a native controlled select element: putting inside a form, 
adding 'name' to it, and handling the value and onchage with states. 

if you don't need to interact with the data in real-time, like displaying error texts, adding masks to the input, realtime 
validation, you don't need it to be CONTROLLED at all. if you only care about validation after the user clicks "Submit", you
can pretty much let the form handle its values, like adding a submit fuction and extracting the form data onSubmit */

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: 'default' | 'primary' | 'danger';
}

const variantStyles = {
    default: "border-default-border focus:border-default-accent-border focus:shadow-ring-gray",
    primary: "border-primary-border focus:border-primary-accent-border focus:shadow-ring-primary",
    danger:  "border-danger-border focus:border-danger-border focus:shadow-ring-danger",
};

const fileVariantStyles = {
    default: "file:bg-btn-default file:text-btn-default-fg hover:file:opacity-90",
    primary: "file:bg-btn-primary file:text-btn-primary-fg hover:file:opacity-90",
    danger:  "file:bg-btn-danger file:text-btn-danger-fg hover:file:opacity-90"
};

export const Input = ({ className = "", variant = "default", type, ...props }: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);
    
    const colors = variantStyles[variant];
    const fileColors = fileVariantStyles[variant];
    const sizing = "h-12 px-4 text-sm";

    if (type === "password") {
        return (
            <div className="relative flex w-full items-center">
                <input
                    type={showPassword ? "text" : "password"}
                    className={`flex w-full rounded-md border bg-transparent text-default-fg placeholder:text-muted-fg pr-12
                        transition duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-default 
                        ${colors} ${sizing} ${className}`} 
                    {...props}
                />
                <button
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-muted-fg hover:text-default-fg focus:outline-none disabled:opacity-50 cursor-pointer 
                    disabled:cursor-not-allowed hover:disabled:text-muted-fg transition duration-200"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={props.disabled}
                >
                    {showPassword ? <EyeClosedIcon size={20} /> : <EyeIcon size={20} />}
                </button>
            </div>
        );
    }

    if (type === "file") {
        return (
            <input
                type="file"
                className={`flex w-full items-center rounded-md border border-dashed bg-transparent text-default-fg placeholder:text-muted-fg transition 
                    duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-default cursor-pointer 
                    file:mr-2 file:cursor-pointer disabled:file:cursor-not-allowed file:rounded-md text-sm file:py-1 file:px-4 file:text-xs file:font-semibold 
                    file:transition-opacity ${colors} ${fileColors} py-2 px-3 ${className}`}
                {...props}
            />
        );
    }

    return (
        <input
            type={type}
            className={`flex w-full rounded-md border bg-transparent text-default-fg placeholder:text-muted-fg
                transition duration-200 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 
                ${colors} ${sizing} ${className}`}
            {...props}
        />
    );
};