"use client";

import React, { useEffect, useState } from "react";
import { XIcon } from "@/src/components/icons/outline";

/* usage: 
    <Dialog 
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        title="This is a title"
    >
        * modal content here *
    </Dialog>
*/

export interface DialogProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    className?: string;
    size?: "sm" | "md" | "lg" | "xl"; 
}

const sizeVariants = {
    sm: "p-4 max-w-88 text-sm",
    md: "p-4 max-w-104 text-sm",
    lg: "p-6 max-w-128 text-base",
    xl: "p-6 max-w-144 text-base",
};

export const Dialog = ({ isOpen = false, onClose, title, children, className = "", size = "sm" }: DialogProps) => {

    /* we have isMounted here because we can't only rely on 'isOpen' to remove this element from the DOM, if we did
    so, it would entirely skip the closing animation, so here isOpen is used to trigger animations, and when the animation
    ends, isMounted is set to false (thanks to onAnimationEnd) finally removing the element from the DOM */
    const [isMounted, setIsMounted] = useState(isOpen);

    /* logic here is: isOpen === true -> isMounted instantly goes to true and opening animation starts 
    isOpen === false -> closing animation starts, when it ends, handleAnimationEnd is called, it sets isMountend to false
    completely removing the element from the DOM */

    if (isOpen && !isMounted) {
        setIsMounted(true);
    }

    /* this is used to prevent scrolling on dom if the modal is open */
    useEffect(() => {
        isOpen ? document.body.style.overflow = "hidden" : document.body.style.overflow = "unset";
        return () => { 
            document.body.style.overflow = "unset"; 
        };
    }, [isOpen]);

    const handleAnimationEnd = () => {
        if (!isOpen) {
            setIsMounted(false);
        }
    };

    /* completely removes the dialog from the screen if it is not open */
    if (!isOpen && !isMounted) {
        return null;
    }

    const sizing = sizeVariants[size];

    return (
        <div className="fixed inset-0 z-1000 flex items-center justify-center">
            <style>
                {`
                    @keyframes dialogFadeIn {
                        from { opacity: 0; }
                        to { opacity: 1; }
                    }
                    @keyframes dialogFadeOut {
                        from { opacity: 1; }
                        to { opacity: 0; }
                    }
                    @keyframes dialogSlideIn {
                        from { opacity: 0; transform: translateY(1rem) scale(0.95); }
                        to { opacity: 1; transform: translateY(0) scale(1); }
                    }
                    @keyframes dialogSlideOut {
                        from { opacity: 1; transform: translateY(0) scale(1); }
                        to { opacity: 0; transform: translateY(1rem) scale(0.95); }
                    }
                `}
            </style>

            {/* backdrop */}
            <div 
                className="fixed inset-0 bg-black/40 backdrop-blur-sm"
                style={{ animation: isOpen ? "dialogFadeIn 200ms ease-out forwards" : "dialogFadeOut 200ms ease-out forwards" }}
                onClick={onClose}
                aria-hidden="true"
            />

            <div 
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? "dialog-title" : undefined}
                onAnimationEnd={handleAnimationEnd}
                className={`relative z-1000 flex w-full mx-4 flex-col rounded-md border border-default-border bg-card shadow-md 
                    text-default-fg ${sizing} ${className}`}
                style={{ animation: isOpen ? "dialogSlideIn 200ms ease-out forwards" : "dialogSlideOut 200ms ease-out forwards" 
                }}
            >
                <div className="flex w-full justify-between items-center">
                    <h2 
                        id="dialog-title" 
                        className="w-full font-semibold"
                    >
                        {title}
                    </h2>
                    <button
                        className="rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 
                        focus:ring-default-border cursor-pointer"
                        onClick={onClose}
                        aria-label="Close dialog"
                    >
                        <XIcon size={20} />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};