"use client";

import { useState, useEffect } from "react";
import { ApiError } from "@/src/lib/api-error";
import { translateError } from "@/src/lib/error-map";
import { translateTable } from "@/src/lib/table-map";
import { formatRequestNumber } from "@/src/lib/request-formatter";
import { toast } from "@/src/lib/toast-store";
import { adoptionStatusMap } from "@/src/constants/constants";

import { Button, Label, Input, Select, Dialog, Badge, ButtonLink, Tabs, ButtonTab } from "@/src/components/ui";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import type { AdoptionRequestList } from "@/src/constants/interfaces";

import { SearchPetIdForm } from "@/src/components/features/admin-dashboard/SearchPetIdForm";
import { PetSearchIcon, SquareArrowUpRightIcon, FunnelIcon } from "@/src/components/icons/outline";

type TabType = "PENDING" | "RESOLVED";

export default function AdminAdoptionsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [requests, setRequests] = useState<AdoptionRequestList[]>([]);
    
    const [activeTab, setActiveTab] = useState<TabType>("PENDING");
    const [isPetModalOpen, setIsPetModalOpen] = useState(false);

    const tabStatusGroup: Record<TabType, string[]> = {
        "PENDING": ["PENDING"],
        "RESOLVED": ["APPROVED", "REJECTED", "RETURNED"]
    };

    const [filters, setFilters] = useState({
        petId: "",
        status: tabStatusGroup["PENDING"], 
        page: 1 
    });

    const [pagination, setPagination] = useState({
        currentPage: 1, hasNextPage: false, hasPrevPage: false
    });

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        const newFilters = { ...filters, status: tabStatusGroup[tab], page: 1 };
        setFilters(newFilters);
        fetchRequests(newFilters);
    };

    const buildQueryString = (currentFilters: Record<string, any>) => {
        const params = new URLSearchParams();
        Object.entries(currentFilters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                if (value.length > 0) params.append(key, value.join(","));
            } else if (value !== "" && value !== null && value !== undefined) {
                params.append(key, String(value));
            }
        });
        return params.toString();
    };

    const fetchRequests = async (currentFilters = filters) => {
        setIsLoading(true);
        try {
            const query = buildQueryString(currentFilters);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/adoptions/request?${query}`, {
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) throw new ApiError(data.message, data.code, data.details);
            
            setRequests(data.data);
            setPagination(data.meta);
        } catch (err: unknown) { 
            if (err instanceof ApiError) {
                toast.warning(translateError(err.message), { message: err.details?.[0]?.message });
                return;
            }
            toast.danger("Erro desconhecido ao carregar pedidos de adoção.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const newFilters = { ...filters, page: 1 };
        setFilters(newFilters);
        fetchRequests(newFilters);
    };

    const handlePageChange = (newPage: number) => {
        const newFilters = { ...filters, page: newPage };
        setFilters(newFilters);
        fetchRequests(newFilters);
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const statusOptions = activeTab === "PENDING"
        ? [ { label: "Em análise", value: "PENDING" } ]
        : [ 
            { label: "Todos (Resolvidos)", value: "APPROVED,REJECTED,RETURNED" }, 
            { label: "Aprovado", value: "APPROVED" }, 
            { label: "Rejeitado", value: "REJECTED" },
            { label: "Devolvido", value: "RETURNED" } 
          ];

    return (
        <div className="w-full flex flex-col gap-4">
            <section className="flex flex-wrap gap-4 justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="font-semibold text-base sm:text-xl lg:text-2xl text-default-fg">
                        Gestão de pedidos de adoção
                    </h1>
                    <p className="text-muted-fg text-sm sm:text-base">
                        Gerencie solicitações públicas de adoção para os pets disponíveis.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsPetModalOpen(true)}>
                        <span className="flex gap-2 items-center">
                            <PetSearchIcon /> Buscar pet
                        </span>
                    </Button>
                    <ButtonLink
                        href="/admin/dashboard/give-ups"
                        variant="primary" 
                        className="ml-4"
                        pill="true"
                    >
                        <span className="flex gap-2 items-center">
                            Ir para doações <SquareArrowUpRightIcon />
                        </span>
                    </ButtonLink>
                </div>
            </section>

            <Tabs>
                <ButtonTab isActive={activeTab === "PENDING"} onClick={() => handleTabChange("PENDING")}>
                    Em análise
                </ButtonTab>
                <ButtonTab isActive={activeTab === "RESOLVED"} onClick={() => handleTabChange("RESOLVED")}>
                    Resolvidos
                </ButtonTab>
            </Tabs>

            <section className="flex flex-col w-full border-default-border border rounded-lg divide-y divide-default-border bg-card">
                <form onSubmit={handleSearch} className="flex flex-wrap gap-4 px-4 py-4">
                    <div className="flex flex-col w-full max-w-48">
                        <Label htmlFor="status" className="mb-1">Status</Label>
                        <Select 
                            id="status"
                            options={statusOptions}
                            disabled={activeTab === "PENDING"}
                            value={filters.status.join(",")}
                            onChange={(val) => setFilters({...filters, status: val.split(",")})}
                        />
                    </div>
                    <div className="flex flex-col w-full max-w-64">
                        <Label htmlFor="petId" className="mb-1">ID do pet</Label>
                        <Input 
                            id="petId" placeholder="ID do pet..." 
                            value={filters.petId} onChange={(e) => setFilters({...filters, petId: e.target.value})}
                        />
                    </div>
                    <div className="flex justify-center items-end gap-4">
                        <Button type="submit" variant="primary" className="mb-1 w-full!">
                            <span className="flex gap-2 items-center">
                                <FunnelIcon /> Filtrar
                            </span>
                        </Button>
                        <Button 
                            type="button" variant="outline" className="mb-1 w-full!"
                            onClick={() => {
                                const cleared = { petId: "", status: tabStatusGroup[activeTab], page: 1 };
                                setFilters(cleared);
                                fetchRequests(cleared);
                            }}
                        >
                            Limpar
                        </Button>
                    </div>
                </form>
            </section>

            <section className="flex flex-col w-full border border-default-border rounded-xl bg-card divide-y divide-default-border">
                <div className="flex w-full gap-4 px-6 py-4 text-xs sm:text-sm font-medium text-muted-fg">
                    <div className="w-2/14">AÇÃO</div>
                    <div className="w-2/14">Nº DO PEDIDO</div>
                    <div className="w-2/14">CRIADO EM</div>
                    <div className="w-3/14">PET / ESPÉCIE</div>
                    <div className="w-2/14">STATUS</div>
                    <div className="w-3/14">ADOTANTE</div>
                </div>
                
                <div className="flex flex-col divide-y divide-default-border max-h-108 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-16 py-8"><SpinnerIcon /></div>
                    ) : requests.length === 0 ? (
                        <div className="text-center py-8 text-muted-fg text-sm">Nenhum pedido encontrado.</div>
                    ) : (
                        requests.map((app) => {
                            const statusInfo = adoptionStatusMap?.[app.status] || { label: app.status, classes: "bg-neutral-100 text-neutral-800" };
                            const displayDate = app.createdAt ? app.createdAt.split("T")[0].split("-").reverse().join("/") : "Sem data";

                            return (
                            <div key={app.id} className="flex w-full gap-4 px-6 py-4 items-center text-sm">
                                <div className="w-2/14">
                                    <ButtonLink size="sm" variant="outline" href={`/admin/dashboard/adoptions/${app.id}`} className="w-fit!">
                                        Detalhes
                                    </ButtonLink>
                                </div>  
                                <div className="w-2/14 text-sm truncate">{formatRequestNumber("ADOPTION", app.requestNumber)}</div>
                                <div className="w-2/14 font-medium">{displayDate}</div>
                                <div className="flex flex-col w-3/14">
                                    <span className="font-medium truncate">{app.pet?.name || "Desconhecido"}</span>
                                    <span className="text-xs text-muted-fg">{app.pet?.species ? translateTable(app.pet.species) : "-"}</span>
                                </div>
                                <div className="w-2/14">
                                    <Badge className={statusInfo.classes}>{statusInfo.label}</Badge>
                                </div>
                                <div className="w-3/14 text-xs text-muted-fg truncate" title={app.adopterEmail}>
                                    <span className="text-default-fg block truncate">{app.adopterName}</span>
                                    <span className="block truncate">{app.adopterEmail}</span>
                                </div>
                            </div>);
                        })
                    )}
                </div>
                
                {!isLoading && requests.length > 0 && (
                    <div className="flex justify-between items-center px-6 py-4">
                        <span className="text-sm text-muted-fg">Página {pagination.currentPage}</span>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={!pagination.hasPrevPage}>Anterior</Button>
                            <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={!pagination.hasNextPage}>Próximo</Button>
                        </div>
                    </div>
                )}
            </section>

            <Dialog isOpen={isPetModalOpen} onClose={() => setIsPetModalOpen(false)} title="Buscar Pet" size="lg" className="max-w-232!">
                <SearchPetIdForm />
            </Dialog>
        </div>
    );
}