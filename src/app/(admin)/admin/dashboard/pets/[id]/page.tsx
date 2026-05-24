"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use } from "react"; 
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/translation-map";

import type { PetById } from "@/src/constants/interfaces";

import { Card, DetailsField, TextLink, Dialog } from "@/src/components/ui";
import { UpdatePetForm } from "@/src/components/features/admin-dashboard/UpdatePetForm";
import { PetStatusCard } from "@/src/components/features/admin-dashboard/PetStatusCard";
import { UpdatePetPhotoForm } from "@/src/components/features/dashboard/UpdatePetPhotoForm";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";

export default function AdminPetDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter();
    const { id: petId } = use(params);
    const [pet, setPet] = useState<PetById | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isImageDialogOpen, setIsImageDialogOpen] = useState(false);

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
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível carregar detalhes do pet."
            });
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

    const handleImageUpdateSuccess = () => {
        setIsImageDialogOpen(false);
        fetchPet(); // Refreshes the data so the new photo is visible
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
                        <TextLink
                            href="/admin/dashboard/pets"
                            variant="primary"
                            className="font-semibold! text-xl! sm:text-xl! lg:text-2xl!"
                        >
                            Pets
                        </TextLink>
                        {" "} - Informações
                    </h1>
                    <p className="text-muted-fg text-sm sm:text-base">
                        Visualize e modifique as informações de {pet.name} abaixo. 
                    </p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-4 w-full">
                <section className="w-full md:w-7/12 lg:w-2/3">
                    <Card size="lg" className="shadow-sm!">
                        <h3 className="text-base lg:text-lg font-semibold">Gerenciar pet</h3>
                        <UpdatePetForm
                            pet={pet}
                            onUpdateSuccess={handleUpdatePet}
                            onOpenImageDialog={() => setIsImageDialogOpen(true)}
                        />
                    </Card>
                </section>

                <div className="w-full md:w-5/12 lg:w-1/3 flex flex-col gap-4">
                    <PetStatusCard 
                        pet={pet} 
                        onUpdateSuccess={handleUpdatePet} 
                    />

                    {pet.owner && (
                        <Card size="lg" className="shadow-sm! flex flex-col gap-4">
                            <h3 className="text-base lg:text-lg font-semibold">
                                Informações do tutor
                            </h3>
                            {pet.adoptionStatus === "ADOPTED" && (
                                <p className="text-xs sm:text-sm text-muted-fg italic">O pet atual foi adotado, as informações abaixo são referente ao tutor original.</p>
                            )}
                            <div className="flex flex-col gap-4">
                                <DetailsField title="Nome completo">
                                    {pet.owner.name} {pet.owner.lastName}
                                </DetailsField>
                                <DetailsField title="Telefone / celular">
                                    {pet.owner.phone}
                                </DetailsField>
                                <DetailsField title="E-mail">
                                    {pet.owner.email}
                                </DetailsField>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            {/* Added Dialog for image update */}
            <Dialog
                isOpen={isImageDialogOpen}
                onClose={() => setIsImageDialogOpen(false)}
                title="Atualizar foto"
                size="md"
            >
                <UpdatePetPhotoForm 
                    pet={pet as any} 
                    onSuccess={handleImageUpdateSuccess} 
                />
            </Dialog>
        </div>
    );
}