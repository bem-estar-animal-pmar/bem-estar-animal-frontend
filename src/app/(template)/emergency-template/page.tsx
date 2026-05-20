"use client"

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { formatRequestNumber } from "@/src/lib/request-formatter";

import { ApiError } from "@/src/lib/api-error";
import { translateError, translateTable } from "@/src/lib/translation-map";
import { toast } from "@/src/lib/toast-store";

import Image from "next/image";
import logo_prefs from "@/public/angra-logo.webp";
import logo_bemestar from "@/public/animal-logo.svg";
import logo_imar from "@/public/imaar-logo.webp";

import type { AdminEmergencyAppointmentById } from "@/src/constants/interfaces";

import { Loading } from "@/src/components/layout/Loading";
import { Button } from "@/src/components/ui";
import { PrintIcon } from "@/src/components/icons/outline";

export default function EmergencyTemplatePage() {
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
                    toast.danger(translateError(err.code), { 
                        message: translateError(err.details?.[0]?.message || err.message)
                    });
                    return;
                }
                toast.danger("Erro desconhecido", {
                    message: "Não foi possível carregar dados para impressão."
                });
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, [appointmentId]);

    if (isLoading) {
        return <Loading />;
    }

    const user = appointment?.user;
    const pet = appointment?.pet;

    const userFullName = user ? `${user.name} ${user.lastName}` : null;
    const userPhone = user?.phone || null;
    const userAddress = user ? `${user.street}, ${user.number}` : null;
    const userNeighborhood = user?.neighborhood || null;
    
    const description = appointment?.description || null;
    
    const petName = pet?.name || appointment?.name || null;
    const petChip = pet?.chip || null;
    
    const species = pet?.species || appointment?.species;
    const isCanine = species === "DOG";
    const isFeline = species === "CAT";
    
    const gender = pet?.gender || appointment?.gender;
    const isMale = gender === "MALE";
    const isFemale = gender === "FEMALE";
    
    const breed = pet?.breed ? translateTable(pet.breed) : null;
    const isNeutered = pet?.isNeutered;

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
                        Termo de Responsabilidade - Atendimento Emergencial e Lar Temporário
                    </h1>

                    <div className="border border-black p-2 flex flex-col gap-1">
                        <h2 className="font-bold uppercase text-[10px]">Dados do Lar Temporário</h2>
                        <div className="flex gap-2">
                            <p className="w-full">Nome do Lar Temporário: <strong>{userFullName || "________________________________________________________________________________________"}</strong></p>
                        </div>
                        <div className="flex gap-2">
                            <p className="w-5/12">Identidade: <strong>_________________________________________________</strong></p>
                            <p className="w-4/12">CPF: <strong>_____________________________________________</strong></p>
                            <p className="w-3/12">Celular: <strong>{userPhone || "__________________________"}</strong></p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <p className="w-2/3">Endereço residencial: <strong>{userAddress || "_______________________________________________________________________________"}</strong></p>
                            <p className="w-1/3">Bairro: <strong>{userNeighborhood || "________________________________________"}</strong></p>
                        </div>
                    </div>

                    <div className="border border-black p-2 flex flex-col gap-1 mt-1">
                        <h2 className="font-bold uppercase text-[10px]">Dados do Animal e Queixa Principal</h2>
                        <div className="flex gap-2">
                            <p className="w-full">Queixa Principal: <strong>{description || "_______________________________________________________________________________________________________________________________________"}</strong></p>
                        </div>
                        <div className="flex gap-2">
                            <p className="w-6/12">Nome do animal: <strong>{petName || "_________________________________________________________"}</strong></p>
                            <p className="w-3/12">CHIP: <strong>{petChip || "_______________________________"}</strong></p>
                            <p className="w-3/12">Castrado: <strong>[{isNeutered === true ? "X" : " "}] Sim [{isNeutered === false ? "X" : " "}] Não</strong></p>
                        </div>
                        <div className="flex gap-2">
                            <p className="w-3/12">Espécie: <strong>[{isCanine ? "X" : " "}] Canina [{isFeline ? "X" : " "}] Felina</strong></p>
                            <p className="w-3/12">Sexo: <strong>[{isMale ? "X" : " "}] Macho [{isFemale ? "X" : " "}] Fêmea</strong></p>
                            <p className="w-2/12">Idade: <strong>_________________</strong></p>
                            <p className="w-4/12">Raça: <strong>{breed || "_________________________________________"}</strong></p>
                        </div>
                        <div className="flex gap-2">
                            <p className="w-2/3">Endereço que o animal foi encontrado: <strong>____________________________________________________________</strong></p>
                            <p className="w-1/3">Pelagem: <strong>______________________________________</strong></p>
                        </div>
                    </div>

                    <div className="border border-black p-2 text-[10px] mt-1 flex flex-col gap-0.5 text-justify">
                        <h3 className="font-bold text-[13px] mb-1">DECLARAÇÕES DE RESPONSABILIDADE</h3>
                        <p>1. Declaro que o animal é de rua e que estou apto a dar Lar Temporário, assumindo a guarda e a responsabilidade sobre o animal acima descrito, comprometendo-me a proporcionar boas condições de alojamento e alimentação, assim como, preservar a saúde e integridade do animal; <strong>ME RESPONSABILIZANDO</strong> e garantindo que todas as informações fornecidas são verdadeiras, tendo ciência das sanções caso haja prova do contrário.</p>
                        <p>2. Declaro ainda estar ciente de todos os cuidados que este animal exige no que se refere à sua recuperação, além de conhecer todos os riscos inerentes à espécie e raça no convívio com humanos;</p>
                        <p>3. Comprometo-me a entrar em contato com o IMAAR caso haja qualquer problema com o animal no pós-cirúrgico, não transmitir a posse deste animal a outrem sem o conhecimento deste IMAAR;</p>
                        <p>4. Comprometo-me também, a permitir o acesso dos funcionários do IMAAR ao local onde se encontra o animal para averiguação de suas condições;</p>
                        <p>5. Tenho conhecimento de que caso seja constatado situação inadequada para o bem-estar do animal, perderei a sua guarda, sem prejuízo das penalidades legais;</p>
                        <p>6. Comprometo-me a cumprir toda a legislação vigente, municipal, estadual e federal, relativa à guarda de animais.</p>
                        <p>7. Comprometo-me a realizar todo o tratamento como orientado, assim como administração dos medicamentos e/ou curativos;</p>
                        <p>8. Comprometo-me a avisar imediatamente sobre o término do tratamento para que seja realizada a castração. Após o término do tratamento orientado referente a solicitação deste atendimento, o animal deverá ser disponibilizado para adoção, ou retorno para comunidade onde foi recolhido. Caso permaneça sobre a guarda do LT passa a ser caracterizado animal de tutor, conforme Resolução IMAAR 009/2023. E será necessário a assinatura do Termo de Guarda Responsável.</p>
                        <p>9. Em caso de óbito, a responsabilidade do destino do corpo do animal é do lar temporário.</p>
                    </div>

                    <div className="border border-black p-2 mt-1 flex h-12 items-center bg-gray-100">
                        <div className="flex gap-2 items-center">
                            <div className="w-4 h-4 border border-black flex items-center justify-center font-bold"></div>
                            <p className="font-bold">DECLARO QUE O ANIMAL ACIMA CITADO É UM ANIMAL DE RUA</p>
                        </div>
                    </div>

                    <div className="w-full text-center mt-6">
                        <p>Angra dos Reis, ____  de  _______________  de  ______ </p>
                    </div>

                    <div className="flex justify-between mt-6 px-8 mb-4">
                        <div className="text-center w-1/3">
                            <div className="border-t border-black mb-1"></div>
                            <p>AUTORIZAÇÃO DO SERVIDOR</p>
                            <p className="text-[9px] italic mt-0.5">Funcionário do IMAAR - Matrícula</p>
                        </div>
                        <div className="text-center w-1/3">
                            <div className="border-t border-black mb-1"></div>
                            <p>RESPONSÁVEL PELO LAR TEMPORÁRIO</p>
                        </div>
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