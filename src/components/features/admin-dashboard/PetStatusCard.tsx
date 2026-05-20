"use client";

import { useState } from "react";
import { ApiError } from "@/src/lib/api-error";
import { translateError, translateTable } from "@/src/lib/translation-map";
import { toast } from "@/src/lib/toast-store";

import { homeStatusOptions } from "@/src/constants/constants";
import type { PetById } from "@/src/constants/interfaces";
import { Card, Button, Label, Select, Dialog, DetailsField } from "@/src/components/ui";
import { SpinnerIcon } from "../../icons/SpinnerIcon";

interface PetStatusCardProps {
    pet: PetById;
    onUpdateSuccess: (updatedFields: any) => void;
}

export const PetStatusCard = ({ pet, onUpdateSuccess }: PetStatusCardProps) => {
    const [isEditingHome, setIsEditingHome] = useState(false);
    const [selectedHomeStatus, setSelectedHomeStatus] = useState(pet.homeStatus);
    const [isUpdatingHome, setIsUpdatingHome] = useState(false);

    const [undoGiveUpDialogOpen, setUndoGiveUpDialogOpen] = useState(false);
    const [returnAdoptionDialogOpen, setReturnAdoptionDialogOpen] = useState(false);
    const [isActionLoading, setIsActionLoading] = useState(false);

    const handleUpdateHomeStatus = async () => {
        try {
            setIsUpdatingHome(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/${pet.id}`, {
                method: "PATCH",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ homeStatus: selectedHomeStatus }),
            });

            const resultData = await response.json();
            if (!response.ok) {
                throw new ApiError(resultData.message, resultData.code, resultData.details);
            }

            onUpdateSuccess({ homeStatus: selectedHomeStatus });
            toast.success("Status de moradia atualizado com sucesso!");
            setIsEditingHome(false);
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível atualizar status de moradia."
            });
        } finally {
            setIsUpdatingHome(false);
        }
    };

    const handleUndoGiveUp = async () => {
        try {
            setIsActionLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/${pet.id}/undo-give-up`, {
                method: "PATCH",
                credentials: "include",
            });

            const resultData = await response.json();
            if (!response.ok) {
                throw new ApiError(resultData.message, resultData.code, resultData.details);
            }

            onUpdateSuccess({ adoptionStatus: "NONE" });
            toast.success("Disponibilidade para adoção cancelada.");
            setUndoGiveUpDialogOpen(false);
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.warning(translateError(err.message));
                return;
            }
            toast.danger("Erro ao cancelar adoção.");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleReturnAdoption = async () => {
        try {
            setIsActionLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/${pet.id}/adoption-return`, {
                method: "PATCH",
                credentials: "include",
            });

            const resultData = await response.json();
            if (!response.ok) {
                throw new ApiError(resultData.message, resultData.code, resultData.details);
            }

            onUpdateSuccess({ adoptionStatus: "NONE" });
            toast.success("Adoção desfeita com sucesso. Pet devolvido.");
            setReturnAdoptionDialogOpen(false);
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.warning(translateError(err.message));
                return;
            }
            toast.danger("Erro ao registrar devolução do pet.");
        } finally {
            setIsActionLoading(false);
        }
    };

    return (
        <Card size="lg" className="shadow-sm! flex flex-col gap-6">
            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold pb-2 border-b border-default-border">
                    Situação de moradia
                </h3>
                {!isEditingHome ? (
                    <div className="flex flex-wrap justify-between gap-3">
                        <div className="flex flex-col">
                            <DetailsField title="Descrição do quadro">
                                {translateTable(pet.homeStatus)}
                            </DetailsField>
                        </div>
                        <Button 
                            variant="outline" 
                            onClick={() => setIsEditingHome(true)}
                            className="w-fit"
                        >
                            Atualizar moradia
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2">
                        <div>
                            <Label>Selecione o novo status</Label>
                            <Select
                                value={selectedHomeStatus}
                                onChange={(val) => setSelectedHomeStatus(val as any)}
                                options={homeStatusOptions}
                            />
                        </div>
                        <div className="flex self-end gap-2">
                            <Button 
                                variant="outline" 
                                onClick={() => {
                                    setIsEditingHome(false);
                                    setSelectedHomeStatus(pet.homeStatus);
                                }}
                                disabled={isUpdatingHome}
                            >
                                Cancelar
                            </Button>
                            <Button 
                                variant="primary" 
                                onClick={handleUpdateHomeStatus}
                                disabled={isUpdatingHome}
                            >
                                {isUpdatingHome ? 
                                    <span className="flex gap-2 items-center">
                                        <SpinnerIcon/> Salvando...
                                    </span>
                                    : 
                                    "Atualizar"
                                }
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="text-lg font-semibold pb-2 border-b border-default-border">
                    Situação de adoção
                </h3>
                
                <div className="flex flex-row justify-between flex-wrap gap-2">
                    <div className="flex flex-col">
                        <DetailsField title="Status atual">
                            {translateTable(pet.adoptionStatus)}
                        </DetailsField>
                    </div>
                    {pet.adoptionStatus === "NONE" && (
                        <p className="text-sm text-muted-fg bg-default-bg rounded-md p-3 border border-default-border">
                            O pet não está para adoção e nem foi adotado. Nenhuma ação de adoção disponível no momento.
                        </p>
                    )}

                    {pet.adoptionStatus === "FOR_ADOPTION" && (
                        <>
                            <Button 
                                variant="danger" 
                                className="w-fit"
                                onClick={() => setUndoGiveUpDialogOpen(true)}
                            >
                                Remover da vitrine
                            </Button>
                            <Dialog
                                isOpen={undoGiveUpDialogOpen}
                                onClose={() => setUndoGiveUpDialogOpen(false)}
                                size="md"
                                title="Remover da vitrine de adoção"
                            >
                                <p className="text-sm text-default-fg py-4">
                                    Tem certeza que deseja remover este pet da lista de adoção? Para adicionar novamente será necessário que o tutor faça outro pedido.
                                </p>
                                <div className="flex justify-end gap-2">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setUndoGiveUpDialogOpen(false)} 
                                        disabled={isActionLoading}
                                        className="border-danger-border! text-danger-fg! hover:bg-danger-border/10!"
                                    >
                                        Não, voltar
                                    </Button>
                                    <Button variant="danger" onClick={handleUndoGiveUp} disabled={isActionLoading}>
                                        {isActionLoading ? "Processando..." : "Sim, remover da vitrine"}
                                    </Button>
                                </div>
                            </Dialog>
                        </>
                    )}

                    {pet.adoptionStatus === "ADOPTED" && (
                        <>
                            <Button 
                                variant="danger" 
                                className="w-fit"
                                onClick={() => setReturnAdoptionDialogOpen(true)}
                            >
                                Registrar devolução
                            </Button>
                            <Dialog
                                isOpen={returnAdoptionDialogOpen}
                                onClose={() => setReturnAdoptionDialogOpen(false)}
                                size="md"
                                title="Registrar devolução do pet"
                            >
                                <p className="text-sm text-default-fg py-4">
                                    Tem certeza que deseja desfazer a adoção deste pet? O status de adoção será removido e o pedido de adoção será marcado como "devolvido".
                                </p>
                                <p className="text-xs italic text-default-fg pb-4">
                                    Para colocar novamente na vitrine de adoção será necessário que o tutor realize outro pedido.
                                </p>
                                <div className="flex justify-end gap-2">
                                    <Button 
                                        variant="outline" 
                                        onClick={() => setReturnAdoptionDialogOpen(false)}
                                        disabled={isActionLoading}
                                        className="border-danger-border! text-danger-fg! hover:bg-danger-border/10!"
                                    >
                                        Não, voltar
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        onClick={handleReturnAdoption} 
                                        disabled={isActionLoading}
                                    >
                                        {isActionLoading ? "Processando..." : "Sim, Registrar Devolução"}
                                    </Button>
                                </div>
                            </Dialog>
                        </>
                    )}
                </div>
            </div>
        </Card>
    );
};