"use client";

import { useState, useEffect } from "react";
import { ApiError } from "@/src/lib/api-error";
import { translateError } from "@/src/lib/error-map";
import { translateTable } from "@/src/lib/table-map";
import { toast } from "@/src/lib/toast-store";
import { neuteringStatusMap } from "@/src/constants/constants";

import { Button, Label, Input, Select, Dialog, Badge, ButtonLink, Tabs, ButtonTab } from "@/src/components/ui";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";

import { SearchUserIdForm } from "@/src/components/features/admin-dashboard/SearchUserIdForm";
import { SearchPetIdForm } from "@/src/components/features/admin-dashboard/SearchPetIdForm";

type TabType = "PENDING" | "CONFIRMED" | "FINISHED";

export default function AdminNeuteringsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [appointments, setAppointments] = useState<any[]>([]);

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isPetModalOpen, setIsPetModalOpen] = useState(false);

    const tabStatusGroup: Record<string, string[]> = {
        "PENDING": ["PENDING", "AWAITING_EXAMS"],
        "CONFIRMED": ["CONFIRMED"],
        "FINISHED": ["COMPLETED", "CANCELLED", "NO_SHOW"]
    }
    
    const [filters, setFilters] = useState<{ userId: string; petId: string; status: string[]; page: number }>({
        userId: "",
        petId: "",
        status: tabStatusGroup["PENDING"], 
        page: 1 
    });
    
    const [activeTab, setActiveTab] = useState<TabType>("PENDING");
    const [pagination, setPagination] = useState({
        currentPage: 1, hasNextPage: false, hasPrevPage: false
    });

    const handleTabChange = (tab: TabType) => {
        setActiveTab(tab);
        const newFilters = { 
            ...filters, 
            status: tabStatusGroup[tab], 
            page: 1 
        };
        setFilters(newFilters);
        fetchAppointments(newFilters);
    };

    const buildQueryString = (filters: Record<string, any>) => {
        const params = new URLSearchParams();
        Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                if (value.length > 0) {
                    params.append(key, value.join(","));
                }
            } else if (value !== "" && value !== null && value !== undefined) {
                params.append(key, String(value));
            }
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

    useEffect(() => {
        fetchAppointments();
    }, []);

    const statusOptionsForTab = activeTab === "PENDING" 
        ? [ 
            { label: "Todos (Pendentes)", value: "PENDING,AWAITING_EXAMS" }, 
            { label: "Pendente", value: "PENDING" }, 
            { label: "Aguard. Exames", value: "AWAITING_EXAMS" } 
          ]
        : activeTab === "CONFIRMED"
        ? [ { label: "Confirmado", value: "CONFIRMED" } ]
        : [ 
            { label: "Todos (Finalizados)", value: "COMPLETED,CANCELLED,NO_SHOW" }, 
            { label: "Concluído", value: "COMPLETED" }, 
            { label: "Cancelado", value: "CANCELLED" }, 
            { label: "Não compareceu", value: "NO_SHOW" } 
          ];

    return (
        <div className="w-full flex flex-col">
            <div className="flex flex-wrap gap-4 justify-between items-center">
                <div className="flex flex-col pb-4">
                    <h1 className="font-semibold text-xl sm:text-xl lg:text-2xl text-default-fg">
                        Gestão de pedidos castração
                    </h1>
                    <p className="text-muted-fg text-sm sm:text-base">
                        Gerencie agendamentos, status e faltas.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsUserModalOpen(true)}>
                        Buscar Usuário
                    </Button>
                    <Button variant="outline" onClick={() => setIsPetModalOpen(true)}>
                        Buscar Pet
                    </Button>
                </div>
            </div>

            <Tabs>
                <ButtonTab
                    isActive={activeTab === "PENDING"}
                    onClick={() => handleTabChange("PENDING")}
                >
                    Pendentes
                </ButtonTab>
                <ButtonTab
                    isActive={activeTab === "CONFIRMED"}
                    onClick={() => handleTabChange("CONFIRMED")}
                >
                    Em andamento
                </ButtonTab>
                <ButtonTab
                    isActive={activeTab === "FINISHED"}
                    onClick={() => handleTabChange("FINISHED")}
                >
                    Finalizados
                </ButtonTab>
            </Tabs>

            <div className="flex flex-col w-full border-default-border border rounded-lg divide-y divide-default-border mb-4">
                <h2 className="text-default-fg font-semibold text-xs sm:text-base lg:text-lg px-4 py-4">
                    Filtrar pedidos de castração
                </h2>
                <form onSubmit={handleSearch} className="flex flex-wrap gap-4 px-4 py-4 bg-neutral">
                    <div className="flex flex-col w-full max-w-48">
                        <Label htmlFor="status" className="mb-1">Status</Label>
                        <Select 
                            id="status"
                            options={statusOptionsForTab}
                            disabled={activeTab === "CONFIRMED"}
                            value={filters.status.join(",")}
                            onChange={(val) => setFilters({...filters, status: val.split(",")})}
                        />
                    </div>
                    <div className="flex flex-col w-full max-w-64">
                        <Label htmlFor="userId" className="mb-1">ID do tutor</Label>
                        <Input 
                            id="userId" placeholder="ID do usuário..." 
                            value={filters.userId} onChange={(e) => setFilters({...filters, userId: e.target.value})}
                        />
                    </div>
                    <div className="flex flex-col w-full max-w-64">
                        <Label htmlFor="petId" className="mb-1">ID do pet</Label>
                        <Input 
                            id="petId" 
                            placeholder="ID do pet..." 
                            value={filters.petId} 
                            onChange={(e) => setFilters({...filters, petId: e.target.value})}
                        />
                    </div>
                    <div className="flex flex-col md:flex-row justify-center items-end gap-4">
                        <Button type="submit" variant="primary">
                            Filtrar
                        </Button>
                        <Button type="button" variant="outline" onClick={() => {
                            const defaultStatuses = activeTab === "PENDING" ? ["PENDING", "AWAITING_EXAMS"] 
                                                  : activeTab === "CONFIRMED" ? ["CONFIRMED"] 
                                                  : ["COMPLETED", "CANCELLED", "NO_SHOW"];
                            const cleared = { userId: "", petId: "", status: defaultStatuses, page: 1 };
                            setFilters(cleared);
                            fetchAppointments(cleared);
                        }}>
                            Limpar
                        </Button>
                    </div>
                </form>
            </div>

            <div className="w-full overflow-x-auto border border-default-border rounded-xl bg-card">
                <div className="flex flex-col">
                    <div className="flex w-full gap-4 px-6 py-4 bg-neutral border-b border-default-border text-xs sm:text-sm font-medium text-muted-fg">
                        <div className="w-2/12">AÇÃO</div>
                        <div className="w-2/12">DATA E PERÍODO</div>
                        <div className="w-3/12">PET / ESPÉCIE</div>
                        <div className="w-2/12">STATUS</div>
                        <div className="w-3/12">TUTOR</div>
                    </div>
                    
                    <div className="flex flex-col divide-y divide-default-border">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-8">
                                <SpinnerIcon />
                            </div>
                        ) : appointments.length === 0 ? (
                            <div className="text-center py-8 text-muted-fg text-sm">Nenhum agendamento encontrado.</div>
                        ) : (
                            appointments.map((app) => {
                                const statusInfo = neuteringStatusMap[app.status];
                                const displayDate = app.scheduleDate ? app.scheduleDate.split("T")[0].split("-").reverse().join("/")  : "Sem data";
                                const period = app.period ? translateTable(app.period) : ""

                                return (
                                <div key={app.id} className="flex w-full gap-4 px-6 py-4 items-center text-sm">
                                    <div className="w-2/12">
                                        <ButtonLink 
                                            size="sm" 
                                            variant="outline" 
                                            href={`/admin/dashboard/neuterings/${app.id}`}
                                            className="w-fit!"
                                        >
                                            Atualizar
                                        </ButtonLink>
                                    </div>  
                                    <div className="flex flex-col w-2/12">
                                        <p className="text-default-fg font-medium">{displayDate}</p>
                                        {app.period && (
                                            <p className="text-muted-fg text-xs">Período: {period}</p>
                                        )}
                                    </div>
                                    <div className="flex flex-col w-3/12">
                                        <span className="text-default-fg font-medium truncate">{app.pet.name}</span>
                                        <span className="text-xs text-muted-fg">{translateTable(app.pet.species)}</span>
                                    </div>
                                    <div className="w-2/12">
                                        <Badge className={` ${statusInfo.classes}`}>
                                            {statusInfo.label}
                                        </Badge>
                                    </div>
                                    <div className="w-3/12 text-xs text-muted-fg truncate" title={app.user?.email}>
                                        <span className="text-default-fg">{app.user.name} {app.user.lastName}</span>
                                        <div>{app.userId}</div>
                                    </div>
                                </div>);
                            })
                        )}
                    </div>
                    
                    {!isLoading && appointments.length > 0 && (
                        <div className="flex justify-between items-center px-6 py-4 border-t border-default-border">
                            <span className="text-sm text-muted-fg">Página {pagination.currentPage}</span>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={!pagination.hasPrevPage}>Anterior</Button>
                                <Button variant="outline" size="sm" onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={!pagination.hasNextPage}>Próximo</Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <Dialog isOpen={isUserModalOpen} onClose={() => setIsUserModalOpen(false)} title="Buscar Usuário" size="lg" className="max-w-232!">
                <SearchUserIdForm />
            </Dialog>

            <Dialog isOpen={isPetModalOpen} onClose={() => setIsPetModalOpen(false)} title="Buscar Pet" size="lg" className="max-w-232!">
                <SearchPetIdForm />
            </Dialog>
        </div>
    );
}