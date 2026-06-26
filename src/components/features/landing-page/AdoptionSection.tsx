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
import { SpinnerIcon } from "../../icons/SpinnerIcon";

const DUMMY_PETS = [
    { id: "dummy-1", name: "Gigante", imageUrl: pet_dummy_one.src, status: "ADOPTED" },
    { id: "dummy-2", name: "Bruno", imageUrl: pet_dummy_two.src, status: "ADOPTED" },
    { id: "dummy-3", name: "Neve", imageUrl: pet_dummy_three.src, status: "ADOPTED" },
    { id: "dummy-4", name: "Rodrigo Caio", imageUrl: pet_dummy_four.src, status: "ADOPTED" },
    { id: "dummy-5", name: "Marrom", imageUrl: pet_dummy_five.src, status: "ADOPTED" }
];

const initialDummyCards = DUMMY_PETS.map(dummy => (
    <AdoptionCard key={dummy.id} id={dummy.id} name={dummy.name} imageUrl={dummy.imageUrl} status={dummy.status} />
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
                        id={pet.id}
                        imageUrl={pet.image || pet_dummy_one.src}
                        status={"FOR_ADOPTION"}
                    />
                ));

                const neededDummiesCount = Math.max(0, 5 - realPetCards.length);

                const supplementalDummyCards = DUMMY_PETS.slice(0, neededDummiesCount).map(dummy => (
                    <AdoptionCard 
                        key={dummy.id} 
                        id= {dummy.id}
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
        <section className="w-full flex flex-col items-center justify-center gap-y-8 py-16 max-w-384">
            <div className="flex flex-col sm:flex-row sm:flex-wrap justify-between md:justify-around w-full items-center gap-y-6 ">


                        
                <h2 className="text-default-fg font-bold text-2xl md:text-3xl lg:text-4xl order-1 sm:w-auto w-full px-4 sm:px-6">
                    Falta um focinho na sua família?
                </h2>

                <div className="flex items-center justify-end sm:justify-center gap-12 sm:gap-2 order-4 sm:order-1 w-full sm:w-auto px-4 sm:px-6">
                    <Image
                        src={arrow_image}
                        alt="Seta indicativa"
                        className="max-w-20 sm:max-w-16 md:max-w-20 lg:max-w-36" 
                    />
                    <ButtonLink
                        href="/adoption"
                        variant="outline"
                        className="rounded-none! flex gap-2 shadow-[4px_4px_0_#C9DF9E] md:h-12 md:text-base lg:h-14 lg:px-10 lg:text-lg"
                        size="md"
                    >
                        Veja todos <SparkleIcon size={18}/>
                    </ButtonLink>
                </div>

                <p className="text-muted-fg text-sm md:text-base md:text-center order-2 sm:w-full px-4 sm:px-6">
                    Disponibilizamos animais para adoção no município, acesse a lista completa e adote um amigo com responsabilidade.
                </p>

                <div className="order-3 w-full min-w-0">
                    {isLoading ? 
                        <div className="w-full flex justify-center py-16">
                            <SpinnerIcon size={32}/>
                        </div>
                        :
                        <EmblaCarousel 
                            slides={slides} 
                            buttonsPosition="center" 
                            dotsPosition="end" 
                            showBorder={false}
                        />
                    }
                </div>

            </div>
        </section>
    );
};