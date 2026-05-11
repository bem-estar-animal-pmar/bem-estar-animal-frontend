// src/components/features/admin-dashboard/SearchPetIdForm.tsx
"use client";

import { useState } from "react";
import { ApiError } from "@/src/lib/api-error";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/error-map";
import { translateTable } from "@/src/lib/table-map";

import { Button, Input, Label, Select } from "@/src/components/ui";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import { petSpeciesOptions } from "@/src/constants/constants";
import { SearchIcon } from "../../icons/outline";

export const SearchPetIdForm = () => {
    const [pets, setPets] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [filters, setFilters] = useState({ 
        name: "",
        species: "", 
        userId: "",
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

    const fetchPets = async (currentFilters = filters) => {
        setIsLoading(true);
        try {
            const query = buildQueryString(currentFilters);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets?${query}`, {
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }
            setPets(data.data); 
            setPagination(data.meta);
        } catch (err: unknown) {
            if (err instanceof ApiError) {
                if (err.details) {
                    const firstError = err.details[0]?.message;
                    toast.warning(translateError(err.message), { message: firstError });
                    return;
                }
                toast.warning(translateError(err.message));
                return;
            }
            toast.danger("Erro desconhecido ao carregar pets.");
        } finally {
            setIsLoading(false);
        }
    };

    const handlePetSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const newFilters = { ...filters, page: 1 };
        setFilters(newFilters);
        fetchPets(newFilters);
    };

    const handlePetPageChange = (newPage: number) => {
        const newFilters = { ...filters, page: newPage };
        setFilters(newFilters);
        fetchPets(newFilters);
    };

    const handleCopyId = (id: string) => {
        navigator.clipboard.writeText(id);
        toast.success("ID copiado para a área de transferência!");
    };

    return (
        <div className="flex flex-col gap-y-6 py-4">
            <form onSubmit={handlePetSearch} className="flex flex-col md:flex-row gap-4">
                <div className="flex gap-4 w-full max-w-132">
                    <div className="flex flex-col w-full max-w-64">
                        <Label htmlFor="pet-search-name" className="mb-1">Nome</Label>
                        <Input 
                            id="pet-search-name"
                            placeholder="Ex: Rex..." 
                            value={filters.name}
                            onChange={(e) => setFilters({...filters, name: e.target.value})}
                        />
                    </div>
                    <div className="flex flex-col w-full max-w-64">
                        <Label htmlFor="pet-search-species" className="mb-1">Espécie</Label>
                        <Select 
                            id="pet-search-species"
                            options={petSpeciesOptions}
                            value={filters.species}
                            onChange={(val) => setFilters({...filters, species: val})}
                            placeholder="Todas"
                        />
                    </div>
                </div>
                <div className="flex items-end gap-4 w-full max-w-80">
                    <div className="flex flex-col w-full max-w-40">
                        <Label htmlFor="pet-search-userId" className="mb-1">ID do Tutor</Label>
                        <Input 
                            id="pet-search-userId"
                            placeholder="ID do usuário..." 
                            value={filters.userId}
                            onChange={(e) => setFilters({...filters, userId: e.target.value})}
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

            <div className="flex flex-col w-full border border-default-border rounded-lg">
                <div className="flex flex-col w-full">
                    {/* header */}
                    <div className="flex w-full gap-4 px-4 py-3 border-b border-default-border text-xs sm:text-sm font-medium text-muted-fg bg-neutral">
                        <div className="w-1/5">AÇÃO</div>
                        <div className="w-2/5">PET / RAÇA</div>
                        <div className="w-2/5">TUTOR</div>
                    </div>
                    {/* body */}
                    <div className="flex flex-col w-full divide-y divide-default-border overflow-x-auto max-h-48 sm:max-h-64">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-6">
                                <SpinnerIcon />
                            </div>
                        ) : pets.length === 0 ? (
                            <div className="text-center py-6 text-muted-fg text-xs sm:text-sm">
                                Faça uma busca para ver os pets.
                            </div>
                        ) : pets.map(pet => (
                            <div key={pet.id} className="flex w-full gap-4 px-4 py-3 items-center text-sm">
                                <div className="w-1/5">
                                    <Button size="sm" variant="outline" onClick={() => handleCopyId(pet.id)}>
                                        Copiar ID
                                    </Button>
                                </div>
                                <div className="w-2/5 flex flex-col truncate">
                                    <span className="text-default-fg font-medium truncate">{pet.name}</span>
                                    <span className="text-xs text-muted-fg truncate">
                                        {translateTable(pet.species)} {pet.breed ? `- ${translateTable(pet.breed)}` : ''}
                                    </span>
                                </div>
                                <div className="w-2/5 text-xs sm:text-sm text-muted-fg truncate">
                                    <span className="text-default-fg">{pet.owner.name} {pet.owner.lastName}</span>
                                    <div>{pet.ownerId}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* footer (pagination) */}
                {!isLoading && pets.length > 0 && (
                    <div className="flex justify-between items-center px-4 py-3 bg-muted/30 border-t border-default-border mt-auto">
                        <span className="text-sm text-muted-fg">
                            Página {pagination.currentPage}
                        </span>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handlePetPageChange(pagination.currentPage - 1)}
                                disabled={!pagination.hasPrevPage}
                            >
                                Anterior
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handlePetPageChange(pagination.currentPage + 1)}
                                disabled={!pagination.hasNextPage}
                            >
                                Próximo
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};