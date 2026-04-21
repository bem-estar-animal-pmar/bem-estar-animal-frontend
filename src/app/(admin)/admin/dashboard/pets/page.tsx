// src/app/(admin)/admin/pets/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ApiError } from "@/src/lib/api-error";
import { translateTable } from "@/src/lib/table-map";
import { translateError } from "@/src/lib/error-map";
import { toast } from "@/src/lib/toast-store";

import {Button, Label, Input, Select, Dialog, Badge }  from "@/src/components/ui";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";

import { AdminUpdatePetForm } from "@/src/components/features/admin-dashboard/UpdatePetForm";
import { petSpeciesOptions } from "@/src/constants/constants";
import type { Pet } from "@/src/constants/interfaces";
import { SearchUserIdForm } from "@/src/components/features/admin-dashboard/SearchUserIdForm";

export default function AdminPetsPage() {
    const [pets, setPets] = useState<Pet[]>([]);
    const [isLoadingPets, setIsLoadingPets] = useState(true);

    const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    
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

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    useEffect(() => {
        fetchPets();
    }, []);

    /* unselect pet AFTER pet modal closes */
    useEffect(() => {
        if (!isUpdateModalOpen && selectedPet) {
            const timeout = setTimeout(() => {
                setSelectedPet(null);
            }, 300);

            return () => clearTimeout(timeout);
        }
    }, [isUpdateModalOpen]);

    const buildQueryString = (filters: Record<string, string | number>) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, String(value));
        });
        return params.toString();
    };

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
                    toast.warning(translateError(err.message), { message: firstError })
                    return;
                }
                toast.warning(translateError(err.message));
                return;
            }
            toast.danger("Erro desconhecido ao carregar pets.");
        } finally {
            setIsLoadingPets(false);
        }
    };

    const handlePetSearch = (e: React.FormEvent) => {
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

    const handleUpdateSuccess = () => {
        setIsUpdateModalOpen(false);
        fetchPets();
    };

    return (
        <div className="w-full flex flex-col">
            <div className="flex flex-wrap gap-4 justify-between items-center pb-4">
                <div>
                    <h1 className="text-2xl font-semibold text-default-fg">Gestão de pets</h1>
                    <p className="text-muted-fg text-sm mt-1">Visualize, filtre e edite o registro geral de pets.</p>
                </div>
                <Button 
                    variant="outline"
                    onClick={() => setIsUserModalOpen(true)}
                >
                    Buscar Usuários
                </Button>
            </div>

            <div className="flex flex-col w-full border-default-border border rounded-lg divide-y divide-default-border py-2 mb-4">
                <h2 className="text-default-fg font-semibold text-base sm:text-lg px-4 pb-2 mt-2">
                    Filtrar pets
                </h2>
                <form onSubmit={handlePetSearch} className="flex gap-4 px-4 py-4 bg-neutral">
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
                                ID do Tutor
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
                            Nº do Chip
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
                            <div className="flex justify-center items-center py-8">
                                <SpinnerIcon />
                            </div>
                        ) : pets.length === 0 ? (
                            <div className="text-center py-8 text-muted-fg text-xs sm:text-sm">
                                Nenhum pet encontrado com os filtros atuais.
                            </div>
                        ) : (
                            pets.map((pet) => (
                                <div 
                                    key={pet.id} 
                                    className="flex w-full gap-4 px-6 py-4 items-center text-sm"
                                >
                                    <div className="w-2/16">
                                        <Button 
                                            size="sm" 
                                            variant="outline"
                                            onClick={() => {
                                                setSelectedPet(pet);
                                                setIsUpdateModalOpen(true);
                                            }}
                                        >
                                            Atualizar
                                        </Button>
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
                                    <div className="w-2/16 fext-xs text-muted-fg truncate">
                                        {pet.chip === "NO_CHIP" ? "Sem chip" : pet.chip}
                                    </div>
                                    <div className="w-4/16 text-xs text-muted-fg truncate" title={pet.ownerId}>
                                        <span className="text-default-fg">{pet.owner.name} {pet.owner.lastName}</span>
                                        <div>{pet.ownerId}</div>
                                    </div>
                                </div>
                            ))
                        )}
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
                isOpen={isUserModalOpen} 
                onClose={() => setIsUserModalOpen(false)} 
                title="Buscar Usuário"
                size="lg"
                className="max-w-232!"
            >
                <SearchUserIdForm/>
            </Dialog>

            <Dialog 
                className="text-sm! sm:text-base! max-w-132!"
                isOpen={isUpdateModalOpen} 
                onClose={() => {
                    setIsUpdateModalOpen(false);
                    setSelectedPet(null);
                }} 
                title={`Editando Pet`}
            >
                <AdminUpdatePetForm 
                    pet={selectedPet!} 
                    onSuccess={handleUpdateSuccess} 
                    onCancel={() => {
                        setIsUpdateModalOpen(false);
                    }} 
                />
            </Dialog>
        </div>
    );
}