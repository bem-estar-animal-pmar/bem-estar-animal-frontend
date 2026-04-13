import Link from "next/link";

import { Navbar } from "./Navbar"

import Image from "next/image";
import animal_logo from "@/public/animal-logo.svg"

export const Header = () => {

    return (
        <header className="flex fixed w-full items-center justify-center h-18 bg-white/60 backdrop-blur-xs z-50">
            <div className="flex w-full max-w-384 items-center justify-between px-3 sm:px-4 md:px-8 lg:px-12">
                <div className="flex">
                    <Link href="#inicio">
                        <Image
                            src={animal_logo}
                            alt="Logo do Bem-Estar Animal"
                            className="w-full max-w-16 sm:max-18 lg:max-w-20"
                        />
                    </Link>
                </div>
                <Navbar />
            </div>
        </header>
    )
}