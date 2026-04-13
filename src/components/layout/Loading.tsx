import Image from "next/image";
import animal_logo from "@/public/animal-logo.svg"

import { SpinnerIcon } from "../icons/SpinnerIcon";

export const Loading = () => {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-default gap-4">
            <Image
                src={animal_logo}
                alt="Logo do Bem-estar Animal"
                className="w-full max-w-50 h-auto mb-2"
            />
            <p className="text-xl font-medium text-default-fg animate-pulse">Carregando...</p>
            <span className="text-default-fg">
                <SpinnerIcon size={25} />
            </span>
        </div>
    );
}