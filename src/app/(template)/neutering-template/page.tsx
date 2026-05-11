"use client"

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { differenceInMonths, format } from "date-fns";
import { formatRequestNumber } from "@/src/lib/request-formatter";

import { ApiError } from "@/src/lib/api-error";
import { translateError } from "@/src/lib/error-map";
import { translateTable } from "@/src/lib/table-map";
import { toast } from "@/src/lib/toast-store";

import Image from "next/image";
import logo_prefs from "@/public/angra-logo.webp";
import logo_bemestar from "@/public/animal-logo.svg";
import logo_imar from "@/public/imaar-logo.webp";

import type { PetById, AdminNeuteringAppointmentById } from "@/src/constants/interfaces";

import { Loading } from "@/src/components/layout/Loading";
import { Button } from "@/src/components/ui";
import { PrintIcon } from "@/src/components/icons/outline";
    
export default function NeuteringTemplatePage() {
    const searchParams = useSearchParams();
    const appointmentId = searchParams.get("id");

    const [pet, setPet] = useState<PetById | null>(null);
    const [appointment, setAppointment] = useState<AdminNeuteringAppointmentById | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const petAge = pet?.birthDate ? differenceInMonths(new Date(), new Date(pet.birthDate)) : null;

    useEffect(() => {
        const loadData = async () => {
            if (!appointmentId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                const appRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/neuterings/details/${appointmentId}`, {
                    credentials: "include",
                });

                const appData = await appRes.json();
                if (!appRes.ok) {
                    throw new ApiError(appData.message, appData.code, appData.details);
                }
                
                setAppointment(appData);

                const currentPetId = appData.pet?.id || appData.petId; 

                if (currentPetId) {
                    const petRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/details/${currentPetId}`, {
                        credentials: "include",
                    });

                    const petData = await petRes.json();
                    if (!petRes.ok) {
                        throw new ApiError(petData.message, petData.code, petData.details);
                    }
                    setPet(petData);
                }

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

    const ownerFullName = pet?.owner?.name ? `${pet.owner.name} ${pet.owner.lastName}` : null;
    const isCanine = pet?.species === "DOG";
    const isFeline = pet?.species === "CAT";

    const initialDate = appointment?.scheduleDate 
    ? new Date(`${appointment.scheduleDate.split('T')[0]}T00:00:00`)
    : undefined;

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
                            {appointment?.requestNumber ? formatRequestNumber("NEUTERING", appointment?.requestNumber)  : "        "}
                        </div>
                    </div>
                    </div>
                </div>

                <h1 className="text-center font-bold text-sm bg-gray-200 py-1 uppercase border border-gray-400 mb-2">
                    Autorização para Procedimentos Anestésicos e Cirúrgicos
                </h1>

                <div className="border border-black p-2 flex flex-col gap-1">
                    <h2 className="font-bold uppercase text-[10px]">Dados do Responsável Pelo Animal</h2>
                    <div className="flex gap-2">
                    <p className="w-2/3">Nome do responsável: <strong>{ownerFullName || "______________________________________________________________________________"}</strong></p>
                    <p className="w-1/3">Tipo de responsável: {pet?.homeStatus ? pet?.homeStatus === "HAS_OWNER" ? "[X] Tutor [ ] Lar temporário" : "[ ] Tutor [X] Lar temporário" : "[ ] Tutor [ ] Lar temporário"}</p>
                    </div>
                    <div className="flex gap-2">
                    <p className="w-1/3">CPF: _____________________________________________</p>
                    <p className="w-1/3">Telefone: <strong>{pet?.owner?.phone || "________________________________________"}</strong></p>
                    <p className="w-1/3">E-mail: <strong>{pet?.owner?.email || "________________________________"}</strong></p>
                    </div>
                    <div className="flex gap-2 items-center">
                    <p className="w-7/12">Endereço: <strong>{pet?.owner?.street || "_______________________________________________________________"}</strong></p>
                    <p className="w-1/12">Nº: <strong>{pet?.owner?.number || "________"}</strong></p>
                    <p className="w-3/12">Bairro: <strong>{pet?.owner?.neighborhood || "______________________________"}</strong></p>
                    </div>
                </div>

                <div className="border border-black p-2 flex flex-col gap-1 mt-1">
                    <h2 className="font-bold uppercase text-[10px]">Autorizo a realização dos procedimentos anestésicos e cirúrgicos necessários ao</h2>
                    <div className="flex gap-2">
                    <p className="w-1/2">Nome do animal: <strong>{pet?.name || "_________________________________________________________"}</strong></p>
                    <p className="w-1/2">Espécie: <strong>[{isCanine ? "X" : " "}] Canino [{isFeline ? "X" : " "}] Felino</strong></p>
                    </div>
                    <div className="flex gap-2">
                    <p className="w-1/6">Peso: <strong>{pet?.weight != null ? `${pet.weight} kg` : "__________________"}</strong></p>
                    <p className="w-1/6">Sexo: <strong>{translateTable(pet?.gender || "__________________")}</strong></p>
                    <p className="w-1/3">Raça: <strong>{translateTable(pet?.breed || "___________________________________________")}</strong></p>
                    <p className="w-1/6">Idade: <strong>{petAge !== null ? petAge > 12 ? `${(petAge / 12).toFixed(1)} anos` : `${petAge} meses` : "________________"}</strong></p>
                    <p className="w-1/6">Cor: <strong>{pet?.coatColor || "___________________"}</strong></p>
                    </div>
                </div>

                <div className="border border-black p-2 flex justify-between items-center mt-1 bg-gray-100">
                    <div>
                    <h2 className="font-bold uppercase text-[10px]">Local da Cirurgia: SUBEA - Superintendência do Bem Estar Animal</h2>
                    <p className="text-[10px]">Endereço: Rua Juiz Orlando Caldelas, no 42 - Parque das Palmeiras</p>
                    </div>
                    <div className="">
                    <p className="font-bold">DATA DA CIRURGIA: <strong>{initialDate ? format(initialDate, "dd-MM-yyyy") : "____/____/____"}</strong></p>
                    <div className="flex gap-2">
                        <p className="font-bold">PERÍODO: <strong>{translateTable(appointment?.period || "____/____/____")}</strong> </p>
                        <p className="font-bold">HORÁRIO: ___:___ </p>
                    </div>
                    </div>
                </div>

                <div className="bg-red-800 text-white text-center font-bold p-1 my-2 border border-black">
                    <p>ATENÇÃO PARA O JEJUM ALIMENTAR DE 06 HORAS E HÍDRICO DE 04 HORAS.</p>
                    <p>OBS.: CASO O JEJUM ESTEJA FORA DESTE PERÍODO A CIRURGIA NÃO SERÁ REALIZADA NEM REMARCADA.</p>
                </div>

                <div className="border border-black p-2 text-[10px] mt-1 flex flex-col gap-0.5">
                    <p>1. Tolerância de 15 minutos além do horário marcado. APÓS ESSE PERÍODO NÃO SERÃO RECEBIDOS ANIMAIS PARA CIRURGIA.</p>
                    <p>2. Estou ciente de que todo ato cirúrgico envolve risco a vida do animal;</p>
                    <p>3. Assumo a responsabilidade sobre o animal acima descrito, comprometendo-me a proporcionar boas condições de alojamento e alimentação, assim como, preservar a saúde e integridade do animal;</p>
                    <p>4. Declaro ainda estar ciente de todos os cuidados que este animal exige no que se refere à sua recuperação, além de conhecer todos os riscos inerentes à espécie e raça no convívio com humanos;</p>
                    <p>5. Estou ciente que todos os animais castrados pela municipalidade são identificados através de microchip e não devo transmitir a posse deste animal a outrem sem o conhecimento do IMAAR;</p>
                    <p>6. Comprometo-me também, a permitir o acesso dos funcionários do IMAAR ao local onde se encontra o animal para averiguação de suas condições;</p>
                    <p>7. Tenho conhecimento de que caso seja constatado situação inadequada para o bem-estar do animal, perderei a sua guarda, sem prejuízo das penalidades legais;</p>
                    <p>8. Comprometo-me a cumprir toda a legislação vigente, municipal, estadual e federal, relativa à guarda de animais.</p>
                    <p>9. Para Castração de fêmeas é OBRIGATÓRIO levar roupa cirúrgica.</p>
                    <p>10. Todos os felinos devem estar em caixa de transporte compatível com seu tamanho, sem panos, jornal, lençol etc, forrada apenas com tapete higiênico. Apenas 01 (um) animal por caixa de transporte;</p>
                    <p>11. Caninos devem estar de coleira, guia ou em caixa de transporte compatível com tamanho, caninos bravos ou de grande porte devem estar de focinheira;</p>
                    <p>12. Animais braquicefálicos (focinho curto) devem, obrigatoriamente, apresentar os exames solicitados pela Superintendência de Bem-Estar Animal. Mesmo com a apresentação dos exames, o animal ainda está sujeito a avaliação médico veterinária.</p>

                    <p className="text-center font-bold mt-2">O ANIMAL DEVERÁ SER LEVADO PARA O PROCEDIMENTO, PELA PESSOA QUE REALIZOU O CADASTRO. DEVERÁ SER APRESENTADO ORIGINAL E XEROX DE RG, CPF E COMPROVANTE DE RESIDÊNCIA.</p>

                    <div className="w-full text-center mt-6">
                        <p>Angra dos Reis, ____  de  _______________  de  ______ </p>
                    </div>

                    <div className="flex justify-between items-end mt-6 px-8">
                    <div className="text-center w-1/3">
                        <div className="border-t border-black mb-1"></div>
                        <p>AUTORIZAÇÃO DO SERVIDOR</p>
                    </div>
                    <div className="text-center w-1/3">
                        <div className="border-t border-black mb-1"></div>
                        <p>TUTOR / RESPONSÁVEL</p>
                    </div>
                    </div>
                </div>

                <div className="border border-black p-2 mt-2 mb-1">
                    <h3 className="font-bold text-[13px] mb-1">CUIDADOS NO PRÉ-OPERATÓRIO</h3>
                    <ul className="list-disc pl-4 text-[11px] flex flex-col gap-0.5">
                        <li><strong>JEJUM</strong> - Alimentar o animal (adulto) <strong>06 horas</strong> antes do horário agendado. Após esse período retirar o comedouro. A alimentação não deverá ser excessiva, comer e beber o suficiente. Se o animal não estiver em jejum, poderá vomitar durante a anestesia e morrer sufocado; O jejum de água deve ser de <strong>04 horas</strong>.</li>
                        <li>O animal deve estar em bom estado de saúde, com a vacinação e vermifugação em dia (risco de desenvolver doenças pré existentes ou incubadas) Se constatado alguma alteração no estado de saúde do animal a cirurgia será cancelada;</li>
                        <li>A responsabilidade do transporte do animal é do tutor, não levar no colo; Caninos devem estar de coleira, guia ou em caixa de transporte compatível com tamanho, caninos bravos ou de grande porte devem estar de focinheira. Atenção: o animal não poderá voltar andando; felinos devem estar em caixa de transporte compatível com seu tamanho, sem panos, jornal, lençol etc, forrada apenas com tapete higiênico, apenas 01 (um) animal por caixa de transporte, não receberemos felinos fora da caixa de transporte;</li>
                        <li>Ser levado até o local por um adulto: se mais de um animal, ter acompanhante;</li>
                        <li>O animal não pode estar vacinado no período de 21 dias.</li>
                        <li>hemograma é obrigatório para canino fêmea abaixo de 3 kgs e acima de 15 kgs, sendo opcional para caninos macho e felinos macho/fêmea.</li>
                    </ul>
                </div>
                <div className="border border-black p-2 mt-12">
                    <h3 className="font-bold text-[13px] mt-2 mb-1">CUIDADOS NO PÓS-OPERATÓRIO</h3>
                    <ul className="list-disc pl-4 text-[11px] flex flex-col gap-0.5">
                        <li>Ao receber seu animal ele poderá estar sob o efeito do anestésico.</li>
                        <li>Alguns animais demoram mais para acordar, por apresentar características próprias fisiológicas e de comportamento, portanto sua recuperação poderá ser diferenciada;</li>
                        <li>Nas primeiras 24 horas o animal deverá descansar em local tranquilo, limpo e com pouca iluminação, para permitir uma boa recuperação;</li>
                        <li>Aquecer o animal com panos ou cobertores, pois ele sentirá frio;</li>
                        <li>A primeira alimentação e água somente poderá ser oferecida após o animal estar acordado;</li>
                        <li>O animal deverá usar o colar elizabetano ou "roupinha cirúrgica" desde o momento que acordar da anestesia até a orientação fornecida no pós operatório;</li>
                    </ul>

                    <p className="font-bold mt-2 text-[10px]">É de inteira responsabilidade do tutor seguir todas as orientações fornecidas assim como as medicações. Caso o animal acesse os pontos o tutor deverá levar a uma clínica particular de sua escolha para correção.</p>
                    <p className="font-bold text-center mt-2 text-[10px]">Parabéns pela iniciativa! Tire o dia para ficar com seu animal, ele merece sua atenção e carinho.</p>
                </div>

                <div className="border border-black p-2 mt-1 flex justify-between h-12 items-start">
                    <div className="flex gap-2 items-center">
                    <div className="w-4 h-4 border border-black"></div>
                    <p className="font-bold">ANIMAL REALIZOU EXAMES DE RISCO CIRÚRGICO</p>
                    </div>
                    <div className="flex gap-2 items-center">
                    <div className="w-4 h-4 border border-black"></div>
                    <p className="font-bold">ANIMAL NÃO REALIZOU EXAMES DE RISCO CIRÚRGICO</p>
                    </div>
                </div>
                
                <div className="flex justify-between px-16 mt-6">
                    <div className="w-1/2 text-center border-t border-black text-[10px]">
                    PROCEDIMENTOS A SEREM REALIZADOS PELO(A) MÉDICO(A) VETERINÁRIO(A):
                    </div>
                    <div className="w-1/4 text-center border-t border-black text-[10px]">
                    CRMV-RJ Nº
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