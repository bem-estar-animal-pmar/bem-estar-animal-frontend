"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

/* this components needs the following to work */
import { Button } from "./Button";
import { ButtonLink } from "./ButtonLink";
import { MenuIcon, LogoutIcon } from "@/src/components/icons/outline";

interface SidebarProps {
    navItems: { 
        name: string;
        href: string;
        icon: React.ElementType;
    }[];
    onLogout: () => void;
    isLoggingOut: boolean;
    children?: React.ReactNode;
}

export function Sidebar({ navItems = [], onLogout, isLoggingOut = false, children }: SidebarProps) {
    const pathname = usePathname();
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => { 
        const timer = setTimeout(() => {
            setIsExpanded(true);
        }, 300); 
        return () => clearTimeout(timer);
    }, []);

    return (
        <aside 
            className={`min-h-screen flex overflow-hidden bg-card border-r border-default-border transition-[min-width] 
                duration-500 ease-in-out ${isExpanded ? "min-w-64" : "min-w-20"}`}
        >
            <div
                className={`min-h-screen flex flex-col px-4 py-6 gap-y-6 overflow-hidden transition-[width] duration-500 
                    ease-in-out ${isExpanded ? "w-64" : "w-20"}`}
            >
                <div className="flex items-center w-full py-4 justify-center">
                    <div className={`w-full whitespace-nowrap overflow-hidden transition-all duration-500 ease-in-out 
                        ${isExpanded ? "max-w-full opacity-100" : "max-w-0 opacity-0"}`}
                    >
                        {children}
                    </div>
                    <Button
                        onClick={() => setIsExpanded(!isExpanded)}
                        variant="ghost"
                        className="hover:text-default-fg! dark:hover:text-default-fg! w-fit! px-3! hover:bg-default! active:scale-95"
                        aria-label="Expandir ou diminuir sidebar"
                    >
                        <MenuIcon />
                    </Button>
                </div>
                <nav className="flex flex-col gap-2 py-8 w-full">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        
                        return (
                            <ButtonLink
                                key={item.href}
                                href={item.href}
                                variant="ghost"
                                className={`flex transition-all duration-200 w-full ${isActive ? 'bg-default text-default-fg' : ''} active:scale-95`}
                            >
                                <span className="w-fit">
                                    <item.icon />
                                </span>
                                
                                <span
                                    className={`w-full h-fit! text-start whitespace-nowrap overflow-hidden transition-all duration-500 ease-in-out
                                        ${isExpanded ? "max-w-full opacity-100 pl-4" : "max-w-0 opacity-0"}
                                    `}
                                >
                                    {item.name}
                                </span>
                            </ButtonLink>
                        );
                    })}
                </nav>
                <Button
                    className="my-16 hover:text-default-fg! dark:hover:text-default-fg! hover:bg-default! active:scale-95"
                    variant="ghost"
                    onClick={onLogout}
                    disabled={isLoggingOut}
                >
                    <span className="w-fit text-danger-fg">
                        <LogoutIcon/>
                    </span>
                    <span
                        className={`w-full h-fit! text-start whitespace-nowrap overflow-hidden transition-all duration-500 ease-in-out
                            ${isExpanded ? "max-w-full opacity-100 pl-4" : "max-w-0 opacity-0"}
                        `}
                    >
                        {isLoggingOut ? "Saindo..." : "Sair do sistema"}
                    </span>
                </Button>
            </div>
        </aside>
    );
}