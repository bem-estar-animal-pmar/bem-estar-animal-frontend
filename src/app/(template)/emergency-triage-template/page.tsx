"use client"

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { formatRequestNumber } from "@/src/lib/request-formatter";

import { ApiError } from "@/src/lib/api-error";
import { translateError } from "@/src/lib/error-map";
import { toast } from "@/src/lib/toast-store";

import Image from "next/image";
import logo_prefs from "@/public/angra-logo.webp";
import logo_bemestar from "@/public/animal-logo.svg";
import logo_imar from "@/public/imaar-logo.webp";

import type { AdminEmergencyAppointmentById, TriageAnswer } from "@/src/constants/interfaces";

import { Loading } from "@/src/components/layout/Loading";
import { Button } from "@/src/components/ui";
import { PrintIcon } from "@/src/components/icons/outline";

export default function TriageTemplatePage() {
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get("id");

    const [appointment, setAppointment] = useState<AdminEmergencyAppointmentById | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!appointmentId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const appRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/emergencies/details/${appointmentId}`, {
                    credentials: "include",
                });

                const appData = await appRes.json();
                if (!appRes.ok) {
                    throw new ApiError(appData.message, appData.code, appData.details);
                }
                
                setAppointment(appData);

            } catch (err: unknown) {
                if (err instanceof ApiError) {
                    if (err.details) {
                        const firstError = err.details[0]?.message || "";
                        toast.danger(translateError(err.message), { message: firstError });
                        return;
                    }
                    toast.danger(translateError(err.message));
                    return;
                }
                toast.danger("Erro desconhecido ao carregar os dados para impressão.");
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [appointmentId]);

    if (isLoading) {
        return <Loading />;
    }

    // Identificação do Responsável / Lar Temporário
    const user = appointment?.user;
    const pet = appointment?.pet;
    const isTutor = !!pet;

    const userFullName = user ? `${user.name} ${user.lastName}` : null;
    const userPhone = user?.phone || null;
    
    // Identificação do Animal
    const species = pet?.species || appointment?.species;
    const isCanine = species === "DOG";
    const isFeline = species === "CAT";
    
    const gender = pet?.gender || appointment?.gender;
    const isMale = gender === "MALE";
    const isFemale = gender === "FEMALE";

    const description = appointment?.description || null;
    
    // Dados de Triagem
    const t = appointment?.triageData;

    // Helper para formatar data (usado apenas no agendamento final agora)
    const formatDate = (dateString?: string) => {
        if (!dateString) return "___/___/______";
        return new Date(dateString).toLocaleDateString('pt-BR');
    };

    // Helper para renderizar os checkmarks
    const renderCb = (value?: TriageAnswer, targetValue?: TriageAnswer) => {
        return value === targetValue ? "[X]" : "[ ]";
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 relative">
            <Button 
                variant="primary"
                onClick={() => window.print()} 
                className="no-print fixed bottom-8 right-8 font-bold flex items-center z-50"
                size="xl"
                pill="true"
            >   
                <span className="flex gap-2 items-center">
                   <PrintIcon/> Imprimir documento
                </span>
            </Button>

            <main className="flex min-h-screen w-full">
                <div id="template-page" className="w-[210mm] min-h-[297mm] bg-white text-black p-8 mx-auto font-sans text-[11px] leading-tight flex flex-col gap-2 shadow-md">
                    
                    <div className="flex justify-between items-center border-b border-black pb-2 mb-2">
                        <div className="flex items-center gap-4">
                            <div className="w-16 bg-gray-200 flex items-center justify-center">
                                <Image alt="logo prefeitura" src={logo_prefs} />
                            </div>
                            <div>
                                <p>Estado do Rio de Janeiro</p>
                                <p className="font-bold">PREFEITURA MUNICIPAL DE ANGRA DOS REIS</p>
                                <p>Instituto de Meio Ambiente de Angra dos Reis</p>
                                <p>Superintendência de Bem-Estar Animal</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-23 flex items-center justify-center pt-1">
                                <Image src={logo_imar} alt="logo imaar" />
                            </div>
                            <div className="w-18 flex items-center justify-center">
                                <Image src={logo_bemestar} alt="logo bemstar" />
                            </div>
                            <div className="text-right ml-2">
                                <p className="font-bold">Nº DO PEDIDO:</p>
                                <div className="w-24 h-6 border-b border-black mt-1 text-right font-bold">
                                    {appointment?.requestNumber ? formatRequestNumber("EMERGENCY", appointment?.requestNumber)  : "        "}
                                </div>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-center font-bold text-sm bg-gray-200 py-1 uppercase border border-gray-400 mb-2">
                        Ficha de Triagem para Atendimento Emergencial
                    </h1>

                    <div className="border border-black p-2 flex flex-col gap-1.5">
                        <div className="flex gap-2">
                            <p className="w-1/3">Data: <strong>___/___/______</strong></p>
                            <p className="w-2/3">Hora do contato: <strong>_________________</strong></p>
                        </div>
                        <div className="flex gap-2">
                            <p className="w-full">Local de encontro do animal: <strong>________________________________________________________________________________________________</strong></p>
                        </div>
                        <div className="flex gap-2">
                            <p className="w-full">Data que foi encontrado: <strong>___/___/______</strong></p>
                        </div>
                        
                        <div className="flex gap-2 items-center mt-1">
                            <p className="w-1/3">Espécie: <strong>{isCanine ? "[X]" : "[ ]"} Canino {isFeline ? "[X]" : "[ ]"} Felino</strong></p>
                            <p className="w-2/3">Sexo: <strong>{isMale ? "[X]" : "[ ]"} Macho {isFemale ? "[X]" : "[ ]"} Fêmea</strong></p>
                        </div>

                        <div className="flex gap-2 items-center mt-1">
                            <p className="font-bold mr-2">
                                {isTutor ? "[X]" : "[ ]"} TUTOR {isTutor ? "[ ]" : "[X]"} LAR TEMPORÁRIO
                            </p>
                        </div>

                        <div className="flex gap-2">
                            <p className="w-2/3">{isTutor ? "Responsável" : "Nome do lar temporário"}: <strong>{userFullName || "______________________________________________________________________"}</strong></p>
                            <p className="w-1/3">Telefone: <strong>{userPhone || "_________________________________"}</strong></p>
                        </div>
                        
                        <div className="flex gap-2 mt-1">
                            <p className="w-full">Fato Acontecido: <strong>{description || "______________________________________________________________________________________________________________"}</strong></p>
                        </div>
                    </div>

                    <div className="border border-black p-2 flex flex-col gap-2 mt-1">
                        <h2 className="font-bold uppercase text-[11px] mb-1">Questionário de Triagem</h2>
                        
                        <div className="grid grid-cols-2 gap-y-2 gap-x-4">
                            <p>1. Animal é castrado? <strong>{renderCb(t?.isNeutered, "YES")} Sim {renderCb(t?.isNeutered, "NO")} Não</strong></p>
                            <p>2. Animal está consciente? <strong>{renderCb(t?.isConscious, "YES")} Sim {renderCb(t?.isConscious, "NO")} Não</strong></p>
                            <p>3. Animal está com a cabeça levantada? <strong>{renderCb(t?.isHeadRaised, "YES")} Sim {renderCb(t?.isHeadRaised, "NO")} Não</strong></p>

                            <p className="col-span-2">4. Animal está sangrando? <strong>{renderCb(t?.isBleeding, "YES")} Sim {renderCb(t?.isBleeding, "NO")} Não</strong></p>
                            
                            <p className="col-span-2">5. Aonde é o sangramento? <strong>{t?.bleedingLocation || "_________________________________________________________________________________"}</strong></p>
                            
                            <p>6. Animal está em pé? <strong>{renderCb(t?.isStanding, "YES")} Sim {renderCb(t?.isStanding, "NO")} Não</strong></p>
                            <p>7. Já ficou em pé em algum momento? <strong>{renderCb(t?.hasStoodUp, "YES")} Sim {renderCb(t?.hasStoodUp, "NO")} Não</strong></p>
                            <p>8. Apoia todas as patas? <strong>{renderCb(t?.supportsAllPaws, "YES")} Sim {renderCb(t?.supportsAllPaws, "NO")} Não</strong></p>
                            
                            <p className="col-span-2">9. Qual pata não apoia? <strong>{t?.unsupportedPaw || "______________________________________________________________________________________"}</strong></p>
                            
                            <p>10. Animal já andou? <strong>{renderCb(t?.hasWalked, "YES")} Sim {renderCb(t?.hasWalked, "NO")} Não</strong></p>
                            
                            <p className="col-span-2">11. Tem algum osso exposto? <strong>{renderCb(t?.hasExposedBone, "YES")} Sim {renderCb(t?.hasExposedBone, "NO")} Não</strong></p>
                            <p className="col-span-2">12. Qual osso? <strong>{t?.exposedBone || "________________________________________________________________________________________________"}</strong></p>

                            <p className="col-span-2">13. Está com dificuldade de respirar? <strong>{renderCb(t?.breathingDifficulty, "YES")} Sim {renderCb(t?.breathingDifficulty, "NO")} Não</strong></p>
                            
                            <div className="col-span-2 grid grid-cols-2 gap-x-4">
                                <p>14. Já comeu? <strong>{renderCb(t?.hasEaten, "YES")} Sim {renderCb(t?.hasEaten, "NO")} Não</strong></p>
                                <p>15. Bebeu água? <strong>{renderCb(t?.hasDrunk, "YES")} Sim {renderCb(t?.hasDrunk, "NO")} Não</strong></p>
                            </div>
                            
                            <div className="col-span-2 grid grid-cols-2 gap-x-4">
                                <p>16. Teve vômito? <strong>{renderCb(t?.hasVomited, "YES")} Sim {renderCb(t?.hasVomited, "NO")} Não</strong></p>
                                <p>17. Diarreia? <strong>{renderCb(t?.hasDiarrhea, "YES")} Sim {renderCb(t?.hasDiarrhea, "NO")} Não</strong></p>
                            </div>

                            <p className="col-span-2">18. Quantos dias de sintomas? <strong>{t?.symptomsDuration || "________________________________________________________________________________"}</strong></p>
                            <p className="col-span-2">19. Algum outro sintoma? <strong>{t?.otherSymptoms || "_____________________________________________________________________________________"}</strong></p>
                        </div>
                    </div>

                    <div className="border border-black p-2 mt-auto mb-4 bg-gray-50 flex justify-between items-center">
                        <p>Atendimento agendado para data: <strong>{formatDate(appointment?.scheduleDate)}</strong></p>
                        <p>Hora / Período: <strong>{appointment?.period === "MORNING" ? "Manhã" : appointment?.period === "AFTERNOON" ? "Tarde" : "_________________"}</strong></p>
                    </div>

                    <style dangerouslySetInnerHTML={{__html: `
                        @media print {
                            body { 
                                -webkit-print-color-adjust: exact; 
                                print-color-adjust: exact; 
                                background-color: white !important;
                            }
                            @page { size: A4; margin: 0; }
                            .no-print { display: none !important; }
                            #template-page { box-shadow: none !important; }
                        }
                    `}} />
                </div>
            </main>
        </div>
    );
}