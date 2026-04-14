"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/src/lib/auth-client";
import { ApiError } from "@/src/lib/api-error";

import Image from "next/image";
import pet_avatar_placeholder from "@/public/pet-avatar-placeholder.webp"

import { Button } from "@/src/components/ui/Button";
import { ButtonLink } from "@/src/components/ui/ButtonLink";
import { Badge } from "@/src/components/ui/Badge";
import { Dialog } from "@/src/components/ui/Dialog";
import { Card } from "@/src/components/ui/Card";

import { CreatePetForm } from "@/src/components/features/dashboard/CreatePetForm";

import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import { toast } from "@/src/lib/toast-store";
import { XIcon } from "@/src/components/icons/outline";

interface Pet {
    id: string;
    name: string;
    species: string;
    gender: string;
    breed?: string;
    birthDate: string;
    weight: number;
    coatColor: string;
    chip?: string;
    adoptionStatus: string;
    isTemporaryHome: boolean;
}

export default function DashboardPage() {

    const { data: session, error } = useSession();
    
    const [pets, setPets] = useState<Pet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [fetchError, setFetchError] = useState(false);
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        setIsLoading(true);
        setFetchError(false);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/me`, {
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            setPets(data);
        } catch (err: unknown) { 
            if (err instanceof ApiError) {
                setFetchError(true);
                if (err.details) {
                    const firstError = err.details[0]?.message
                    toast.danger(err.message, {
                        message: firstError
                    })
                    return;
                }
                toast.danger(err.message);
                return
            }
            setFetchError(true);
            toast.danger("Erro desconhecido ao carregar pets.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePetCreated = () => {
        setIsDialogOpen(false);
        fetchPets();
    };

    return (
        <div className="w-full flex flex-col">
            <div className="w-full flex justify-between items-center flex-wrap gap-y-2 pb-4">
                <h1 className="text-default-fg font-semibold text-xl sm:text-2xl lg:text-3xl text-center lg:text-start">
                    Bem-vindo (a), <span className="text-primary-fg">{session?.user.name}</span>!
                </h1>
                <Button 
                    variant="primary" 
                    size="sm"
                    pill="true"
                    onClick={() => setIsDialogOpen(true)}
                >
                    + Cadastrar novo pet
                </Button>
            </div>
            
            <p className="text-muted-fg text-xs sm:text-sm max-w-316">
                Esta é sua área do usuário, aqui você pode ver detalhes sobre seus pets cadastrados, cadastrar novos pets e agendar 
                consultas para eles. Se você cadastrou um pet por engano ou precisa mudar algum dado importante, por favor, 
                entre em contato com a clínica para realizar a edição / remoção do pet.
            </p>
            <p className="text-muted-fg text-xs sm:text-sm py-4">
                No momento você 
                {pets.length > 0 ? ` tem ${pets.length} pet${pets.length === 1 ? "" : "s"}.` : " ainda não tem pets cadastrados."}

            </p>

            {pets.length === 0 &&
                <div className="flex flex-col items-center justify-center p-4 min-h-88 border-2 border-dashed border-primary-border 
                    bg-card rounded-xl gap-y-4">
                    {isLoading ? 
                        <div className="flex justify-center">
                            <SpinnerIcon /> 
                        </div>
                        : 
                        fetchError ? 
                            <>
                                <div className="text-5xl text-muted-fg">
                                    <XIcon size={40}/>
                                </div>
                                <h2 className="text-default-fg font-medium">
                                    Erro ao carregar pets
                                </h2>
                                <Button
                                    variant="outline" 
                                    pill="true"
                                    onClick={fetchPets}
                                >
                                    Tentar novamente
                                </Button>
                            </>
                            :
                            <>
                                <div className="text-5xl">
                                    🐶
                                </div>
                                <h2 className="text-default-fg font-medium">
                                    Nenhum pet cadastrado
                                </h2>
                                <Button
                                    variant="outline" 
                                    pill="true"
                                    onClick={() => setIsDialogOpen(true)}
                                >
                                    Cadastrar meu primeiro pet
                                </Button>
                            </>
                    }
                </div>            
            }
            
            {/* must update the pet display here */}
            {pets.length !== 0 && 
                <div className="border-2 border-dashed border-default-border rounded-xl h-full">
                    <div className="flex flex-col w-full max-w-184 justify-self-center justify-center p-4 gap-4">
                        {pets.map((pet) => (
                            <Card 
                                key={pet.id}
                                className=""
                                size="lg"
                            >
                                <div className="flex w-full">
                                    <Image 
                                        className="max-w-24 self-start justify-self-center rounded-full"
                                        src={pet_avatar_placeholder}
                                        alt="Foto de perfil do pet"
                                    />
                                    <div className="flex flex-col w-full pl-2"> 
                                        <div className="flex w-full flex-wrap items-center justify-between gap-2 pb-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium text-base sm:text-lg text-default-fg truncate">
                                                    {pet.name}
                                                </h3>
                                                <Badge
                                                    variant="primary"
                                                    size="sm"
                                                    pill="true"
                                                >
                                                    {pet.species}
                                                </Badge>
                                            </div>
                                            <p className="text-xs sm:text-sm text-muted-fg flex truncate">
                                                {pet.isTemporaryHome ? "Lar temporário " : "" }
                                                { pet.adoptionStatus }
                                                {/* must update later to properly set status*/}
                                            </p>
                                        </div>      
                                        <div className="flex w-full flex-wrap justify-between max-w-104 gap-2 pb-2">
                                            <div className="flex flex-col max-w-48">   
                                                <p className="text-xs sm:text-sm text-muted-fg flex truncate">
                                                    Raça: {pet.breed}
                                                </p>
                                                <p className="text-xs sm:text-sm text-muted-fg flex">
                                                    Genero: {pet.gender}
                                                </p>
                                            </div>
                                            <div className="flex flex-col">   
                                                <p className="text-xs sm:text-sm text-muted-fg flex truncate">
                                                    Peso: {pet.weight} kg
                                                </p>
                                                <p className="text-xs sm:text-sm text-muted-fg flex">
                                                    Cor da pelagem: {pet.coatColor}
                                                </p>
                                            </div>
                                        </div>                           
                                    </div>
                                </div>
                                <div className="flex w-full justify-between flex-wrap gap-y-2">
                                    <div className="flex flex-col w-full max-w-52">   
                                        <p className="text-xs sm:text-sm text-muted-fg flex truncate">
                                            Nascimento: {new Date(pet.birthDate).toLocaleDateString()}
                                        </p>
                                        <p className="text-xs sm:text-sm text-muted-fg text-end flex">
                                            Identificação: {pet.chip === "NO_CHIP" ? pet.chip : "Sem chip"}
                                        </p>
                                    </div>

                                    <div className="flex gap-2 items-center">
                                            <ButtonLink
                                                variant="outline"
                                                size="sm"
                                                href={`/rules/neutering-rules?petId=${pet.id}`}
                                            >
                                                Agendar castração
                                            </ButtonLink>
                                            <ButtonLink
                                                variant="primary"
                                                size="sm"
                                                href={`/dashboard/schedule?petId=${pet.id}`}
                                            >
                                                Agendar consulta
                                            </ButtonLink>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div> 
                </div>
            }

            <Dialog
                className="text-sm! sm:text-base! max-w-132!"
                isOpen={isDialogOpen}
                size="md"
                onClose={() => setIsDialogOpen(false)}
                title="Cadastrar novo pet"
            > 
                <CreatePetForm 
                    onSuccess={handlePetCreated} 
                    onCancel={() => setIsDialogOpen(false)} 
                />
            </Dialog>
        </div>
    );
}
