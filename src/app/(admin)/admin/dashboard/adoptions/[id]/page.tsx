"use client";

import { useState, useEffect, use } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/error-map";
import { translateTable } from "@/src/lib/table-map";
import { formatRequestNumber } from "@/src/lib/request-formatter";
import type { AdoptionRequestById } from "@/src/constants/interfaces";

import Image from "next/image";
import pet_avatar_placeholder from "@/public/pet-avatar-placeholder.webp"; 

import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import { AdoptionHistorySection } from "@/src/components/features/admin-dashboard/AdoptionHistorySection";
import { adoptionStatusMap } from "@/src/constants/constants";
import { Card, TextLink, Badge, Button, Dialog } from "@/src/components/ui"; 
import { DetailsField } from "@/src/components/ui/DetailsField";

export default function AdminAdoptionDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: requestId } = use(params);
    const [request, setRequest] = useState<AdoptionRequestById | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Estados para os Dialogs de confirmação
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
    const [returnDialogOpen, setReturnDialogOpen] = useState(false);

    const fetchRequest = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/adoptions/request/details/${requestId}`, {
                credentials: "include",
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new ApiError(responseData.message, responseData.code, responseData.details);
            }
            
            setRequest(responseData); 
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                const firstError = err.details?.[0]?.message || "";
                toast.danger(translateError(err.message), { message: firstError });
                return;
            }
            toast.danger("Erro desconhecido ao carregar pedido de adoção.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (requestId) {
            fetchRequest();
        }
    }, [requestId]);

    const handleStatusChange = async (newStatus: "APPROVED" | "REJECTED") => {
        setIsSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/adoptions/request/${requestId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success(`Pedido de adoção ${newStatus === "APPROVED" ? "aprovado" : "rejeitado"} com sucesso!`);
            fetchRequest(); // Recarrega os dados para atualizar o histórico e status
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.message));
                return;
            }
            toast.danger("Erro ao atualizar o status do pedido.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReturnPet = async () => {
        if (!request) return;
        setIsSubmitting(true);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/${request.petId}/adoption-return`, {
                method: "PATCH",
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success("Pet devolvido com sucesso!");
            fetchRequest();
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.message));
                return;
            }
            toast.danger("Erro ao registrar a devolução do pet.");
        } finally {
            setIsSubmitting(false);
        }
    };

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

    const statusInfo = adoptionStatusMap[request.status] || { label: request.status, classes: "bg-neutral-100 text-neutral-800" };
    const displayDate = request.createdAt ? request.createdAt.split("T")[0].split("-").reverse().join("/") : "Sem data";

    return (
        <div className="w-full flex flex-col items-center">
            <section className="flex w-full flex-wrap justify-between items-center border-b border-default-border mb-4 pb-2">
                <div className="flex flex-col pb-4">
                    <h1 className="font-semibold text-xl sm:text-xl lg:text-2xl text-default-fg">
                        <TextLink
                            href="/admin/dashboard/adoptions"
                            variant="primary"
                            className="font-semibold! text-xl! sm:text-xl! lg:text-2xl!"
                        >
                            Entregas e Adoções
                        </TextLink>
                        {" "} - Adoção Nº: {formatRequestNumber("ADOPTION", request.requestNumber)}
                    </h1>
                    <p className="text-muted-fg text-sm sm:text-base">
                        Visualize os dados do pet e do adotante, e avalie a solicitação de adoção.
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

                    <Card size="lg" className="shadow-sm flex flex-col gap-4">
                        <h3 className="text-lg font-semibold border-b border-default-border pb-2">
                            Dados do Adotante
                        </h3>
                        <div className="flex flex-col gap-4">
                            <DetailsField title="Nome completo">
                                {request.adopterName}
                            </DetailsField>
                            <div className="flex flex-col md:flex-row gap-4 w-full">
                                <DetailsField title="Telefone / celular" className="w-full md:w-1/2">
                                    {request.adopterPhone}
                                </DetailsField>
                                <DetailsField title="E-mail" className="w-full md:w-1/2">
                                    {request.adopterEmail}
                                </DetailsField>
                            </div>
                            
                            <div className="border-t border-default-border pt-4">
                                <h4 className="text-sm font-semibold mb-3">Endereço do Adotante</h4>
                                <div className="flex flex-col gap-3">
                                    <div className="flex gap-2">
                                        <DetailsField title="CEP" className="w-2/5">
                                            {request.adopterCep}
                                        </DetailsField>
                                        <DetailsField title="Cidade" className="w-3/5">
                                            {request.adopterCity}
                                        </DetailsField>
                                    </div>
                                    <div className="flex gap-2">
                                        <DetailsField title="Rua" className="w-3/4">
                                            {request.adopterStreet}
                                        </DetailsField>
                                        <DetailsField title="Nº" className="w-1/4">
                                            {request.adopterNumber}
                                        </DetailsField>
                                    </div>
                                    <div className="flex gap-2">
                                        <DetailsField title="Bairro" className="w-2/3">
                                            {request.adopterNeighborhood}
                                        </DetailsField>
                                        <DetailsField title="UF" className="w-1/3">
                                            {request.adopterState}
                                        </DetailsField>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <AdoptionHistorySection history={request.history} />

                </div>

                <div className="flex flex-col w-full gap-4 lg:w-2/5">
                    
                    <Card size="lg" className="shadow-sm!">
                        <div className="flex justify-between items-center pb-4 border-b border-default-border mb-4">
                            <h3 className="text-base lg:text-lg font-semibold">
                                Detalhes do Pedido
                            </h3>
                            <Badge className={`${statusInfo.classes} border`}>
                                {statusInfo.label}
                            </Badge>
                        </div>
                        
                        <div className="flex flex-col gap-4 mb-6">
                            <DetailsField title="Data da solicitação">
                                {displayDate}
                            </DetailsField>

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

                        <div className="flex flex-col gap-3 pt-4 border-t border-default-border">
                            <h4 className="text-sm font-semibold mb-1">Ações</h4>
                            
                            {request.status === "PENDING" && (
                                <div className="flex flex-col gap-2">
                                    <Button 
                                        onClick={() => setApproveDialogOpen(true)} 
                                        disabled={isSubmitting}
                                        className="w-full"
                                        variant="primary"
                                    >
                                        Aprovar Adoção
                                    </Button>
                                    <Button 
                                        onClick={() => setRejectDialogOpen(true)} 
                                        disabled={isSubmitting}
                                        className="w-full border-danger-border! text-danger-fg! hover:bg-danger-border/10!"
                                        variant="outline"
                                    >
                                        Recusar Adoção
                                    </Button>
                                </div>
                            )}

                            {request.status === "APPROVED" && (
                                <Button 
                                    onClick={() => setReturnDialogOpen(true)} 
                                    disabled={isSubmitting}
                                    className="w-full border-danger-border! text-danger-fg! hover:bg-danger-border/10!"
                                    variant="outline"
                                >
                                    Registrar Devolução
                                </Button>
                            )}

                            {request.status !== "PENDING" && request.status !== "APPROVED" && (
                                <span className="text-sm text-muted-fg font-medium w-full! italic text-center">
                                    Nenhuma ação disponível para este pedido.
                                </span>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            {/* Dialogs */}
            <Dialog
                isOpen={approveDialogOpen} 
                onClose={() => setApproveDialogOpen(false)} 
                title="Aprovar Adoção"
                size="lg"
            >
                <p className="text-xs sm:text-sm text-default-fg py-4">
                    Tem certeza que deseja aprovar este pedido de adoção? O pet será marcado como "Adotado" e o tutor original não poderá mais atualizar os dados do pet.
                </p>
                <div className="flex justify-end gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => setApproveDialogOpen(false)}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={() => {
                            setApproveDialogOpen(false);
                            handleStatusChange("APPROVED");
                        }}
                    >
                        Sim, aprovar
                    </Button>
                </div>
            </Dialog>

            <Dialog
                isOpen={rejectDialogOpen} 
                onClose={() => setRejectDialogOpen(false)} 
                title="Recusar Adoção"
                size="lg"
            >
                <p className="text-xs sm:text-sm text-default-fg py-4">
                    Tem certeza que deseja recusar este pedido de adoção? Esta ação é irreversível.
                </p>
                <div className="flex justify-end gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => setRejectDialogOpen(false)}
                        className="border-danger-border! text-danger-fg! hover:bg-danger-border/10!"
                    >
                        Não, voltar
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={() => {
                            setRejectDialogOpen(false);
                            handleStatusChange("REJECTED");
                        }}
                    >
                        Sim, recusar adoção
                    </Button>
                </div>
            </Dialog>

            <Dialog
                isOpen={returnDialogOpen} 
                onClose={() => setReturnDialogOpen(false)} 
                title="Registrar Devolução de Pet"
                size="lg"
            >
                <p className="text-xs sm:text-sm text-default-fg py-4">
                    Tem certeza que deseja registrar a devolução deste pet? O status será alterado e o pet voltará a ficar disponível para o tutor original.
                </p>
                <div className="flex justify-end gap-2">
                    <Button 
                        variant="outline" 
                        onClick={() => setReturnDialogOpen(false)}
                        className="border-danger-border! text-danger-fg! hover:bg-danger-border/10!"
                    >
                        Não, voltar
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={() => {
                            setReturnDialogOpen(false);
                            handleReturnPet();
                        }}
                    >
                        Sim, registrar devolução
                    </Button>
                </div>
            </Dialog>
        </div>
    );
}