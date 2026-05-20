"use client"

import { useEffect, useState } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/translation-map";

import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import { SearchIcon } from "@/src/components/icons/outline";
import { Button, Input, Label, Select, ButtonLink, Badge } from "@/src/components/ui"; 

export default function AdminUsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(false);
    const [userFilters, setUserFilters] = useState({
        name: "",
        email: "",
        role: "",
        page: 1
    });
    const [userPagination, setUserPagination] = useState({
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false
    });

    const buildQueryString = (filters: Record<string, string | number>) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, String(value));
        });
        return params.toString();
    };

    const fetchUsers = async (currentFilters = userFilters) => {
        setIsLoadingUsers(true);
        try {
            const query = buildQueryString(currentFilters);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users?${query}`, {
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }
            
            setUsers(data.data); 
            setUserPagination(data.meta);
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível carregar dados dos usuários."
            });
        } finally {
            setIsLoadingUsers(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleUserSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const newFilters = { ...userFilters, page: 1 };
        setUserFilters(newFilters);
        fetchUsers(newFilters);
    };

    const handleUserPageChange = (newPage: number) => {
        const newFilters = { ...userFilters, page: newPage };
        setUserFilters(newFilters);
        fetchUsers(newFilters);
    };

    const handleClearUserFilters = () => {
        const cleared = { name: "", email: "", role: "", page: 1 };
        setUserFilters(cleared);
        fetchUsers(cleared);
    };

    return (
        <div className="w-full flex flex-col gap-4 pt-4">
            <section className="flex w-full flex-wrap justify-between items-center border-b border-default-border pb-6 gap-4">
                <div className="flex flex-col">
                    <h1 className="font-semibold text-xl sm:text-xl lg:text-2xl text-default-fg">
                        Painel de usuários
                    </h1>
                    <p className="text-muted-fg text-sm sm:text-base">
                        Visualize e gerencie dados dos usuários.
                    </p>
                </div>
            </section>

            <section className="flex flex-col w-full border-default-border border rounded-lg divide-y divide-default-border bg-card">
                <h2 className="text-default-fg font-semibold text-base lg:text-lg px-4 py-4">
                    Filtrar Usuários
                </h2>
                <form onSubmit={handleUserSearch} className="flex flex-wrap gap-4 px-4 py-4">
                    <div className="flex flex-col md:flex-row gap-4 w-full max-w-180">
                        <div className="flex flex-col w-full max-w-64">
                            <Label htmlFor="name" className="mb-1">Nome</Label>
                            <Input 
                                id="name"
                                placeholder="Buscar por nome..." 
                                value={userFilters.name}
                                onChange={(e) => setUserFilters({...userFilters, name: e.target.value})}
                            />
                        </div>
                        <div className="flex flex-col w-full max-w-64">
                            <Label htmlFor="email" className="mb-1">Email</Label>
                            <Input 
                                id="email"
                                placeholder="Ex: joao@gmail.com" 
                                value={userFilters.email}
                                onChange={(e) => setUserFilters({...userFilters, email: e.target.value})}
                            />
                        </div>
                        <div className="flex flex-col w-full max-w-48">
                            <Label htmlFor="role" className="mb-1">Cargo</Label>
                            <Select 
                                id="role"
                                options={[
                                    { label: "Todos", value: "" },
                                    { label: "Usuário", value: "USER" }, 
                                    { label: "Admin", value: "ADMIN" }
                                ]}
                                value={userFilters.role}
                                onChange={(val) => setUserFilters({...userFilters, role: val})}
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-center items-end gap-4">
                        <Button 
                            type="submit" 
                            variant="primary"
                            className="mb-1 w-full!"
                        >
                            <span className="flex gap-2 items-center">
                                <SearchIcon size={18} /> Buscar
                            </span>
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline"
                            className="mb-1 w-full!"
                            onClick={handleClearUserFilters}
                        >
                            Limpar
                        </Button>
                    </div>
                </form>
            </section>

            <section className="flex flex-col w-full border border-default-border rounded-xl bg-card divide-y divide-default-border">
                <div className="flex w-full gap-4 px-6 py-4 text-xs sm:text-sm font-medium text-muted-fg">    
                    <div className="w-2/12">AÇÃO</div>
                    <div className="w-4/12">NOME</div>
                    <div className="w-4/12">EMAIL</div>
                    <div className="w-2/12">CARGO</div>
                </div>
                
                <div className="flex flex-col divide-y divide-default-border max-h-108 overflow-y-auto">
                    {isLoadingUsers ? (
                        <div className="flex justify-center items-center h-16 py-8">
                            <SpinnerIcon size={24}/>
                        </div>
                    ) : users.length === 0 ? (
                        <div className="text-center py-8 text-muted-fg text-xs sm:text-sm">
                            Nenhum usuário encontrado.
                        </div>
                    ) : (
                        users.map((user) => (
                            <div 
                                key={user.id} 
                                className="flex w-full gap-4 px-6 py-4 items-center text-sm hover:bg-muted/20 transition-colors"
                            >
                                <div className="w-2/12">
                                    <ButtonLink
                                        size="sm"
                                        variant="outline"
                                        className="w-fit!"
                                        href={`/admin/dashboard/users/${user.id}`}
                                    >
                                        Detalhes
                                    </ButtonLink>
                                </div>
                                <div className="w-4/12 font-medium text-default-fg truncate">
                                    {user.name} {user.lastName}
                                </div>
                                <div className="w-4/12 text-muted-fg truncate">
                                    {user.email}
                                </div>
                                <div className="w-2/12">
                                    <Badge className={user.role === 'ADMIN' ? 'bg-primary/10 text-primary border-primary/20' : ''}>
                                        {user.role}
                                    </Badge>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                
                {!isLoadingUsers && users.length > 0 && (
                    <div className="flex justify-between items-center px-6 py-4">
                        <span className="text-sm text-muted-fg">
                            Página {userPagination.currentPage}
                        </span>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUserPageChange(userPagination.currentPage - 1)}
                                disabled={!userPagination.hasPrevPage}
                            >
                                Anterior
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUserPageChange(userPagination.currentPage + 1)}
                                disabled={!userPagination.hasNextPage}
                            >
                                Próximo
                            </Button>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}