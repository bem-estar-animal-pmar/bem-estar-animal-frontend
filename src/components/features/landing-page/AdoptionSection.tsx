"use client"

import { useState, useEffect } from "react";

import Image from "next/image";
import pet_dummy_one from "@/public/adoption_pet_placeholder_1.webp"
import pet_dummy_two from "@/public/adoption_pet_placeholder_2.webp"
import pet_dummy_three from "@/public/adoption_pet_placeholder_3.webp"
import pet_dummy_four from "@/public/adoption_pet_placeholder_4.webp"
import pet_dummy_five from "@/public/adoption_pet_placeholder_5.webp"

import arrow_image from "@/public/arrow.webp"
import { ButtonLink } from "@/src/components/ui"
import { SparkleIcon } from "@/src/components/icons/outline"
import { EmblaCarousel } from "@/src/components/EmblaCarousel/EmblaCarousel"

import { AdoptionCard } from "@/src/components/EmblaCarousel/AdoptionCard"
import type { PetForAdoption } from "@/src/constants/interfaces";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/translation-map";

const DUMMY_PETS = [
    { id: "dummy-1", name: "Gigante", imageUrl: pet_dummy_one.src, status: "ADOTADO" },
    { id: "dummy-2", name: "Bruno", imageUrl: pet_dummy_two.src, status: "ADOTADO" },
    { id: "dummy-3", name: "Neve", imageUrl: pet_dummy_three.src, status: "ADOTADO" },
    { id: "dummy-4", name: "Rodrigo Caio", imageUrl: pet_dummy_four.src, status: "ADOTADO" },
    { id: "dummy-5", name: "Marrom", imageUrl: pet_dummy_five.src, status: "ADOTADO" }
];

const initialDummyCards = DUMMY_PETS.map(dummy => (
    <AdoptionCard key={dummy.id} name={dummy.name} imageUrl={dummy.imageUrl} status={dummy.status} />
));

export const AdoptionSection = () => {
    const [slides, setSlides] = useState<React.ReactNode[]>(initialDummyCards);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAdoptionPets = async () => {
            try {
                setIsLoading(true);
                
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/adoption`);
                const data = await response.json();

                if (!response.ok) {
                    throw new ApiError(data.message, data.code, data.details);
                }

                const fetchedPets: PetForAdoption[] = data;

                const realPetCards = fetchedPets.map(pet => (
                    <AdoptionCard 
                        key={pet.id} 
                        name={pet.name} 
                        imageUrl={pet.image || pet_dummy_one.src}
                        status="PARA ADOÇÃO" 
                    />
                ));

                const neededDummiesCount = Math.max(0, 5 - realPetCards.length);

                const supplementalDummyCards = DUMMY_PETS.slice(0, neededDummiesCount).map(dummy => (
                    <AdoptionCard 
                        key={dummy.id} 
                        name={dummy.name} 
                        imageUrl={dummy.imageUrl} 
                        status={dummy.status} 
                    />
                ));

                setSlides([...realPetCards, ...supplementalDummyCards]);

            } catch (err: unknown) {
                if (err instanceof ApiError) {
                    toast.danger(translateError(err.code), { 
                        message: translateError(err.details?.[0]?.message || err.message)
                    });
                } else {
                    toast.danger("Erro desconhecido", {
                        message: "Não foi possível carregar os pets para adoção."
                    });
                }
                
                setSlides(initialDummyCards);
            } finally {
                setIsLoading(false);
            }
        };

        fetchAdoptionPets();
    }, []);

    return (
        <section className="w-full flex flex-col items-center justify-center px-4 gap-y-8 py-16 max-w-384 ">
            <div className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-around w-full gap-y-6 ">
                <h2 className="text-default-fg font-bold text-2xl lg:text-3xl text-center sm:text-left order-1 sm:w-auto items-center flex justify-center w-full">
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

                <div className="order-3 sm:max-w-296 w-full min-w-0">
                    <EmblaCarousel 
                        slides={slides} 
                        buttonsPosition="center" 
                        dotsPosition="end" 
                        showBorder={false}
                    />
                </div>

            </div>
        </section>
    );
};