"use client"
import { useState } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/translation-map";

import { Button, Input, Label, Select } from "@/src/components/ui";
import { SpinnerIcon } from "../../icons/SpinnerIcon";
import { SearchIcon } from "../../icons/outline";
import { userRoleOptions } from "@/src/constants/constants";

export const SearchUserIdForm = () => {

    const [users, setUsers] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [filters, setFilters] = useState({ 
        name: "",
        email: "", 
        role: "USER",
        page: 1 
    });

    const [pagination, setPagination] = useState({
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false
    });

    const buildQueryString = (filters: Record<string, string | number>) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) {
                params.append(key, String(value));
            }
        });
        return params.toString();
    };

    const fetchUsers = async (currentFilters = filters) => {
        setIsLoading(true);
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
            setPagination(data.meta);
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível carregar usuários."
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUserSearch = (e: React.SubmitEvent) => {
        e.preventDefault();
        const newFilters = { ...filters, page: 1 };
        setFilters(newFilters);
        fetchUsers(newFilters);
    };

    const handleUserPageChange = (newPage: number) => {
        const newFilters = { ...filters, page: newPage };
        setFilters(newFilters);
        fetchUsers(newFilters);
    };

    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("ID copiado para a área de transferência!");
    };

    return (
        <div className="flex flex-col gap-y-6 py-4">
            <form onSubmit={handleUserSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex gap-4 w-full max-w-132">
                    <div className="flex flex-col w-full max-w-64">
                        <Label
                            htmlFor="name"
                            className="mb-1"
                        >
                            Nome
                        </Label>
                        <Input 
                            id="name"
                            placeholder="Buscar por nome..." 
                            value={filters.name}
                            onChange={(e) => setFilters({...filters, name: e.target.value})}
                        />
                    </div>
                    <div className="flex flex-col w-full max-w-64">
                        <Label
                            htmlFor="email"
                            className="mb-1"
                        >
                            Email
                        </Label>
                        <Input 
                            id="email"
                            placeholder="Ex: joao@gmail.com" 
                            value={filters.email}
                            onChange={(e) => setFilters({...filters, email: e.target.value})}
                        />
                    </div>
                </div>
                <div className="flex items-end gap-4 w-full max-w-80">
                    <div className="flex flex-col w-full max-w-40">
                        <Label
                            htmlFor="role"
                            className="mb-1"
                        >
                            Cargo
                        </Label>
                        <Select 
                            id="role"
                            options={userRoleOptions}
                            value={filters.role}
                            onChange={(val) => setFilters({...filters, role: val})}
                        />
                    </div>
                    <Button 
                        type="submit"
                        variant="primary"
                        className="mb-1 w-full max-w-28"
                    >
                        <span className="flex gap-2 items-center">
                            <SearchIcon size={18}/> Buscar
                        </span>
                    </Button>
                </div>

            </form>

            <div className=" flex flex-col w-full border border-default-border rounded-lg">
                <div className="flex flex-col w-full">
                    {/* header */}
                    <div className="flex w-full gap-4 px-4 py-3 border-b border-default-border text-xs sm:text-sm font-medium text-muted-fg bg-neutral">
                        <div className="w-1/5">AÇÃO</div>
                        <div className="w-2/5">NOME</div>
                        <div className="w-2/5">EMAIL</div>
                    </div>
                    {/* body */}
                    <div className="flex flex-col w-full divide-y divide-default-border overflow-x-auto max-h-48 sm:max-h-64">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-6">
                                <SpinnerIcon />
                            </div>
                        ) : users.length === 0 ? (
                            <div className="text-center py-6 text-muted-fg text-xs sm:text-sm">
                                Faça uma busca para ver os usuários.
                            </div>
                        ) : users.map(user => (
                            <div 
                                key={user.id} 
                                className="flex w-full gap-4 px-4 py-3 items-center text-sm"
                            >
                                <div className="w-1/5">
                                    <Button size="sm" variant="outline" onClick={() => handleCopyId(user.id)}>
                                        Copiar ID
                                    </Button>
                                </div>
                                <div className="w-2/5 text-default-fg truncate">
                                    {user.name} {user.lastName}
                                </div>
                                <div className="w-2/5 text-xs sm:text-sm text-muted-fg truncate">
                                    {user.email}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* footer (pagination) */}
                {!isLoading && users.length > 0 && (
                    <div className="flex justify-between items-center px-4 py-3 bg-muted/30 border-t border-default-border mt-auto">
                        <span className="text-sm text-muted-fg">
                            Página {pagination.currentPage}
                        </span>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUserPageChange(pagination.currentPage - 1)}
                                disabled={!pagination.hasPrevPage}
                            >
                                Anterior
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleUserPageChange(pagination.currentPage + 1)}
                                disabled={!pagination.hasNextPage}
                            >
                                Próximo
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
