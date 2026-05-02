"use client";

import { useState, useEffect } from "react";
import { ApiError } from "@/src/lib/api-error";
import { translateTable } from "@/src/lib/table-map";
import { translateError } from "@/src/lib/error-map";
import { toast } from "@/src/lib/toast-store";

import { petSpeciesOptions } from "@/src/constants/constants";
import type { Pet } from "@/src/constants/interfaces";

import { Button, Label, Input, Select, Dialog, Badge, ButtonLink, Card }  from "@/src/components/ui";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import { SearchUserIdForm } from "@/src/components/features/admin-dashboard/SearchUserIdForm";

export default function AdminPetsPage() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [isLoadingPets, setIsLoadingPets] = useState(true);
    const [searchUserDialogOpen, setSearchUserDialogOpen] = useState(false);
    
    const [petFilters, setPetFilters] = useState({
        name: "",
        species: "",
        userId: "",
        chip: "",
        page: 1 
    });
    
    const [pagination, setPagination] = useState({
        currentPage: 1,
        hasNextPage: false,
        hasPrevPage: false
    });

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async (currentFilters = petFilters) => {
        setIsLoadingPets(true);
        try {
            const query = buildQueryString(currentFilters);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets?${query}`, {
                credentials: "include",
            });

            const responseData = await response.json();
            if (!response.ok) {
                throw new ApiError(responseData.message, responseData.code, responseData.details);
            }
            
            setPets(responseData.data);
            setPagination(responseData.meta);
        } catch (err: unknown) { 
            if (err instanceof ApiError) {
                if (err.details) {
                    const firstError = err.details[0]?.message
                    toast.danger(translateError(err.message), { message: firstError })
                    return;
                }
                toast.danger(translateError(err.message));
                return;
            }
            toast.danger("Erro desconhecido ao carregar pets.");
        } finally {
            setIsLoadingPets(false);
        }
    };

    const buildQueryString = (filters: Record<string, string | number>) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, String(value));
        });
        return params.toString();
    };

    const handlePetSearch = (e: React.SubmitEvent) => {
        e.preventDefault();
        const newFilters = { ...petFilters, page: 1 };
        setPetFilters(newFilters);
        fetchPets(newFilters);
    };

    const handlePageChange = (newPage: number) => {
        const newFilters = { ...petFilters, page: newPage };
        setPetFilters(newFilters);
        fetchPets(newFilters);
    };

    return (
        <div className="w-full flex flex-col">
            <div className="flex flex-wrap gap-4 justify-between items-center border-b border-default-border mb-4 pb-2">
                <div className="flex flex-col pb-4">
                    <h1 className="font-semibold text-xl sm:text-xl lg:text-2xl text-default-fg">
                        Busca de pets
                    </h1>
                    <p className="text-muted-fg text-sm sm:text-base">
                        Visualize, filtre e edite o registro geral de pets dos tutores.
                    </p>
                </div>
                <Button 
                    variant="outline"
                    onClick={() => setSearchUserDialogOpen(true)}
                >
                    Buscar Usuários
                </Button>
            </div>
            <div className="flex flex-col w-full border-default-border border rounded-lg divide-y divide-default-border mb-4 bg-card">
                <h2 className="text-default-fg font-semibold text-xs sm:text-base lg:text-lg px-4 py-4">
                    Filtrar pets
                </h2>
                <form onSubmit={handlePetSearch} className="flex gap-4 px-4 py-4">
                    <div className="flex flex-col md:flex-row gap-4 w-full max-w-116">
                        <div className="flex flex-col w-full max-w-64">
                            <Label htmlFor="pet-name" className="mb-1">
                                Nome
                            </Label>
                            <Input 
                                id="pet-name"
                                placeholder="Ex: Rex" 
                                value={petFilters.name}
                                onChange={(e) => setPetFilters({...petFilters, name: e.target.value})}
                            />
                        </div>

                        <div className="flex flex-col w-full max-w-48">
                            <Label htmlFor="pet-species" className="mb-1">
                                Espécie
                            </Label>
                            <Select 
                                id="pet-species"
                                options={petSpeciesOptions}
                                value={petFilters.species}
                                onChange={(val) => setPetFilters({...petFilters, species: val})}
                                placeholder="Todas"
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 w-full max-w-132">
                        <div className="flex flex-col w-full max-w-64">
                            <Label htmlFor="pet-userId" className="mb-1">
                                ID do tutor
                            </Label>
                            <Input 
                                id="pet-userId"
                                placeholder="Cole o ID do usuário..." 
                                value={petFilters.userId}
                                onChange={(e) => setPetFilters({...petFilters, userId: e.target.value})}
                            />
                        </div>
                        <div className="flex flex-col w-full max-w-64">
                            <Label htmlFor="pet-chip" className="mb-1">
                            Nº do chip
                            </Label>
                            <Input 
                                id="pet-chip"
                                placeholder="Número do chip..." 
                                value={petFilters.chip}
                                onChange={(e) => setPetFilters({...petFilters, chip: e.target.value})}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row justify-center items-end gap-4">
                        <Button 
                            type="submit" 
                            variant="primary"
                            className="mb-1 w-full!"
                        >
                            Filtrar
                        </Button>

                        <Button 
                            type="button" 
                            variant="outline"
                            className="mb-1 w-full!"
                            onClick={() => {
                                const cleared = { name: "", species: "", userId: "", chip: "", page: 1 };
                                setPetFilters(cleared);
                                fetchPets(cleared);
                            }}
                        >
                            Limpar
                        </Button>
                    </div>
                </form>
            </div>

            <div className="w-full overflow-x-auto border border-default-border rounded-xl bg-card">
                <div className="flex flex-col">
                    <div className="flex w-full gap-4 px-6 py-4 bg-neutral border-b border-default-border text-xs sm:text-sm font-medium text-muted-fg">    
                        <div className="w-2/16">AÇÃO</div>
                        <div className="w-3/16">PET</div>
                        <div className="w-3/16">ESPÉCIE/RAÇA</div>
                        <div className="w-2/16">STATUS</div>
                        <div className="w-2/16">CHIP</div>
                        <div className="w-4/16">Tutor</div>
                    </div>
                    
                    <div className="flex flex-col divide-y divide-default-border">
                        {isLoadingPets ? (
                            <div className="flex justify-center items-center h-16 py-8">
                                <SpinnerIcon size={24}/>
                            </div>
                        ) : pets.length === 0 ? 
                            (
                                <div className="text-center py-8 text-muted-fg text-xs sm:text-sm">
                                    Nenhum pet encontrado com os filtros atuais.
                                </div>
                            ) 
                                : 
                            (
                                pets.map((pet) => (
                                    <div 
                                        key={pet.id} 
                                        className="flex w-full gap-4 px-6 py-4 items-center text-sm"
                                    >
                                        <div className="w-2/16">
                                            <ButtonLink
                                                size="sm"
                                                variant="outline"
                                                className="w-fit!"
                                                href={`/admin/dashboard/pets/${pet.id}`}
                                            >
                                                Detalhes
                                            </ButtonLink>
                                        </div>
                                        <div className="w-3/16 font-medium text-default-fg truncate">
                                            {pet.name}
                                        </div>
                                        <div className="flex flex-col w-3/16">
                                            <span className="text-default-fg">
                                                {translateTable(pet.species)}
                                            </span>
                                            <span className="text-xs text-muted-fg truncate">
                                                {translateTable(pet.breed)}
                                            </span>
                                        </div>
                                        <div className="w-2/16">
                                            <Badge>
                                                {translateTable(pet.adoptionStatus)}
                                            </Badge>
                                        </div>
                                        <div className="w-2/16 text-xs sm:text-sm text-muted-fg truncate">
                                            {pet.chip === "NO_CHIP" ? "Sem chip" : pet.chip}
                                        </div>
                                        <div className="w-4/16 text-xs text-muted-fg truncate" title={pet.ownerId}>
                                            <span className="text-default-fg">{pet.owner!.name} {pet.owner!.lastName}</span>
                                            <div>{pet.ownerId}</div>
                                        </div>
                                    </div>
                                ))
                            )
                        }
                    </div>
                    
                    {!isLoadingPets && pets.length > 0 && (
                        <div className="flex justify-between items-center px-6 py-4 bg-muted/30 border-t border-default-border">
                            <span className="text-sm text-muted-fg">
                                Página {pagination.currentPage}
                            </span>
                            <div className="flex gap-2">
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                                    disabled={!pagination.hasPrevPage}
                                >
                                    Anterior
                                </Button>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                                    disabled={!pagination.hasNextPage}
                                >
                                    Próximo
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Dialog 
                isOpen={searchUserDialogOpen} 
                onClose={() => setSearchUserDialogOpen(false)} 
                title="Buscar Usuário"
                size="lg"
                className="max-w-232!"
            >
                <SearchUserIdForm/>
            </Dialog>
        </div>
    );
}