"use client";

import React from "react";
import Image, { StaticImageData } from "next/image"; 

interface PetCardProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    imageUrl: string | StaticImageData;
    age: string | number;
    children?: React.ReactNode;
}

export const AdoptionCard = ({ 
    name, 
    imageUrl, 
    children, 
    className = "", 
    ...props 
}: PetCardProps) => {

    const colors = "bg-card text-default-fg border-primary-border";
    const displaySrc = typeof imageUrl === "string" ? imageUrl : imageUrl?.src;

    return (
        <div 
            className={`flex flex-col items-center max-w-sm overflow-hidden border rounded-md shadow-[4px_4px_#C9DF9E] ${colors} ${className} duration-200 hover:scale-105`}
            {...props}
        >
            <div className="flex w-full justify-center p-3 sm:p-4 lg:p-8 lg:pb-4 mb-1">
                <Image
                    src={displaySrc} 
                    alt={`Foto de ${name}`} 
                    width={800}
                    height={800}
                    className="w-48 sm:w-60 lg:w-68 rounded-md" 
                />
            </div>

            <div className="px-4 lg:px-8 sm:px-6 pb-4 sm:pb-6 lg:pb-8 w-full">
                <div className="flex justify-between items-center gap-2 sm:gap-3">
                    <h3 className="font-bold tracking-tight text-lg md:text-xl truncate">
                        {name}
                    </h3>
                    <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold bg-primary text-primary-fg border border-transparent">
                        Ver mais
                    </span>
                </div>
                
                {children && (
                    <div className="mt-4">
                        {children}
                    </div>
                )}
            </div>
        </div>
    );
};