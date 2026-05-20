import { useState, useEffect, use } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError, translateTable } from "@/src/lib/translation-map";
import type { AdminGiveUpRequestById } from "@/src/constants/interfaces";

import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import { Button, Label, Select, Dialog } from "@/src/components/ui"; 

export const UpdateGiveUpStatusForm = ({ request, onSuccess }: { request: AdminGiveUpRequestById; onSuccess: (updatedRequest: AdminGiveUpRequestById) => void }) => {
    const [status, setStatus] = useState(request.status);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false); 

    const handleUpdate = async () => {
        try {
            setIsDialogOpen(false); 
            setIsUpdating(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/adoptions/give-up/${request.id}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
                credentials: "include",
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new ApiError(responseData.message, responseData.code, responseData.details);
            }

            toast.success("Status do pedido atualizado com sucesso!");
            onSuccess({ ...request, ...responseData });
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível atualizar status do pedido."
            });
        } finally {
            setIsUpdating(false);
        }
    };

    const isPending = request.status === "PENDING";

    const statusOptions = [
        { label: "Em análise", value: "PENDING" },
        { label: "Aprovar (Vai para Adoção)", value: "APPROVED" },
        { label: "Rejeitar", value: "REJECTED" }
    ];

    const selectedLabel = statusOptions.find(o => o.value === status)?.label;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <Label htmlFor="statusSelect">Situação do Pedido</Label>
                <Select 
                    id="statusSelect"
                    value={status}
                    onChange={(val) => setStatus(val as any)}
                    disabled={!isPending || isUpdating}
                    options={statusOptions}
                />
            </div>
            
            {!isPending && (
                <p className="text-xs text-muted-fg">
                    Este pedido já foi {translateTable(request.status).toLowerCase()} e não pode ter seu status alterado novamente.
                </p>
            )}

            <Button 
                variant="primary" 
                onClick={() => setIsDialogOpen(true)}
                disabled={!isPending || status === request.status || isUpdating}
                className="w-full"
            >
                {isUpdating ?
                    <span className="flex gap-2 items-center">
                        <SpinnerIcon/> Salvando... 
                    </span>
                    :
                    "Atualizar Status"
                }
            </Button>

            <Dialog
                isOpen={isDialogOpen} 
                onClose={() => setIsDialogOpen(false)} 
                title="Confirmar Atualização de Status"
                size="md"
            >
                <p className="text-sm text-default-fg py-4">
                    Tem certeza que deseja alterar o status deste pedido para <strong>{selectedLabel}</strong>?
                </p>
                <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Sim, confirmar
                    </Button>
                </div>
            </Dialog>
        </div>
    );
};