"use client";

import { useState, useEffect, use } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/translation-map";

import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import { Card, TextLink, Badge, Button, Dialog, Input, Label, Select, DatePicker } from "@/src/components/ui";
import { DetailsField } from "@/src/components/ui/DetailsField";
import { HistorySection } from "@/src/components/features/admin-dashboard/HistorySection"; 
import { UpdateUserForm } from "@/src/components/features/admin-dashboard/UpdateUserForm";
import type { UserById } from "@/src/constants/interfaces";
import { accountStatusMap, userRoleMap } from "@/src/constants/constants";
import { AlertIcon } from "@/src/components/icons/solid";

type LoadingAction = "UPDATE_BLOCK" | "UPDATE_ROLE" | "SUSPEND_USER" | null;

export default function AdminUserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id: targetUserId } = use(params);
    const [user, setUser] = useState<UserById | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingAction, setLoadingAction] = useState<LoadingAction>(null);

    const [blockDialogOpen, setBlockDialogOpen] = useState(false);
    const [roleDialogOpen, setRoleDialogOpen] = useState(false);
    const [suspendDialogOpen, setSuspendDialogOpen] = useState(false); 
    
    const [blockDate, setBlockDate] = useState<Date | undefined>(undefined);
    const [blockTime, setBlockTime] = useState("");

    const fetchUser = async () => {
        try {
            setIsLoading(true);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/details/${targetUserId}`, {
                credentials: "include",
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new ApiError(responseData.message, responseData.code, responseData.details);
            }
            
            setUser(responseData); 
            
            if (responseData.blockedUntil) {
                const dateObj = new Date(responseData.blockedUntil);
                setBlockDate(dateObj);
                const hours = dateObj.getHours().toString().padStart(2, '0');
                const minutes = dateObj.getMinutes().toString().padStart(2, '0');
                setBlockTime(`${hours}:${minutes}`);
            } else {
                setBlockDate(undefined);
                setBlockTime("");
            }

        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível carregar detalhes do usuário."
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (targetUserId) {
            fetchUser();
        }
    }, [targetUserId]);

    const handleUpdateUserSuccess = (updatedFields: Partial<UserById>) => {
        setUser((prev) => prev ? {
            ...prev,
            ...updatedFields
        } : null);
    };

    const handleUpdateBlockStatus = async (blockedUntil: Date | null) => {
        setLoadingAction("UPDATE_BLOCK");
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/block-status/${targetUserId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ blockedUntil }),
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success(blockedUntil ? "Usuário bloqueado com sucesso!" : "Usuário desbloqueado com sucesso!");
            setBlockDialogOpen(false);
            fetchUser();
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível atualizar status de bloqueio do usuário."
            });
        } finally {
            setLoadingAction(null);
        }
    };

    const handleUpdateRole = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoadingAction("UPDATE_ROLE");
        
        const formData = new FormData(e.currentTarget);
        const newRole = formData.get("role") as string;

        if (newRole === user?.role) {
            toast.danger("Erro de validação:", { message: "O usuário já possui esse cargo."});
            setLoadingAction(null);
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/role/${targetUserId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: newRole }),
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success("Usuário atualizado com sucesso!");
            setRoleDialogOpen(false);
            fetchUser();
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
        } finally {
            setLoadingAction(null);
        }
    };

    const handleSuspendFraudAccount = async () => {
        setLoadingAction("SUSPEND_USER");
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/suspend-fraud/${targetUserId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success("Conta suspensa permanentemente com sucesso. O CPF original foi liberado.");
            setSuspendDialogOpen(false);
            fetchUser(); 
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível suspender a conta."
            });
        } finally {
            setLoadingAction(null);
        }
    };

    if (isLoading) {
        return (
            <div className="w-full flex flex-col items-center pt-4">
                <section className="flex w-full flex-wrap justify-between items-center border-b border-default-border pb-6 gap-4 mb-4">
                    <div className="flex flex-col">
                        <h1 className="font-semibold text-xl sm:text-xl lg:text-2xl text-default-fg">
                            <TextLink
                                href="/admin/dashboard/users"
                                variant="primary"
                                className="font-semibold! text-xl! sm:text-xl! lg:text-2xl!"
                            >
                                Painel de usuários
                            </TextLink>
                            {" "} - Detalhes
                        </h1>
                        <p className="text-muted-fg text-sm sm:text-base">
                            Visualize, edite as informações cadastrais e gerencie o status da conta.
                        </p>
                    </div>
                    </section>
                <div className="p-8 text-center text-muted-fg">
                    <SpinnerIcon size={24} />
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="w-full flex flex-col items-center pt-4">
                <section className="flex w-full flex-wrap justify-between items-center border-b border-default-border pb-6 gap-4 mb-4">
                    <div className="flex flex-col">
                        <h1 className="font-semibold text-xl sm:text-xl lg:text-2xl text-default-fg">
                            <TextLink
                                href="/admin/dashboard/users"
                                variant="primary"
                                className="font-semibold! text-xl! sm:text-xl! lg:text-2xl!"
                            >
                                Painel de usuários
                            </TextLink>
                            {" "} - Detalhes
                        </h1>
                        <p className="text-muted-fg text-sm sm:text-base">
                            Visualize, edite as informações cadastrais e gerencie o status da conta.
                        </p>
                    </div>
                    </section>
                <div className="p-8 text-center text-muted-fg">
                    Usuário não encontrado.
                </div>
            </div>
        );
    }

    const displayDate = user.createdAt ? user.createdAt.split("T")[0].split("-").reverse().join("/") : "Sem data";
    const isSuspended = !!user.suspendedAt;
    const isCurrentlyBlocked = user.blockedUntil ? new Date(user.blockedUntil) > new Date() : false;

    const accountStatusBadge = accountStatusMap[user.suspendedAt ? "SUSPENDED" : user.deletedAt ? "DELETED" : isCurrentlyBlocked ? "BLOCKED" : "ACTIVE"];

    return (
        <div className="w-full flex flex-col items-center pt-4">
            <section className="flex w-full flex-wrap justify-between items-center border-b border-default-border pb-6 gap-4 mb-4">
                <div className="flex flex-col">
                    <h1 className="font-semibold text-xl sm:text-xl lg:text-2xl text-default-fg">
                        <TextLink
                            href="/admin/dashboard/users"
                            variant="primary"
                            className="font-semibold! text-xl! sm:text-xl! lg:text-2xl!"
                        >
                            Painel de usuários
                        </TextLink>
                        {" "} - Detalhes
                    </h1>
                    <p className="text-muted-fg text-sm sm:text-base">
                        Visualize, edite as informações cadastrais e gerencie o status da conta.
                    </p>
                </div>
            </section>
            
            {isSuspended && (
                <div className="w-full p-4 mb-4 bg-danger border border-danger-border rounded-md">
                    <h3 className="text-danger-fg font-semibold flex items-center gap-2 text-sm sm:text-base">
                        <span className="text-alert-fg/40"><AlertIcon/></span> Conta Suspensa
                    </h3>
                    <p className="text-xs sm:text-sm text-danger-fg">
                        Esta conta foi suspensa permanentemente. Essa ação é tomada pelo administrador quando o usuário se cadastra com dados de outra pessoa. O e-mail cadastrado foi está bloqueado e todos os dados (incluindo CPF) foram apagados.
                    </p>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-4 w-full max-w-284">
                <div className="flex flex-col gap-4 w-full lg:w-3/5">
                    <Card size="lg" className="shadow-sm! flex flex-col gap-4">
                        <UpdateUserForm 
                            user={user} 
                            isSuspended={isSuspended} 
                            onUpdateSuccess={handleUpdateUserSuccess} 
                        />
                    </Card>

                    <HistorySection 
                        history={user.history || ""}
                    />
                </div>

                <div className="flex flex-col w-full gap-4 lg:w-2/5">
                    <Card size="lg" className="shadow-sm!">
                        <div className="flex justify-between items-center pb-2 border-b border-default-border mb-4">
                            <h3 className="text-base lg:text-lg font-semibold">
                                Gerenciar Cargo
                            </h3>
                            <Badge className={userRoleMap[user.role].classes}>
                                {userRoleMap[user.role].label}
                            </Badge>
                        </div>
                        <div className="flex flex-col gap-3">
                            <p className="text-xs text-muted-fg mb-2">
                                Altere o nível de permissão deste usuário na plataforma. Apenas administradores podem usar esse serviço.
                            </p>
                            <Button 
                                onClick={() => setRoleDialogOpen(true)} 
                                disabled={loadingAction !== null || user.role === "ADMIN" || isSuspended}
                                className="w-full"
                                variant="primary"
                            >
                                Alterar permissão
                            </Button>
                        </div>
                    </Card>

                    <Card size="lg" className="shadow-sm!">
                        <div className="flex justify-between items-center pb-2 border-b border-default-border mb-4">
                            <h3 className="text-base lg:text-lg font-semibold">
                                Status da Conta
                            </h3>
                            <Badge 
                                className={`${accountStatusBadge.classes}`}
                            >
                                {accountStatusBadge.label}
                            </Badge>
                        </div>
                        
                        <div className="flex flex-col gap-4 mb-4">
                            <DetailsField title="Membro desde">
                                {displayDate}
                            </DetailsField>

                            {isCurrentlyBlocked && !isSuspended && (
                                <div className="p-3 bg-alert border border-alert-fg rounded-md">
                                    <p className="text-xs sm:text-sm font-semibold text-alert-fg">
                                        Bloqueado para agendamentos até:
                                    </p>
                                    <span className="text-xs sm:text-sm text-default-fg font-medium">
                                        {new Date(user.blockedUntil || "").toLocaleString("pt-BR")}
                                    </span>
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3 pt-4 border-t border-default-border">
                            <h4 className="text-sm font-semibold">Ações de bloqueio</h4>
                            <p className="text-xs text-muted-fg mb-2">
                                Limita o agendamento temporariamente em casos de falta.
                            </p>
                            <div className="flex flex-col gap-2">
                                <Button 
                                    onClick={() => setBlockDialogOpen(true)} 
                                    disabled={loadingAction !== null || isSuspended}
                                    variant="danger"
                                >
                                    {isCurrentlyBlocked ? "Alterar data de bloqueio" : "Aplicar penalidade"}
                                </Button>

                                {isCurrentlyBlocked && !isSuspended && (
                                    <Button 
                                        onClick={() => handleUpdateBlockStatus(null)} 
                                        disabled={loadingAction !== null}
                                        variant="outline"
                                    >
                                        {loadingAction === "UPDATE_BLOCK" ?
                                            <span className="flex gap-2 items-center">
                                                <SpinnerIcon/> Removendo... 
                                            </span>
                                            :
                                            "Desbloquear agora"
                                        }
                                    </Button>
                                )}
                            </div>
                        </div>
                    </Card>

                    {!isSuspended && (
                        <Card size="lg" className="shadow-sm! border-danger-fg/30 mt-2">
                            <div className="flex justify-between items-center pb-3 border-b border-danger-fg/20 mb-3">
                                <h3 className="text-base lg:text-lg font-semibold text-danger-fg">
                                    Zona de Perigo
                                </h3>
                            </div>
                            <div className="flex flex-col gap-1">
                                <p className="text-sm text-default-fg mb-2 font-medium">
                                    Suspensão por fraude de identidade
                                </p>
                                <p className="text-xs text-muted-fg">
                                    Use esta ação <strong className="text-danger-fg">apenas</strong> se for confirmado que o usuário se cadastrou com o CPF de outra pessoa. 
                                </p>
                                <p className="text-xs text-muted-fg mb-4">
                                    Essa ação suspenderá os dados do usuário, bloqueará o e-mail para sempre e liberará o CPF para o tutor verdadeiro.
                                </p>
                                <Button 
                                    variant="danger" 
                                    onClick={() => setSuspendDialogOpen(true)}
                                    disabled={loadingAction !== null || user.role === "ADMIN"}
                                    className="w-full"
                                >
                                    Suspender permanentemente
                                </Button>
                            </div>
                        </Card>
                    )}
                </div>
            </div>

            <Dialog 
                isOpen={blockDialogOpen} 
                onClose={() => setBlockDialogOpen(false)} 
                title="Bloquear para agendamentos" 
                size="md"
            >
                <div className="flex flex-col gap-4 py-4">
                    <p className="text-sm text-default-fg">Selecione a data e a hora até quando este usuário ficará bloqueado de usar a plataforma.</p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col w-full sm:w-1/2 gap-1">
                            <Label htmlFor="blockDate">Data de término</Label>
                            <DatePicker
                                id="blockDate"
                                className="w-full"
                                value={blockDate}
                                placeholder="Selecione no calendário"
                                onChange={(date: Date | undefined) => setBlockDate(date)}
                            />
                        </div>
                        
                        <div className="flex flex-col w-full sm:w-1/2 gap-1">
                            <Label htmlFor="blockTime">Hora de término</Label>
                            <Input
                                id="blockTime"
                                type="time"
                                className="w-full"
                                value={blockTime}
                                onChange={(e) => setBlockTime(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t border-default-border">
                    <Button 
                        variant="outline" 
                        onClick={() => setBlockDialogOpen(false)}
                        className="text-danger-fg! border-danger-border! hover:bg-danger!"
                        disabled={loadingAction !== null}
                    >
                        Cancelar
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={() => {
                            if (!blockDate || !blockTime) { 
                                toast.warning("Selecione uma data e hora para o bloqueio."); 
                                return; 
                            }
                            const combinedDate = new Date(blockDate);
                            const [hours, minutes] = blockTime.split(':').map(Number);
                            combinedDate.setHours(hours, minutes, 0, 0);

                            handleUpdateBlockStatus(combinedDate);
                        }}
                        disabled={loadingAction !== null}
                    >
                        {loadingAction === "UPDATE_BLOCK" ? (
                            <span className="flex gap-2 items-center">
                                <SpinnerIcon/> Salvando...
                            </span>
                        ) : "Confirmar bloqueio"}
                    </Button>
                </div>
            </Dialog>

            <Dialog 
                isOpen={roleDialogOpen} 
                onClose={() => setRoleDialogOpen(false)} 
                title="Alterar permissão do usuário"
                size="lg"
            >
                <form onSubmit={handleUpdateRole} className="flex flex-col py-4">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 mb-4">
                        <strong>Aviso:</strong> Promover um usuário a <strong>GERENTE</strong> concederá acessos administrativos à plataforma.
                    </div>
                    <div className="flex flex-col gap-1">
                        <Label htmlFor="roleSelect">Novo cargo</Label>
                        <Select 
                            id="roleSelect"
                            name="role"
                            value={user.role === "MANAGER" ? "MANAGER" : "USER"}
                            options={[
                                { label: "Usuário Padrão", value: "USER" },
                                { label: "Gerente", value: "MANAGER" }
                            ]}
                        />
                    </div>
                    <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-default-border">
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => setRoleDialogOpen(false)} 
                            disabled={loadingAction !== null}
                        >
                            Cancelar
                        </Button>
                        <Button 
                            type="submit" 
                            variant="primary" 
                            disabled={loadingAction !== null}
                        >
                            {loadingAction === "UPDATE_ROLE" ? (
                                <span className="flex gap-2 items-center">
                                    <SpinnerIcon/> Salvando...
                                </span>
                            ) : "Confirmar permissão"}
                        </Button>
                    </div>
                </form>
            </Dialog>

            <Dialog 
                isOpen={suspendDialogOpen} 
                onClose={() => setSuspendDialogOpen(false)} 
                title="Suspender conta permanentemente" 
                size="lg"
            >
                <div className="flex flex-col gap-4 py-4">
                    <div className="p-3 bg-danger border border-danger-border rounded-md text-sm text-danger-fg">
                        <p className="text-danger-fg font-medium flex items-center gap-2 text-sm">
                            <span className="text-alert-fg/50"><AlertIcon/></span> Ação Irreversível! Leia com atenção antes de prosseguir.
                        </p>
                    </div>
                    
                    <p className="text-sm text-default-fg">
                        Ao confirmar esta ação, o sistema realizará as seguintes operações simultâneas:
                    </p>
                    
                    <ul className="list-disc list-inside text-sm text-muted-fg flex flex-col gap-1">
                        <li><strong>Expulsão imediata:</strong> Os dados do usuário serão removidos e ele será desconectado de todos os dispositivos.</li>
                        <li><strong>Liberação de CPF:</strong> O CPF cadastrado nesta conta será removido para que o verdadeiro dono possa usá-lo.</li>
                        <li><strong>Bloqueio de e-mail:</strong> O e-mail registrado ficará bloqueado permanentemente para evitar novas contas.</li>
                        <li><strong>Cancelamento de agendamentos:</strong> Todos os agendamentos não concluídos deste usuário serão cancelados.</li>
                    </ul>
                    <p className="text-sm font-semibold text-default-fg">
                        Você tem certeza absoluta de que esta conta utilizou o CPF de forma fraudulenta?
                    </p>
                </div>

                <div className="flex justify-end gap-2 pt-4 border-t border-default-border">
                    <Button 
                        variant="outline" 
                        onClick={() => setSuspendDialogOpen(false)}
                        disabled={loadingAction !== null}
                        className="text-danger-fg! hover:bg-danger! border-danger-border!"
                    >
                        Cancelar
                    </Button>
                    <Button 
                        variant="danger" 
                        onClick={handleSuspendFraudAccount}
                        disabled={loadingAction !== null}
                    >
                        {loadingAction === "SUSPEND_USER" ? (
                            <span className="flex gap-2 items-center">
                                <SpinnerIcon/> Suspendendo...
                            </span>
                        ) : "Sim, suspender conta"}
                    </Button>
                </div>
            </Dialog>
        </div>
    );
}