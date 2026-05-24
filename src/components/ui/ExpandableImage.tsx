"use client";

import React, { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";
import { SearchIcon, XIcon } from "@/src/components/icons/outline";

export const ExpandableImage = ({ src, alt, className = "", ...props }: ImageProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    if (isExpanded && !isMounted) {
        setIsMounted(true);
    }

    useEffect(() => {
        isExpanded ? document.body.style.overflow = "hidden" : document.body.style.overflow = "unset";
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isExpanded]);

    const handleAnimationEnd = () => {
        if (!isExpanded) {
            setIsMounted(false);
        }
    };

    return (
        <>
            <div className="relative cursor-zoom-in group h-fit">
                <Image
                    src={src}
                    alt={alt}
                    className={`transition-opacity group-hover:opacity-80 ${className}`}
                    onClick={() => setIsExpanded(true)}
                    {...props}
                />
                <div className="absolute bottom-0 right-0 text-default-fg group-hover:text-primary-fg">
                    <SearchIcon/>
                </div>
            </div>


            {(isExpanded || isMounted) && (
                <div className="fixed inset-0 z-1000 flex items-center justify-center">
                    <style>
                        {`
                            @keyframes imageFadeIn {
                                from { opacity: 0; }
                                to { opacity: 1; }
                            }
                            @keyframes imageFadeOut {
                                from { opacity: 1; }
                                to { opacity: 0; }
                            }
                            @keyframes imageZoomIn {
                                from { opacity: 0; transform: scale(0.95); }
                                to { opacity: 1; transform: scale(1); }
                            }
                            @keyframes imageZoomOut {
                                from { opacity: 1; transform: scale(1); }
                                to { opacity: 0; transform: scale(0.95); }
                            }
                        `}
                    </style>

                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-zoom-out"
                        style={{
                            animation: isExpanded
                                ? "imageFadeIn 200ms ease-out forwards"
                                : "imageFadeOut 200ms ease-out forwards",
                        }}
                        onClick={() => setIsExpanded(false)}
                        aria-hidden="true"
                    />

                    <div
                        role="dialog"
                        aria-modal="true"
                        aria-label="Imagem expandida"
                        onAnimationEnd={handleAnimationEnd}
                        className="relative z-1000 flex flex-col items-center justify-center w-full h-full max-w-5xl max-h-[85vh] mx-4 p-4"
                        style={{
                            animation: isExpanded
                                ? "imageZoomIn 200ms ease-out forwards"
                                : "imageZoomOut 200ms ease-out forwards",
                        }}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <button
                            className="absolute -top-6 -right-2 text-white/70 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 rounded-sm p-2 cursor-pointer z-50"
                            onClick={() => {
                                setIsExpanded(false)
                            }}
                            aria-label="Close image"
                        >
                            <XIcon size={24} />
                        </button>

                        <div className="relative w-full h-full">
                            <Image
                                src={src}
                                alt={alt || "Imagem expandida"}
                                fill
                                className="object-contain rounded-md shadow-2xl bg-black"
                                sizes="100vw"
                                quality={100}
                                priority
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};