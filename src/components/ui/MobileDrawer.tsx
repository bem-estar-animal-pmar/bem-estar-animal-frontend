"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

/* this components needs the following to work */
import { Button } from "./Button";
import { ButtonLink } from "./ButtonLink";
import { MenuIcon, LogoutIcon } from "@/src/components/icons/outline";

interface MobileDrawerProps {
    navItems: { 
        href: string;
        icon: React.ElementType;
    }[];
    onLogout: () => void;
    isLoggingOut: boolean;
}

export function MobileDrawer({ navItems = [], onLogout, isLoggingOut = false }: MobileDrawerProps) {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 h-14 right-0 z-1000 flex justify-center items-center bg-card border-t border-default-border">
                <nav className="flex gap-1 sm:gap-2 py-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <ButtonLink
                                key={item.href}
                                href={item.href}
                                variant="ghost"
                                className={`flex w-fit! transition-colors duration-200 ${isActive ? 'bg-default text-default-fg' : ''} active:scale-95`}
                            >
                                <span className="w-fit">
                                    <item.icon />
                                </span>
                            </ButtonLink>
                        );
                    })}
                </nav>
                <Button
                    className="ml-2 sm:ml-4 active:text-default-fg! active:bg-default! active:scale-95"
                    variant="ghost"
                    onClick={onLogout}
                    disabled={isLoggingOut}
                >
                    <span className="w-fit text-danger-fg">
                        <LogoutIcon/>
                    </span>
                </Button>
        </div>
    );
}