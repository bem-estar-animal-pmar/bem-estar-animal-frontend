// src/app/(admin)/admin/neuterings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { ApiError } from "@/src/lib/api-error";
import { translateError } from "@/src/lib/error-map";
import { translateTable } from "@/src/lib/table-map";
import { toast } from "@/src/lib/toast-store";
import { neuteringStatusMap } from "@/src/constants/constants";

import { Button, Label, Input, Select, Dialog, Badge } from "@/src/components/ui";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";

import { SearchUserIdForm } from "@/src/components/features/admin-dashboard/SearchUserIdForm";
import { AdminUpdateNeuteringForm } from "@/src/components/features/admin-dashboard/UpdateNeuteringForm";
import { SearchPetIdForm } from "@/src/components/features/admin-dashboard/SearchPetIdForm";

export default function AdminNeuteringsPage() {
    const [appointments, setAppointments] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"ONGOING" | "FINISHED">("ONGOING");

    const [selectedAppt, setSelectedAppt] = useState<any | null>(null);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isPetModalOpen, setIsPetModalOpen] = useState(false);
    
    const [filters, setFilters] = useState({
        userId: "",
        petId: "",
        status: "PENDING", /* start with pending to prevent pagination break */
        page: 1 
    });
    
    const [pagination, setPagination] = useState({
        currentPage: 1, hasNextPage: false, hasPrevPage: false
    });

    /* changing tabs reset the filters */
    const handleTabChange = (tab: "ONGOING" | "FINISHED") => {
        setActiveTab(tab);
        const defaultStatus = tab === "ONGOING" ? "PENDING" : "COMPLETED";
        const newFilters = { ...filters, status: defaultStatus, page: 1 };
        setFilters(newFilters);
        fetchAppointments(newFilters);
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    useEffect(() => {
        if (!isUpdateModalOpen && selectedAppt) {
            const timeout = setTimeout(() => setSelectedAppt(null), 300);
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

    const fetchAppointments = async (currentFilters = filters) => {
        setIsLoading(true);
        try {
            const query = buildQueryString(currentFilters);
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/neuterings?${query}`, {
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) throw new ApiError(data.message, data.code, data.details);
            
            setAppointments(data.data);
            setPagination(data.meta);
        } catch (err: unknown) { 
            if (err instanceof ApiError) {
                toast.warning(translateError(err.message), { message: err.details?.[0]?.message });
                return;
            }
            toast.danger("Erro desconhecido ao carregar agendamentos.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const newFilters = { ...filters, page: 1 };
        setFilters(newFilters);
        fetchAppointments(newFilters);
    };

    const handlePageChange = (newPage: number) => {
        const newFilters = { ...filters, page: newPage };
        setFilters(newFilters);
        fetchAppointments(newFilters);
    };

    const handleUpdateSuccess = () => {
        setIsUpdateModalOpen(false);
        fetchAppointments();
    };

    /* options are based on active tabs */
    const statusOptionsForTab = activeTab === "ONGOING" 
        ? [ { label: "Pendente", value: "PENDING" }, { label: "Aguard. Exames", value: "AWAITING_EXAMS" }, { label: "Confirmado", value: "CONFIRMED" } ]
        : [ { label: "Concluído", value: "COMPLETED" }, { label: "Cancelado", value: "CANCELLED" }, { label: "Não compareceu", value: "NO_SHOW" } ];

    return (
        <div className="w-full flex flex-col">
            <div className="flex flex-wrap gap-4 justify-between items-center pb-4">
                <div>
                    <h1 className="text-2xl font-semibold text-default-fg">Gestão de castrações</h1>
                    <p className="text-muted-fg text-sm mt-1">Gerencie agendamentos, status e faltas.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsUserModalOpen(true)}>Buscar Usuário</Button>
                    <Button variant="outline" onClick={() => setIsPetModalOpen(true)}>Buscar Pet</Button>
                </div>
            </div>

            {/* Navegação de Abas */}
            <div className="flex border-b border-default-border mb-4">
                <button 
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "ONGOING" ? "border-primary-border text-primary-fg" : "border-transparent text-muted-fg hover:text-default-fg"}`}
                    onClick={() => handleTabChange("ONGOING")}
                >
                    Em Andamento
                </button>
                <button 
                    className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === "FINISHED" ? "border-primary-border text-primary-fg" : "border-transparent text-muted-fg hover:text-default-fg"}`}
                    onClick={() => handleTabChange("FINISHED")}
                >
                    Finalizados
                </button>
            </div>

            {/* Filtros */}
            <div className="flex flex-col w-full border-default-border border rounded-lg py-2 mb-4">
                <form onSubmit={handleSearch} className="flex flex-wrap items-end gap-4 px-4 py-2 bg-neutral">
                    <div className="flex flex-col w-full max-w-48">
                        <Label htmlFor="status" className="mb-1">Status</Label>
                        <Select 
                            id="status"
                            options={statusOptionsForTab}
                            value={filters.status}
                            onChange={(val) => setFilters({...filters, status: val})}
                        />
                    </div>
                    <div className="flex flex-col w-full max-w-64">
                        <Label htmlFor="userId" className="mb-1">ID do Dono</Label>
                        <Input 
                            id="userId" placeholder="ID do usuário..." 
                            value={filters.userId} onChange={(e) => setFilters({...filters, userId: e.target.value})}
                        />
                    </div>
                    <div className="flex flex-col w-full max-w-64">
                        <Label htmlFor="petId" className="mb-1">ID do Pet</Label>
                        <Input 
                            id="petId" placeholder="ID do pet..." 
                            value={filters.petId} onChange={(e) => setFilters({...filters, petId: e.target.value})}
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button type="submit" variant="primary">Filtrar</Button>
                        <Button type="button" variant="outline" onClick={() => {
                            const cleared = { userId: "", petId: "", status: activeTab === "ONGOING" ? "PENDING" : "COMPLETED", page: 1 };
                            setFilters(cleared);
                            fetchAppointments(cleared);
                        }}>Limpar</Button>
                    </div>
                </form>
            </div>

            {/* Tabela */}
            <div className="w-full overflow-x-auto border border-default-border rounded-xl bg-card">
                <div className="flex flex-col">
                    <div className="flex w-full gap-4 px-6 py-4 bg-neutral border-b border-default-border text-xs sm:text-sm font-medium text-muted-fg">
                        <div className="w-2/12">AÇÃO</div>
                        <div className="w-3/12">DATA E PERÍODO</div>
                        <div className="w-3/12">PET / ESPÉCIE</div>
                        <div className="w-2/12">STATUS</div>
                        <div className="w-2/12">TUTOR</div>
                    </div>
                    
                    <div className="flex flex-col divide-y divide-default-border">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-8"><SpinnerIcon /></div>
                        ) : appointments.length === 0 ? (
                            <div className="text-center py-8 text-muted-fg text-sm">Nenhum agendamento encontrado.</div>
                        ) : (
                            appointments.map((app) => {
                                const statusInfo = neuteringStatusMap[app.status] || { label: app.status, classes: "bg-gray-100 text-gray-800 border-gray-200" };

                                return (
                                <div key={app.id} className="flex w-full gap-4 px-6 py-4 items-center text-sm">
                                    <div className="w-2/12">
                                        {activeTab === "ONGOING" ? (
                                            <Button size="sm" variant="outline" onClick={() => { setSelectedAppt(app); setIsUpdateModalOpen(true); }}>
                                                Gerenciar
                                            </Button>
                                        ) : (
                                            <span className="text-muted-fg text-xs">Bloqueado</span>
                                        )}
                                    </div>
                                    <div className="flex flex-col w-3/12">
                                        <span className="text-default-fg">
                                            {app.scheduleDate.split("T")[0].split("-").reverse().join("/")}
                                        </span>
                                        <span className="text-xs text-muted-fg">{translateTable(app.period)}</span>
                                    </div>
                                    <div className="flex flex-col w-3/12">
                                        <span className="text-default-fg font-medium truncate">{app.pet.name}</span>
                                        <span className="text-xs text-muted-fg">{translateTable(app.pet.species)}</span>
                                    </div>
                                    <div className="w-2/12">
                                        <Badge
                                            className={` ${statusInfo.classes}`}
                                        >
                                            {statusInfo.label}
                                        </Badge>
                                    </div>
                                    <div className="w-2/12 text-muted-fg truncate" title={app.user?.email}>
                                        {app.user.name || "N/A"} {app.user.lastName || "N/A"}
                                    </div>
                                </div>);
                            })
                        )}
                    </div>
                    
                    {!isLoading && appointments.length > 0 && (
                        <div className="flex justify-between items-center px-6 py-4 bg-muted/30 border-t border-default-border">
                            <span className="text-sm text-muted-fg">Página {pagination.currentPage}</span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={!pagination.hasPrevPage}>Anterior</Button>
                                <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={!pagination.hasNextPage}>Próximo</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modais */}
            <Dialog isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Buscar Usuário" size="lg" className="max-w-232!">
                <SearchUserIdForm />
            </Dialog>

            <Dialog isOpen={isPetModalOpen} onClose={() => setIsPetModalOpen(false)} title="Buscar Pet" size="lg" className="max-w-232!">
                <SearchPetIdForm />
            </Dialog>

            <Dialog className="max-w-132!" isOpen={isUpdateModalOpen} onClose={() => { setIsUpdateModalOpen(false); setSelectedAppt(null); }} size="lg" title="Gerenciar Agendamento">
                {selectedAppt && (
                    <AdminUpdateNeuteringForm 
                        appointment={selectedAppt} 
                        onSuccess={handleUpdateSuccess} 
                        onCancel={() => setIsUpdateModalOpen(false)} 
                    />
                )}
            </Dialog>
        </div>
    );
}