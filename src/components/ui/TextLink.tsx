"use client"

/* this component uses next/link, for plain react it might need some changes */

import Link, {LinkProps } from "next/link";

interface TextLinkProps extends Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps>, LinkProps {
    children: React.ReactNode;
    className?: string;
    variant?: 'default'| 'muted' | 'primary' | 'danger';
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeVariants = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
    xl: "text-lg",
};

const colorVariants = {
    default: "text-default-fg",
    muted: "text-muted-fg",
    primary: "text-brand-fg",
    danger: "text-danger-fg"
};

export const TextLink = ({ children, className = "", variant = "default", size = "md", ...props }: TextLinkProps) => {

    const colors = colorVariants[variant];
    const sizing = sizeVariants[size];

    return (
        <Link  
            className={`font-medium hover:underline transition-colors ${colors} ${sizing} ${className}`}
            {...props}
        >
            {children}
        </Link>
    );
};