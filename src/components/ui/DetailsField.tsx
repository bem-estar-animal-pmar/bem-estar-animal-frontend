"use client";
import React from "react";

interface DetailsFieldProps extends React.HTMLAttributes<HTMLElement>{
    children: React.ReactNode;
    title: string;
    className?: string
}

export const DetailsField = ({ children, className = "", title = "" }: DetailsFieldProps) => {
    return (
        <div className={`flex flex-col w-full ${className}`}>
            <p className="text-sm font-medium text-default-fg">
                {title}
            </p>
            <p className="text-muted-fg text-sm pl-1">
                {children}
            </p>
        </div>
    );
};