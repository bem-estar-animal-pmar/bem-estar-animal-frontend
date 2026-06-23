"use client"

import Image from "next/image";
import pet_dummy_one from "@/public/adoption_pet_placeholder_1.webp"
import pet_dummy_two from "@/public/adoption_pet_placeholder_2.webp"
import pet_dummy_three from "@/public/adoption_pet_placeholder_3.webp"
import arrow_image from "@/public/arrow.webp"
import { ButtonLink } from "@/src/components/ui"
import { SparkleIcon } from "@/src/components/icons/outline"
import { EmblaCarousel } from "@/src/components/EmblaCarousel/EmblaCarousel"
import { AdoptionCard } from "@/src/components/EmblaCarousel/AdoptionCard"

const myElements = [
    <AdoptionCard key="ralf" name="Ralf" imageUrl={pet_dummy_one.src} age={12} />,
    <AdoptionCard key="bruno" name="Bruno" imageUrl={pet_dummy_two.src} age={8} />,
    <AdoptionCard key="ana" name="Ana" imageUrl={pet_dummy_three.src} age={4} />,
];

export const AdoptionSection = () => {
    return (
        <section className="w-full flex flex-col items-center justify-center px-4 gap-y-8 py-16 max-w-384">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-around w-full gap-y-6">
                <h2 className="text-default-fg font-bold text-2xl lg:text-3xl text-center sm:text-left order-1 sm:w-auto items-center flex justify-center">
                    Conheça os bichinhos de Angra
                </h2>

                <div className="flex items-center justify-center gap-12 sm:gap-4 order-4 sm:order-1 sm:w-auto">
                    <Image
                        src={arrow_image}
                        alt="Seta indicativa"
                        className="max-w-20" 
                    />
                    <ButtonLink
                        href="/adoption"
                        variant="outline"
                        className="rounded-none! flex gap-2 shadow-[4px_4px_0_#C9DF9E] md:h-12 md:px-8 md:text-base"
                        size="md"
                    >
                        Veja todos <SparkleIcon size={18}/>
                    </ButtonLink>
                </div>

                <p className="text-muted-fg text-sm md:text-base text-center order-2 sm:w-full">
                    Disponibilizamos animais para adoção no município, acesse a lista completa e adote um amigo.
                </p>

                <div className="order-3 sm:w-full">
                    <EmblaCarousel 
                        slides={myElements} 
                        buttonsPosition="center" 
                        dotsPosition="end" 
                        showBorder={false}
                    />
                </div>

            </div>
        </section>
    );
};