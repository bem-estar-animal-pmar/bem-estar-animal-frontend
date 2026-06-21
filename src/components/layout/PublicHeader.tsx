"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import animal_logo from "@/public/animal-logo.svg";

import { PublicNavbar } from "./PublicNavbar";
import { PublicSessionContainer } from "./PublicSessionContainer";
import { MenuIcon, XIcon } from "@/src/components/icons/outline"; 
import { Button } from "@/src/components/ui";

export const PublicHeader = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isMenuOpen]);

    return (
        <>
            <header className="flex fixed top-0 w-full items-center justify-center h-16 backdrop-blur-xs z-40">
                <div className="flex w-full max-w-384 items-center justify-between px-3 sm:px-4 md:px-8 lg:px-12">
                    
                    <div className="flex bg-white/20 px-4 py-1 rounded-md">
                        <Link href="#inicio">
                            <Image
                                src={animal_logo}
                                alt="Logo do Bem-Estar Animal"
                                className="w-full max-w-16 sm:max-w-[72px]"
                            />
                        </Link>
                    </div>

                    <div className="hidden md:flex">
                        <PublicNavbar />
                    </div>
                    
                    <div className="hidden md:flex">
                        <PublicSessionContainer />
                    </div>

                    <Button
                        className="md:hidden border-2! px-1.5! text-primary-fg!"
                        aria-label="Abrir Menu"
                        aria-expanded={isMenuOpen}
                        aria-controls="mobile-drawer"
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsMenuOpen(true)}
                    >
                        <MenuIcon size={24} />
                    </Button>
                </div>
            </header>

            <div
                className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity duration-300 ease-in-out md:hidden ${
                    isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setIsMenuOpen(false)}
                aria-hidden="true"
            />

            <div
                id="mobile-drawer"
                role="dialog"
                aria-modal="true"
                aria-labelledby="drawer-title"
                className={`fixed top-0 right-0 h-full w-64 bg-white divide-y divide-default-border shadow-2xl z-50 transform transition-transform duration-300 ease-in-out md:hidden flex flex-col ${
                    isMenuOpen ? "translate-x-0" : "translate-x-full"
                }`}
            >
                <div className="flex items-center justify-between py-2 px-4">
                    <span id="drawer-title" className="text-muted-fg font-semibold">
                        Navegação
                    </span>
                    <Button
                        aria-label="Fechar Menu"
                        className="px-0!"
                        variant="ghost"
                        onClick={() => setIsMenuOpen(false)}
                    >
                        <XIcon size={24} /> 
                    </Button>
                </div>
                
                <div className="flex flex-col py-4 px-6 gap-4 divide-y divide-default-border">
                    <div className="flex flex-col items-start gap-4 pb-4">
                        <PublicNavbar />
                    </div>
                    <PublicSessionContainer />
                </div>
            </div>
        </>
    );
};