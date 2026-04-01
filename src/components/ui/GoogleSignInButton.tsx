"use client";

import React from 'react';
import { GoogleSignInIcon } from '../icons/brand';

interface GoogleSignInButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
}

export const GoogleSignInButton = ({ className="", children, ...props }: GoogleSignInButtonProps) => {
    return (
        <button
            type="button"
            className={`flex w-full items-center justify-center gap-3 rounded-md border border-default-border bg-card px-4 py-2
                text-sm font-medium text-default-fg transition duration-200 focus:outline-none focus-visible:shadow-ring-gray 
                hover:cursor-pointer hover:bg-default disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
            {...props}
        >
            <GoogleSignInIcon />
            {children}
        </button>
    );
}