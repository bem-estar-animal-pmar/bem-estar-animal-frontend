import { SpinnerIcon } from "../icons/SpinnerIcon";
import Image from "next/image";
import sao_bento_logo from "@/public/sao-bento-logo.svg"
import sao_bento_logo_dark from "@/public/sao-bento-logo-dark.svg"

export const Loading = () => {
    return (
        <div className="flex flex-col min-h-screen items-center justify-center bg-default gap-4">
            <div className="flex w-full max-w-50 mb-2 h-12 bg-green/10 text-default-fg">
                PLACEHOLDER LOGO IMAGE
            </div>
            {/*  logo image goes HERE
            <Image
                src={sao_bento_logo}
                alt="Logo"
                className="dark:hidden w-full max-w-50 h-auto mb-2"
            />
            <Image
                src={sao_bento_logo_dark}
                alt="Logo"
                className="hidden dark:block w-full max-w-50 h-auto mb-2"
            />*/}
            <p className="text-xl font-medium text-default-fg animate-pulse">Carregando...</p>
            <span className="text-default-fg">
                <SpinnerIcon size={25} />
            </span>
        </div>
    );
}