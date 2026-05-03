"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react"; 
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/error-map";

import type { Pet } from "@/src/constants/interfaces";

import { Card } from "@/src/components/ui";
import { UpdatePetForm } from "@/src/components/features/admin-dashboard/UpdatePetForm";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";

export default function AdminPetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id: petId } = use(params);
    const [pet, setPet] = useState<Pet | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPet = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/details/${petId}`, {
                credentials: "include",
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new ApiError(responseData.message, responseData.code, responseData.details);
            }
            
            setPet(responseData);
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                if (err.details) {
                    const firstError = err.details[0]?.message
                    toast.danger(translateError(err.message), { message: firstError })
                    return;
                }
                toast.danger(translateError(err.message));
                return;
            }
            toast.danger("Erro desconhecido ao carregar pets.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (petId) {
            fetchPet();
        }
    }, [petId]);

    const handleUpdatePet = (updatedFields: any) => {
        setPet((prev: any) => ({
            ...prev,
            ...updatedFields
        }));
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <SpinnerIcon />
            </div>
        );
    }

    if (!pet) {
        return <div className="p-8 text-center text-muted-fg">
            Pet não encontrado.
        </div>;
    }

    return (
        <div className="w-full flex flex-col items-center">
            <div className="flex w-full flex-wrap justify-between items-center border-b border-default-border mb-4 pb-2">
                <div className="flex flex-col pb-4">
                    <h1 className="font-semibold text-xl sm:text-xl lg:text-2xl text-default-fg">
                        Informações do pet
                    </h1>
                    <p className="text-muted-fg text-sm sm:text-base">
                        Visualize e modifique as informações de {pet.name} abaixo. 
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full">
                <Card
                    size="lg"
                    className="shadow-none!"
                >
                    <h3 className="text-base lg:text-lg font-semibold pb-4">Gerenciar pet</h3>
                    <UpdatePetForm
                        pet={pet}
                        onUpdateSuccess={handleUpdatePet}
                    />
                </Card>

                {pet.owner && (
                    <Card   
                        size="lg"
                        className="shadow-none! h-fit!"
                    >
                        <h3 className="text-base lg:text-lg font-semibold pb-4">
                            Informações do tutor
                        </h3>
                        <div className="flex flex-col w-full pb-4">
                            <p className="text-sm font-medium text-default-fg">Nome completo</p>
                            <span className="text-muted-fg text-xs sm:text-sm">{pet.owner.name} {pet.owner.lastName}</span>
                        </div>
                        <div className="flex gap-6">
                            <div className="flex flex-col flex-1">
                                <p className="text-sm font-medium text-default-fg">E-mail</p>
                                <span className="text-muted-fg text-xs sm:text-sm">{pet.owner.email}</span>
                            </div>
                            <div className="flex flex-col flex-1">
                                <p className="text-sm font-medium text-default-fg">Telefone</p>
                                <span className="text-muted-fg text-xs sm:text-sm">{pet.owner.phone}</span>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}