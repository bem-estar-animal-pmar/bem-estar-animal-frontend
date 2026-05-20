"use client";

import { useState, useEffect, use } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/error-map";
import { translateTable } from "@/src/lib/table-map";
import { formatRequestNumber } from "@/src/lib/request-formatter";
import { giveUpStatusMap } from "@/src/constants/constants";
import type { AdminGiveUpRequestById } from "@/src/constants/interfaces";

import Image from "next/image";
import pet_avatar_placeholder from "@/public/pet-avatar-placeholder.webp"; 

import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import { HistorySection } from "@/src/components/features/admin-dashboard/HistorySection";
import { UpdateGiveUpStatusForm } from "@/src/components/features/admin-dashboard/UpdateGiveUpStatusForm";
import { Card, TextLink, Badge } from "@/src/components/ui"; 
import { DetailsField } from "@/src/components/ui/DetailsField";

export default function AdminGiveUpDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: requestId } = use(params);
    const [request, setRequest] = useState<AdminGiveUpRequestById | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchRequest = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/adoptions/give-up/details/${requestId}`, {
                credentials: "include",
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new ApiError(responseData.message, responseData.code, responseData.details);
            }
            
            setRequest(responseData); 
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível carregar detalhes do pedido."
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (requestId) {
            fetchRequest();
        }
    }, [requestId]);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <SpinnerIcon />
            </div>
        );
    }

    if (!request) {
        return (
            <div className="p-8 text-center text-muted-fg">
                Pedido não encontrado.
            </div>
        );
    }

    const statusInfo = giveUpStatusMap[request.status] || { label: request.status, classes: "bg-neutral-100 text-neutral-800" };
    const displayDate = request.createdAt ? request.createdAt.split("T")[0].split("-").reverse().join("/") : "Sem data";

    return (
        <div className="w-full flex flex-col items-center">
            <section className="flex w-full flex-wrap justify-between items-center border-b border-default-border mb-4 pb-2">
                <div className="flex flex-col pb-4">
                    <h1 className="font-semibold text-xl sm:text-xl lg:text-2xl text-default-fg">
                        <TextLink
                            href="/admin/dashboard/give-ups"
                            variant="primary"
                            className="font-semibold! text-xl! sm:text-xl! lg:text-2xl!"
                        >
                            Entregas e Adoções
                        </TextLink>
                        {" "} - Doação Nº: {formatRequestNumber("GIVEUP", request.requestNumber)}
                    </h1>
                    <p className="text-muted-fg text-sm sm:text-base">
                        Visualize os dados do pet e avalie a solicitação de entrega para adoção.
                    </p>
                </div>
            </section>
            
            <div className="flex flex-col lg:flex-row gap-4 w-full max-w-284">
                
                <div className="flex flex-col gap-4 w-full lg:w-3/5">
                    
                    <Card size="lg" className="shadow-sm! flex flex-col gap-4">
                        <h3 className="text-lg font-semibold pb-2 border-b border-default-border">
                            Dados do Pet
                        </h3>

                        <div className="flex w-full items-start gap-4 mt-2">
                            <div className="flex flex-col gap-y-4 w-full max-w-80">
                                <DetailsField title="Nome">
                                    {request.pet.name}
                                </DetailsField>
                                <DetailsField title="Nº do chip">
                                    {translateTable(request.pet.chip === "NO_CHIP" ? "Sem chip" : request.pet.chip || "Não informado")}
                                </DetailsField>
                            </div>

                            <Image 
                                className="w-24 h-24 sm:w-28 sm:h-28 sm:mr-4 rounded-full object-cover border border-default-border"
                                src={pet_avatar_placeholder}
                                alt="Foto de perfil do pet"
                            />
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 w-full mt-2">
                            <DetailsField title="Espécie" className="w-full md:w-1/2">
                                {translateTable(request.pet.species)}
                            </DetailsField>
                            <DetailsField title="Raça" className="w-full md:w-1/2">
                                {translateTable(request.pet.breed)}
                            </DetailsField>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 w-full">
                            <DetailsField title="Porte" className="w-full md:w-1/2">
                                {translateTable(request.pet.size)}
                            </DetailsField>
                            <DetailsField title="Gênero" className="w-full md:w-1/2">
                                {translateTable(request.pet.gender)}
                            </DetailsField>
                        </div>

                        <div className="flex flex-col md:flex-row gap-4 w-full">
                            <DetailsField title="Castrado?" className="w-full md:w-1/2">
                                {request.pet.isNeutered ? "Sim" : "Não"}
                            </DetailsField>
                            <DetailsField title="Permite Emergência?" className="w-full md:w-1/2">
                                {request.pet.allowEmergency ? "Sim" : "Não"}
                            </DetailsField>
                        </div>
                    </Card>

                    <HistorySection history={request.history} />

                    <Card size="lg" className="shadow-sm! h-fit!">
                        <h3 className="text-base lg:text-lg font-semibold pb-2 mb-4 border-b border-default-border">
                            Fotos do Pet (Extras)
                        </h3>
                        <div className="flex flex-wrap gap-4 justify-center">
                            {[1, 2, 3].map((index) => (
                                <Image 
                                    key={index}
                                    className="w-24 h-24 sm:w-36 sm:h-36 rounded-md object-cover border border-default-border"
                                    src={pet_avatar_placeholder}
                                    alt={`Foto extra ${index} do pet`}
                                />
                            ))}
                        </div>
                    </Card>

                </div>

                <div className="flex flex-col w-full gap-4 lg:w-2/5">
                    
                    <Card size="lg" className="shadow-sm!">
                        <div className="flex justify-between items-center pb-4 border-b border-default-border mb-4">
                            <h3 className="text-base lg:text-lg font-semibold">
                                Detalhes do Pedido
                            </h3>
                            <Badge className={statusInfo.classes}>
                                {statusInfo.label}
                            </Badge>
                        </div>
                        
                        <div className="flex flex-col gap-4 mb-6">
                            <DetailsField title="Data da solicitação">
                                {displayDate}
                            </DetailsField>
                            
                            <div className="flex flex-col gap-1 w-full">
                                <span className="font-semibold text-sm text-default-fg">Motivo informado</span>
                                <div className="p-3 bg-default/40 rounded-md border border-default-border text-sm min-h-20 text-muted-fg overflow-y-auto">
                                    {request.reason || <span className="italic">Nenhum motivo fornecido.</span>}
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-2 border-t border-default-border text-sm">
                                <div className="flex justify-between">
                                    <span className="font-medium text-default-fg">Aceita ser Lar Temporário?</span>
                                    <span>{request.temporaryHomeAccepted ? "Sim" : "Não"}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium text-default-fg">Aceitou os Termos?</span>
                                    <span>{request.termsAccepted ? "Sim" : "Não"}</span>
                                </div>
                            </div>
                        </div>

                        <UpdateGiveUpStatusForm 
                            request={request} 
                            onSuccess={(updated) => setRequest(updated)} 
                        />
                    </Card>

                    <Card size="lg" className="shadow-sm flex flex-col gap-4">
                        <h3 className="text-lg font-semibold border-b border-default-border pb-2">
                            Dados do Tutor (Doador)
                        </h3>
                        <div className="flex flex-col gap-4">
                            <DetailsField title="Nome completo">
                                {request.user.name} {request.user.lastName}
                            </DetailsField>
                            <DetailsField title="Telefone / celular">
                                {request.user.phone}
                            </DetailsField>
                            <DetailsField title="E-mail">
                                {request.user.email}
                            </DetailsField>
                            
                            <div className="border-t border-default-border pt-4">
                                <h4 className="text-sm font-semibold mb-3">Endereço</h4>
                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-2">
                                        <DetailsField title="CEP" className="w-2/5">
                                            {request.user.cep}
                                        </DetailsField>
                                        <DetailsField title="Cidade" className="w-3/5">
                                            {request.user.city}
                                        </DetailsField>
                                    </div>
                                    <div className="flex gap-2">
                                        <DetailsField title="Rua" className="w-3/4">
                                            {request.user.street}
                                        </DetailsField>
                                        <DetailsField title="Nº" className="w-1/4">
                                            {request.user.number}
                                        </DetailsField>
                                    </div>
                                    <div className="flex gap-2">
                                        <DetailsField title="Bairro" className="w-2/3">
                                            {request.user.neighborhood}
                                        </DetailsField>
                                        <DetailsField title="UF" className="w-1/3">
                                            {request.user.state}
                                        </DetailsField>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}