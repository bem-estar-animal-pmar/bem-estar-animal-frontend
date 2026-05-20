"use client"

import { useEffect, useState } from "react"
import { toast } from "@/src/lib/toast-store"
import { ApiError } from "@/src/lib/api-error"
import { translateError } from "@/src/lib/translation-map"

import Image from "next/image"
import pet_avatar_placeholder from "@/public/pet-avatar-placeholder.webp"

import type { Pet, GiveUpRequestListByUser } from "@/src/constants/interfaces"
import { giveUpStatusMap } from "@/src/constants/constants"

import { CreateGiveUpForm } from "@/src/components/features/dashboard/CreateGiveUpForm"

import { Badge, TextLink, Button, Card } from "@/src/components/ui"
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon"

export default function AdoptionsPage() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [requests, setRequests] = useState<GiveUpRequestListByUser[]>([]);

    const [isLoading, setIsLoading] = useState(true);
    const [isCanceling, setIsCanceling] = useState<string | null>(null);
    
    useEffect(() => {
        loadInitialData();
    }, []);

    const loadInitialData = async () => {
        try {
            setIsLoading(true);

            const [petsResponse, requestsResponse] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/me`, { credentials: "include" }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/adoptions/give-up/me`, { credentials: "include" })
            ]);

            if (!petsResponse.ok || !requestsResponse.ok) {
                const [petsData, requestsData] = await Promise.all([
                    petsResponse.json(),
                    requestsResponse.json()
                ]);
                const data = !petsResponse.ok ? petsData : requestsData;
                throw new ApiError(data.message, data.code, data.details);
            }
            
            const [petsData, requestsData] = await Promise.all([
                petsResponse.json(),
                requestsResponse.json()
            ]);

            setPets(petsData);
            setRequests(requestsData);

        } catch (err: unknown) { 
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível carregar dados."
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancelRequest = async (requestId: string) => {
        try {
            setIsCanceling(requestId);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/adoptions/give-up/${requestId}/cancel`, {
                method: "PATCH",
                credentials: "include"
            });

            const data = await response.json();

            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success("Solicitação de doação cancelada com sucesso.");
            loadInitialData();
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível cancelar pedido."
            });
        } finally {
            setIsCanceling(null);
        }
    };

    const handleGiveUpCreated = () => {
        loadInitialData();
    };
    
    if (isLoading) {
        return (
            <div className="w-full flex justify-center items-center h-64">
                <SpinnerIcon />
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col">
            <div className="w-full flex justify-between items-center flex-wrap gap-y-2 pb-4">
                <h1 className="text-default-fg font-semibold text-xl sm:text-2xl lg:text-3xl text-center lg:text-start">
                    Disponibilizar para <span className="text-primary-fg">adoção</span>
                </h1>
            </div>

            <p className="text-muted-fg text-sm sm:text-base pb-8">
                Nesta página você pode solicitar que seu pet seja colocado na vitrine de adoções. Após a aprovação da nossa equipe, 
                o perfil do seu pet ficará visível publicamente. Note que você precisará se comprometer a atuar como lar temporário 
                até que a adoção seja finalizada. Leia nossas {" "}
                <TextLink 
                    href="/rules/adoption-rules" 
                    variant="primary"
                    className="underline! text-sm! sm:text-base!"
                >
                    regras de doação
                </TextLink> {" "}
                para mais detalhes.
            </p>

            <div className="flex justify-center pb-8">
                <Card
                    size="lg"
                    className="max-w-148 border-primary-border"
                >
                    <p className="font-semibold text-default-fg">Formulário de envio para adoção</p>
                    <CreateGiveUpForm
                        pets={pets}
                        onSuccess={handleGiveUpCreated}
                    />
                </Card>
            </div>

            <div className="w-full p-4 md:p-6 border border-primary-border rounded-md mb-8">
                <h2 className="text-default-fg font-bold text-lg sm:text-xl pb-6">
                    Histórico de solicitações
                </h2>
                
                {requests.length === 0 ? (
                    <p className="text-muted-fg text-sm">Você ainda não possui solicitações de doação.</p>
                ) : (
                    <div className="flex flex-col w-full gap-4">
                        {requests.map((req) => {
                            const statusInfo = giveUpStatusMap[req.status] || { label: req.status, classes: "bg-gray-100 text-gray-800 border-gray-200" };
                            const canCancel = req.status === "PENDING";

                            return (
                                <Card 
                                    key={req.id} 
                                    size="sm"
                                    className="flex flex-row flex-wrap p-4 gap-4 items-start sm:items-center justify-between shadow-sm!"
                                >
                                    <div className="flex items-center flex-wrap gap-y-1 gap-x-4 w-full justify-between">
                                        <div className="flex items-center gap-4">
                                            <Image 
                                                src={pet_avatar_placeholder} 
                                                className="w-12 h-12 rounded-full object-cover" 
                                                alt="Avatar" 
                                            />
                                            <div className="flex flex-col">
                                                <h3 className="font-semibold text-default-fg truncate">{req.pet.name}</h3>
                                                <p className="text-xs text-muted-fg">
                                                    Solicitado em {new Date(req.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-center gap-1">
                                            <Badge className={` ${statusInfo.classes}`}>
                                                {statusInfo.label}
                                            </Badge>
                                            {req.approvedAt ? (
                                                <p className="text-xs text-muted-fg">
                                                   Em {new Date(req.approvedAt).toLocaleDateString()}
                                                </p>
                                                ) : ""
                                            }
                                        </div>

                                        <div className="flex">
                                        {canCancel ? (
                                            <Button 
                                                variant="danger" 
                                                size="sm" 
                                                onClick={() => handleCancelRequest(req.id)}
                                                disabled={isCanceling === req.id}
                                            >
                                                {isCanceling === req.id ? 
                                                    <span className="flex gap-2 items-center">
                                                        <SpinnerIcon/> Cancelando... 
                                                    </span>
                                                : 
                                                    "Cancelar solicitação"
                                                }
                                            </Button>
                                        ) : (
                                            <span className="text-xs text-muted-fg italic">Sem ações disponíveis</span>
                                        )}
                                        </div>
                                    </div>
                                </Card>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>   
    )
}