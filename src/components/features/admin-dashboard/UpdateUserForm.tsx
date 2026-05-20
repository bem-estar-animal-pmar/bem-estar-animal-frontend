"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "@/src/lib/api-error";
import { translateError, translateTable } from "@/src/lib/translation-map";
import { toast } from "@/src/lib/toast-store";

import { updateUserSchema, UpdateUserFormData } from "@/src/constants/schemas"; 
import type { UserById } from "@/src/constants/interfaces";

import { Button, Dialog, Input, Label } from "@/src/components/ui";
import { DetailsField } from "@/src/components/ui/DetailsField";

import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";

interface AdminUpdateUserFormProps {
    user: UserById;
    isSuspended: boolean;
    onUpdateSuccess: (updatedFields: Partial<UserById>) => void;
}

export const UpdateUserForm = ({ user, isSuspended, onUpdateSuccess }: AdminUpdateUserFormProps) => {
    const [isEditing, setIsEditing] = useState(false);

    const { control, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<UpdateUserFormData>({
        resolver: zodResolver(updateUserSchema) as any,
        defaultValues: {
            name: user.name || "",
            lastName: user.lastName || "",
            phone: user.phone || "",
            cpf: user.cpf || "",
            cep: user.cep || "",
            street: user.street || "",
            neighborhood: user.neighborhood || "",
            city: user.city || "",
            state: user.state || "",
            number: user.number || "",
            maxPetLimit: user.maxPetLimit ?? undefined, 
            maxMonthlyNeuteringRequestLimit: user.maxMonthlyNeuteringRequestLimit ?? undefined,
        },
    });

    const handleUpdateUser = async (data: UpdateUserFormData) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/admin-update/${user.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
                credentials: "include",
            });

            const resultData = await response.json();
            if (!response.ok) {
                throw new ApiError(resultData.message, resultData.code, resultData.details);
            }

            onUpdateSuccess(data);
            toast.success("Dados do usuário atualizados com sucesso!");
            setIsEditing(false);
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível atualizar dados do usuário."
            });
        }
    };

    const handleCancel = () => {
        reset();
        setIsEditing(false);
    };

    return (
        <>
            <div className="flex justify-between items-center border-b border-default-border pb-2">
                <h3 className="text-lg font-semibold">
                    Dados Cadastrais
                </h3>
                <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    disabled={isSuspended}
                >
                    Editar dados
                </Button>
            </div>

            <div className="flex flex-col gap-4 mt-2">
                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <DetailsField title="Nome completo" className="w-full md:w-1/2">
                        {user.name} {user.lastName}
                    </DetailsField>
                    <DetailsField title="ID do Usuário" className="w-full md:w-1/2">
                        <span className="text-xs text-muted-fg break-all">{user.id}</span>
                    </DetailsField>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <DetailsField title="E-mail" className="w-full md:w-1/2">
                        {user.email}
                    </DetailsField>
                    <DetailsField title="Cargo" className="w-full md:w-1/2">
                        {translateTable(user.role)}
                    </DetailsField>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <DetailsField title="CPF" className="w-full md:w-1/2">
                        {user.cpf || "Não informado"}
                    </DetailsField>
                    <DetailsField title="Telefone" className="w-full md:w-1/2">
                        {user.phone || "Não informado"}
                    </DetailsField>
                </div>

                <div className="flex flex-col md:flex-row gap-4 w-full">
                    <DetailsField title="Limite de Pets" className="w-full md:w-1/2">
                        {user.maxPetLimit ?? "Padrão do Sistema"}
                    </DetailsField>
                    <DetailsField title="Limite Mensal de Castração" className="w-full md:w-1/2">
                        {user.maxMonthlyNeuteringRequestLimit ?? "Padrão do Sistema"}
                    </DetailsField>
                </div>

                <div className="border-t border-default-border pt-4 mt-2">
                    <h4 className="text-sm font-semibold mb-3">Endereço</h4>
                    <div className="flex flex-col gap-3">
                        <div className="flex gap-2">
                            <DetailsField title="CEP" className="w-2/5">
                                {user.cep || "—"}
                            </DetailsField>
                            <DetailsField title="Cidade" className="w-3/5">
                                {user.city || "—"}
                            </DetailsField>
                        </div>
                        <div className="flex gap-2">
                            <DetailsField title="Rua" className="w-3/4">
                                {user.street || "—"}
                            </DetailsField>
                            <DetailsField title="Nº" className="w-1/4">
                                {user.number || "—"}
                            </DetailsField>
                        </div>
                        <div className="flex gap-2">
                            <DetailsField title="Bairro" className="w-2/3">
                                {user.neighborhood || "—"}
                            </DetailsField>
                            <DetailsField title="UF" className="w-1/3">
                                {user.state || "—"}
                            </DetailsField>
                        </div>
                    </div>
                </div>
            </div>

            <Dialog
                isOpen={isEditing} 
                onClose={handleCancel} 
                title="Editar usuário"
                size="xl"
            >
                <form 
                    onSubmit={handleSubmit(handleUpdateUser)}
                    className="flex flex-col gap-4 py-2"
                >
                    <div className="p-3 bg-alert border border-alert-border rounded-md text-sm text-alert-fg mb-2">
                        <strong>Atenção:</strong> A alteração de dados de um usuário só deve ser realizada sob solicitação expressa do próprio tutor ou em caso de extrema necessidade administrativa.
                    </div>
                    <div className="w-full flex flex-col max-h-72 overflow-y-scroll p-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="name">Nome</Label>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => (
                                        <Input id="name" {...field} variant={errors.name ? "danger" : "default"} />
                                    )}
                                />
                                {errors.name && <span className="text-danger-fg text-sm">{errors.name.message}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="lastName">Sobrenome</Label>
                                <Controller
                                    name="lastName"
                                    control={control}
                                    render={({ field }) => (
                                        <Input id="lastName" {...field} variant={errors.lastName ? "danger" : "default"} />
                                    )}
                                />
                                {errors.lastName && <span className="text-danger-fg text-sm">{errors.lastName.message}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="cpf">CPF (somente números)</Label>
                                <Controller
                                    name="cpf"
                                    control={control}
                                    render={({ field }) => (
                                        <Input id="cpf" {...field} variant={errors.cpf ? "danger" : "default"} />
                                    )}
                                />
                                {errors.cpf && <span className="text-danger-fg text-sm">{errors.cpf.message}</span>}
                            </div>
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="phone">Telefone</Label>
                                <Controller
                                    name="phone"
                                    control={control}
                                    render={({ field }) => (
                                        <Input id="phone" {...field} variant={errors.phone ? "danger" : "default"} />
                                    )}
                                />
                                {errors.phone && <span className="text-danger-fg text-sm">{errors.phone.message}</span>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                            <div className="flex flex-col gap-1 md:col-span-1">
                                <Label htmlFor="cep">CEP</Label>
                                <Controller
                                    name="cep"
                                    control={control}
                                    render={({ field }) => (
                                        <Input id="cep" {...field} variant={errors.cep ? "danger" : "default"} />
                                    )}
                                />
                                {errors.cep && <span className="text-danger-fg text-sm">{errors.cep.message}</span>}
                            </div>
                            <div className="flex flex-col gap-1 md:col-span-2">
                                <Label htmlFor="city">Cidade</Label>
                                <Controller
                                    name="city"
                                    control={control}
                                    render={({ field }) => (
                                        <Input id="city" {...field} variant={errors.city ? "danger" : "default"} />
                                    )}
                                />
                                {errors.city && <span className="text-danger-fg text-sm">{errors.city.message}</span>}
                            </div>
                            <div className="flex flex-col gap-1 md:col-span-2">
                                <Label htmlFor="street">Rua</Label>
                                <Controller
                                    name="street"
                                    control={control}
                                    render={({ field }) => (
                                        <Input id="street" {...field} variant={errors.street ? "danger" : "default"} />
                                    )}
                                />
                                {errors.street && <span className="text-danger-fg text-sm">{errors.street.message}</span>}
                            </div>
                            <div className="flex flex-col gap-1 md:col-span-1">
                                <Label htmlFor="number">Número</Label>
                                <Controller
                                    name="number"
                                    control={control}
                                    render={({ field }) => (
                                        <Input id="number" {...field} variant={errors.number ? "danger" : "default"} />
                                    )}
                                />
                                {errors.number && <span className="text-danger-fg text-sm">{errors.number.message}</span>}
                            </div>
                            <div className="flex flex-col gap-1 md:col-span-2">
                                <Label htmlFor="neighborhood">Bairro</Label>
                                <Controller
                                    name="neighborhood"
                                    control={control}
                                    render={({ field }) => (
                                        <Input id="neighborhood" {...field} variant={errors.neighborhood ? "danger" : "default"} />
                                    )}
                                />
                                {errors.neighborhood && <span className="text-danger-fg text-sm">{errors.neighborhood.message}</span>}
                            </div>
                            <div className="flex flex-col gap-1 md:col-span-1">
                                <Label htmlFor="state">Estado (UF)</Label>
                                <Controller
                                    name="state"
                                    control={control}
                                    render={({ field }) => (
                                        <Input id="state" {...field} maxLength={2} variant={errors.state ? "danger" : "default"} />
                                    )}
                                />
                                {errors.state && <span className="text-danger-fg text-sm">{errors.state.message}</span>}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-default-border">
                            <div className="flex flex-col gap-1">
                                <Label htmlFor="maxPetLimit">Limite de Pets (Máximo)</Label>
                                <Controller
                                    name="maxPetLimit"
                                    control={control}
                                    render={({ field }) => (
                                        <Input 
                                            type="number" 
                                            id="maxPetLimit" 
                                            {...field} 
                                            value={field.value ?? ""} // Evita warning de controlled/uncontrolled
                                            variant={errors.maxPetLimit ? "danger" : "default"} 
                                        />
                                    )}
                                />
                                {errors.maxPetLimit && <span className="text-danger-fg text-sm">{errors.maxPetLimit.message}</span>}
                            </div>

                            <div className="flex flex-col gap-1">
                                <Label htmlFor="maxMonthlyNeuteringRequestLimit">Limite Mensal de Castrações</Label>
                                <Controller
                                    name="maxMonthlyNeuteringRequestLimit"
                                    control={control}
                                    render={({ field }) => (
                                        <Input 
                                            type="number" 
                                            id="maxMonthlyNeuteringRequestLimit" 
                                            {...field} 
                                            value={field.value ?? ""} // Evita warning de controlled/uncontrolled
                                            variant={errors.maxMonthlyNeuteringRequestLimit ? "danger" : "default"} 
                                        />
                                    )}
                                />
                                {errors.maxMonthlyNeuteringRequestLimit && <span className="text-danger-fg text-sm">{errors.maxMonthlyNeuteringRequestLimit.message}</span>}
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-4 border-t border-default-border">
                        <Button type="button" variant="outline" onClick={handleCancel} disabled={isSubmitting}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" disabled={isSubmitting}>
                            {isSubmitting ? (
                                <span className="flex gap-2 items-center"><SpinnerIcon/> Salvando...</span>
                            ) : "Salvar Alterações"}
                        </Button>
                    </div>
                </form>
            </Dialog>
        </>
    );
};