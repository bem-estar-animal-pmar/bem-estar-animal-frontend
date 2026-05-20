"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Pet } from "@/src/constants/interfaces";
import { Select, Button, Label, Textarea } from "@/src/components/ui";
import { toast } from "@/src/lib/toast-store";

import { giveUpFormSchema, GiveUpFormData } from "@/src/constants/schemas";
import { translateError } from "@/src/lib/error-map";
import { SpinnerIcon } from "../../icons/SpinnerIcon";
import { ApiError } from "@/src/lib/api-error";

interface CreateGiveUpFormProps {
    pets: Pet[];
    onSuccess: () => void;
}

export const CreateGiveUpForm = ({ pets, onSuccess}: CreateGiveUpFormProps) => {
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<GiveUpFormData>({
        resolver: zodResolver(giveUpFormSchema),
        defaultValues: {
            petId: "",
            reason: "",
            termsAccepted: false,
            temporaryHomeAccepted: false
        },
    });

    const handleCreateGiveUp = async (data: GiveUpFormData) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/adoptions/give-up`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const dataRes = await response.json();

            if (!response.ok) {
                throw new ApiError(dataRes.message, dataRes.code, dataRes.details);
            }

            toast.success("Solicitação de doação enviada com sucesso!");
            onSuccess();
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível solicitar pedido."
            });
        }
    };

    /* filtering only pets that are not for adoption or adopted */
    const availablePets = pets.filter(p => p.adoptionStatus !== "FOR_ADOPTION" && p.adoptionStatus !== "ADOPTED");

    return (
        <form onSubmit={handleSubmit(handleCreateGiveUp)} className="flex flex-col gap-4 pt-4">
            <div>
                <Label htmlFor="petId">Selecione o pet</Label>
                <Controller
                    name="petId"
                    control={control}
                    render={({ field: { value, onChange, name, onBlur } }) => (
                        <Select
                            id="petId"
                            name={name}
                            placeholder="Selecione um pet..."
                            value={value}
                            onChange={onChange}
                            onBlur={onBlur}
                            options={availablePets.map(p => ({ value: p.id, label: p.name }))}
                            variant={errors.petId ? "danger" : "default"}
                            disabled={availablePets.length === 0}
                        />
                    )}
                />
                {errors.petId && <span className="text-danger-fg text-sm">{errors.petId.message}</span>}
                {availablePets.length === 0 && (
                    <span className="text-muted-fg text-xs mt-1">Nenhum pet elegível para doação encontrado.</span>
                )}
            </div>

            <div>
                <Label htmlFor="reason">Motivo da doação (Opcional)</Label>
                <Controller
                    name="reason"
                    control={control}
                    render={({ field }) => (
                        <Textarea
                            id="reason"
                            placeholder="Descreva brevemente o motivo pelo qual deseja disponibilizar o pet para adoção..."
                            rows={5}
                            {...field}
                            variant={errors.reason ? "danger" : "default"}
                        />
                    )}
                />
                {errors.reason && <span className="text-danger-fg text-sm">{errors.reason.message}</span>}
            </div>

            <div className="flex flex-col gap-3 pt-2">
                <div className="flex items-start gap-2">
                    <Controller
                        name="temporaryHomeAccepted"
                        control={control}
                        render={({ field: { value, onChange, ref } }) => (
                            <input 
                                type="checkbox"
                                id="temporaryHomeAccepted"
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-fg focus:ring-primary-fg cursor-pointer"
                                checked={value === true}
                                onChange={(e) => onChange(e.target.checked)}
                                ref={ref}
                            />
                        )}
                    />
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="temporaryHomeAccepted" className="font-normal text-sm leading-none cursor-pointer">
                            Aceito ser lar temporário do pet até que ele seja adotado.
                        </Label>
                        {errors.temporaryHomeAccepted && <span className="text-danger-fg text-xs">{errors.temporaryHomeAccepted.message}</span>}
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Controller
                        name="termsAccepted"
                        control={control}
                        render={({ field: { value, onChange, ref } }) => (
                            <input 
                                type="checkbox"
                                id="termsAccepted"
                                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-fg focus:ring-primary-fg cursor-pointer"
                                checked={value === true}
                                onChange={(e) => onChange(e.target.checked)}
                                ref={ref}
                            />
                        )}
                    />
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="termsAccepted" className="font-normal text-sm leading-none cursor-pointer">
                            Li e concordo com os termos de doação e castração.
                        </Label>
                        {errors.termsAccepted && <span className="text-danger-fg text-xs">{errors.termsAccepted.message}</span>}
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <Button
                    type="submit"
                    variant="primary"
                    disabled={isSubmitting || availablePets.length === 0}
                >
                    {isSubmitting ? 
                        <span className="flex gap-2 items-center">
                            <SpinnerIcon/> Enviando...
                        </span>
                    :  
                        "Solicitar doação"
                    }

                </Button>
            </div>
        </form>
    );
};