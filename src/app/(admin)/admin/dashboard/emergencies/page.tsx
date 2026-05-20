"use client";

import { useState, useEffect } from "react";
import { ApiError } from "@/src/lib/api-error";
import { translateError, translateTable } from "@/src/lib/translation-map";
import { formatRequestNumber } from "@/src/lib/request-formatter";
import { toast } from "@/src/lib/toast-store";
import { emergencyStatusMap } from "@/src/constants/constants"; // Assumindo que você tenha ou criará esse map

import { Button, Label, Input, Select, Dialog, Badge, ButtonLink, Tabs, ButtonTab, InfoPopUp } from "@/src/components/ui";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import type { AdminEmergencyAppointment } from "@/src/constants/interfaces";

import { SearchUserIdForm } from "@/src/components/features/admin-dashboard/SearchUserIdForm";
import { SearchPetIdForm } from "@/src/components/features/admin-dashboard/SearchPetIdForm";
import { FunnelIcon, PetSearchIcon, UserSearchIcon } from "@/src/components/icons/outline";

type TabType = "PENDING" | "CONFIRMED" | "FINISHED";

export default function AdminEmergenciesPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [appointments, setAppointments] = useState<AdminEmergencyAppointment[]>([]);

    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isPetModalOpen, setIsPetModalOpen] = useState(false);

    // Removido o AWAITING_EXAMS pois não pertence ao EmergencyStatus
    const tabStatusGroup: Record<string, string[]> = {
        "PENDING": ["PENDING"],
        "CONFIRMED": ["CONFIRMED"],
        "FINISHED": ["COMPLETED", "CANCELLED", "NO_SHOW"]
    }
    
    const [filters, setFilters] = useState<{ userId: string; petId: string; status: string[]; page: number }>({
        userId: "",
        petId: "", // Mantido caso haja filtro por petId (agendamentos já finalizados que ganharam petId)
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
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emergencies?${query}`, {
                credentials: "include",
            });

            const data = await response.json();
            if (!response.ok) throw new ApiError(data.message, data.code, data.details);
            
            setAppointments(data.data);
            setPagination(data.meta);
        } catch (err: unknown) { 
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível carregar agendamentos de emergência."
            });
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
            { label: "Em análise", value: "PENDING" } 
          ]
        : activeTab === "CONFIRMED"
        ? [ { label: "Confirmado", value: "CONFIRMED" } ]
        : [ 
            { label: "Todos (Finalizados)", value: "COMPLETED,CANCELLED,NO_SHOW" }, 
            { label: "Concluído", value: "COMPLETED" }, 
            { label: "Cancelado", value: "CANCELLED" }, 
            { label: "Não compareceu", value: "NO_SHOW" } 
          ];

    const tomorrowUtcTimestamp = Date.UTC(
        new Date().getUTCFullYear(),
        new Date().getUTCMonth(),
        new Date().getUTCDate() + 1
    );

    return (
        <div className="w-full flex flex-col gap-4">
            <section className="flex flex-wrap gap-4 justify-between items-center">
                <div className="flex flex-col">
                    <h1 className="font-semibold text-base sm:text-xl lg:text-2xl text-default-fg">
                        Gestão de pedidos de emergência
                    </h1>
                    <p className="text-muted-fg text-sm sm:text-base">
                        Gerencie requisições de emergência, status e faltas.
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsUserModalOpen(true)}>
                        <span className="flex gap-2 items-center">
                            <UserSearchIcon /> Buscar usuário
                        </span>
                    </Button>
                    <Button variant="outline" onClick={() => setIsPetModalOpen(true)}>
                        <span className="flex gap-2 items-center">
                            <PetSearchIcon /> Buscar pet
                        </span>
                    </Button>
                </div>
            </section>

            <Tabs>
                <ButtonTab
                    isActive={activeTab === "PENDING"}
                    onClick={() => handleTabChange("PENDING")}
                >
                    Em análise
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

            <section className="flex flex-col w-full border-default-border border rounded-lg divide-y divide-default-border bg-card">
                <h2 className="text-default-fg font-semibold text-base lg:text-lg px-4 py-4">
                    Filtrar pedidos de emergência
                </h2>
                <form onSubmit={handleSearch} className="flex flex-wrap gap-4 px-4 py-4">
                    <div className="flex flex-col w-full max-w-48">
                        <Label htmlFor="status" className="mb-1">Status</Label>
                        <Select 
                            id="status"
                            options={statusOptionsForTab}
                            disabled={activeTab === "PENDING" || activeTab === "CONFIRMED"}
                            value={filters.status.join(",")}
                            onChange={(val) => setFilters({...filters, status: val.split(",")})}
                        />
                    </div>
                    <div className="flex flex-col w-full max-w-64">
                        <Label htmlFor="userId" className="mb-1">ID do usuário</Label>
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
                    <div className="flex justify-center items-end gap-4">
                        <Button 
                            type="submit" 
                            variant="primary"
                            className="mb-1 w-full!"
                        >
                            <span className="flex gap-2 items-center">
                                <FunnelIcon /> Filtrar
                            </span>
                        </Button>
                        <Button 
                            type="button" 
                            variant="outline" 
                            onClick={() => {
                                const defaultStatuses = activeTab === "PENDING" ? ["PENDING"] 
                                                      : activeTab === "CONFIRMED" ? ["CONFIRMED"] 
                                                      : ["COMPLETED", "CANCELLED", "NO_SHOW"];
                                const cleared = { userId: "", petId: "", status: defaultStatuses, page: 1 };
                                setFilters(cleared);
                                fetchAppointments(cleared);
                            }}
                            className="mb-1 w-full!"
                        >
                            Limpar
                        </Button>
                    </div>
                </form>
            </section>

            <div className="flex flex-col w-full border border-default-border rounded-xl bg-card divide-y divide-default-border">
                <div className="flex w-full gap-4 px-6 py-4 text-xs sm:text-sm font-medium text-muted-fg">
                    <div className="w-2/14">AÇÃO</div>
                    <div className="w-2/14">Nº DO PEDIDO</div>
                    <div className="w-2/14">DATA E PERÍODO</div>
                    <div className="w-3/14">PET / ESPÉCIE</div>
                    <div className="w-2/14">STATUS</div>
                    <div className="w-3/14">CRIADO POR</div>
                </div>
                
                <div className="flex flex-col divide-y divide-default-border max-h-108 overflow-y-auto">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-16 py-8">
                            <SpinnerIcon />
                        </div>
                    ) : appointments.length === 0 ? (
                        <div className="text-center py-8 text-muted-fg text-xs sm:text-sm">
                            Nenhuma emergência encontrada.
                        </div>
                    ) : (
                        appointments.map((app) => {
                            const statusInfo = emergencyStatusMap[app.status];
                            const displayDate = app.scheduleDate ? new Date(app.scheduleDate).toLocaleDateString("pt-BR") : "Sem data";
                            const displayTime = app.scheduleDate ? new Date(app.scheduleDate).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) : "";
                            const period = app.period ? translateTable(app.period) : "";
                            const isExpired = !!app.scheduleDate && ["CONFIRMED", "PENDING"].includes(app.status) && new Date(app.scheduleDate).getTime() + 1000 * 60 * 60 * 24 < Date.now();

                            return (
                            <div key={app.id} className="flex w-full gap-4 px-6 py-4 items-center text-sm">
                                <div className="w-2/14">
                                    <ButtonLink 
                                        size="sm" 
                                        variant="outline" 
                                        href={`/admin/dashboard/emergencies/${app.id}`}
                                        className="w-fit!"
                                    >
                                        Atualizar
                                    </ButtonLink>
                                </div>  
                                <div className="flex items-center justify-between gap-1 w-2/14">
                                    {formatRequestNumber("EMERGENCY", app.requestNumber)}
                                    {isExpired &&
                                        <InfoPopUp
                                            sign="alert"
                                            className="shrink-0"
                                        >
                                            Esse agendamento já passou da data marcada e será automaticamente definido como cancelado em breve.
                                        </InfoPopUp>
                                    }
                                </div>
                                <div className="flex flex-col w-2/14">
                                    <p className="text-default-fg font-medium">{displayDate}</p>
                                    {app.period && (
                                        <p className="text-muted-fg text-xs">{displayTime} - {period}</p>
                                    )}
                                </div>
                                <div className="flex flex-col w-3/14">
                                    <span className="text-default-fg font-medium truncate">{app.pet ? `${app.pet.name} (Pet)` : `${app.name} (Animal de rua)`}</span>
                                    <span className="text-xs text-muted-fg">{translateTable(app.species)}</span>
                                </div>
                                <div className="w-2/14">
                                    <Badge className={` ${statusInfo.classes}`}>
                                        {statusInfo.label}
                                    </Badge>
                                </div>
                                <div className="w-3/14 text-xs text-muted-fg truncate" title={app.user?.email}>
                                    <span className="text-default-fg">{app.user.name} {app.user.lastName}</span>
                                    <div>{app.userId}</div>
                                </div>
                            </div>);
                        })
                    )}
                </div>
                
                {!isLoading && appointments.length > 0 && (
                    <div className="flex justify-between items-center px-6 py-4">
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

            <Dialog 
                isOpen={isUserModalOpen} 
                onClose={() => setIsUserModalOpen(false)} 
                title="Buscar Usuário" 
                size="lg" 
                className="max-w-232!"
            >
                <SearchUserIdForm />
            </Dialog>

            <Dialog 
                isOpen={isPetModalOpen} 
                onClose={() => setIsPetModalOpen(false)} 
                title="Buscar Pet" 
                size="lg" 
                className="max-w-232!"
            >
                <SearchPetIdForm />
            </Dialog>
        </div>
    );
}