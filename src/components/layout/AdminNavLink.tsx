"use client";

import React from "react";
import Link from "next/link";

interface AdminNavLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    children: React.ReactNode;
    href: string;
    className?: string;
    variant?: 'default'| 'primary';
    size?: 'sm' | 'md' | 'lg' | 'xl';
    pill?: 'true' | 'false';
    active?: boolean;
}

const sizeVariants = {
    sm: "text-xs",
    md: "text-xs sm:text-sm",
    lg: "text-base",
    xl: "text-lg",
};

const colorVariants = {
    default: "text-muted-fg hover:bg-default border-transparent",
    primary: "text-muted-fg hover:bg-primary border-transparent",
};

const activeColorVariants = {
    default: "bg-default text-muted-fg border-default-accent-border",
    primary: "bg-primary text-primary-fg border-primary-border"
};

export const AdminNavLink = ({ children, href, className = "", variant = "default", size = "md", pill = "false", active = false, ...props }: AdminNavLinkProps) => {
    const colors = active === true ? activeColorVariants[variant] : colorVariants[variant];
    const sizing = sizeVariants[size];
    const rounding = pill === "true" ? "rounded-full" : "rounded-md"

    return (
        <Link 
            href={href}
            className={` px-4 py-1 transition-colors duration-200 border  focus-visible:outline-none focus-visible:shadow-ring-primary
                inline-flex focus:outline-none cursor-pointer ${rounding} ${colors} ${sizing} ${className}`}
            {...props}
        >
            {children}
        </Link>
    );
};