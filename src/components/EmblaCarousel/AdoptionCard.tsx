"use client";

import React from "react";
import Image, { StaticImageData } from "next/image"; 
import { translateTable } from "@/src/lib/translation-map";
import { Badge, ButtonLink } from "@/src/components/ui"

interface PetCardProps extends React.HTMLAttributes<HTMLDivElement> {
    name: string;
    imageUrl: string | StaticImageData;
    status: string;
    id: string;
    children?: React.ReactNode;
}

export const AdoptionCard = ({ name, imageUrl, className = "", status, id, ...props }: PetCardProps) => {
    const colors = `bg-card text-default-fg ${status === "ADOPTED" ? "shadow-[4px_4px_#d4d4d4]  sm:shadow-[5px_5px_#d4d4d4] lg:shadow-[6px_6px_#d4d4d4] border-(--neutral-300)" : "shadow-[4px_4px_#AFCE79]  sm:shadow-[5px_5px_#AFCE79] lg:shadow-[6px_6px_#AFCE79] border-(--primary-300)"}`;
    const displaySrc = typeof imageUrl === "string" ? imageUrl : imageUrl?.src;

    return (
        <div 
            className={`flex flex-col items-center max-w-sm overflow-hidden border-3 rounded-sm  ${colors} ${className}`}
            {...props}
        >
            <div className="flex w-full justify-center p-3 sm:p-4 lg:p-6 lg:pb-4 mb-1">
                <Image
                    src={displaySrc} 
                    alt={`Foto de ${name}`} 
                    width={800}
                    height={800}
                    className="w-48 sm:w-60 lg:w-68 aspect-square object-cover h-fit" 
                />
            </div>

            <div className="px-4 lg:px-8 sm:px-6 pb-4 w-full">
                <div className="flex justify-between items-center gap-2 sm:gap-3">
                    <h3 className="font-bold tracking-tight text-lg md:text-xl truncate">
                        {name}
                    </h3>
                    <Badge
                        className={`capitalize px-2.5 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm ${status === "ADOPTED" ? "bg-red-100! text-red-800! border-red-200!" : "bg-green-100! text-green-800! border-green-200!"}`}
                    >
                        {translateTable(status).toLowerCase()}
                    </Badge>
                </div>
            </div>
            <div className="flex w-full  border-t border-primary-border max-w-76 "></div>
            <div className=" w-full flex px-4 lg:px-8 sm:px-6 p-2 sm:p-3 justify-center">
                <ButtonLink
                    href={status === "ADOPTED" ? "/adoption" : `/adoption?petId=${id}`}
                    variant="primary" 
                    className={`w-full ${status === "ADOPTED" ? "bg-(--neutral-300)! text-(--neutral-900)!" : "bg-(--primary-300)! text-(--primary-900)!"}`}
                >
                    {status === "FOR_ADOPTION" ? "EU QUERO" : "VER OUTROS"}
                </ButtonLink>
            </div>
        </div>
    );
};