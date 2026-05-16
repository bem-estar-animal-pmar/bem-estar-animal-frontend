"use client"

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { formatRequestNumber } from "@/src/lib/request-formatter";

import { ApiError } from "@/src/lib/api-error";
import { translateError } from "@/src/lib/error-map";
import { translateTable } from "@/src/lib/table-map";
import { toast } from "@/src/lib/toast-store";

import Image from "next/image";
import logo_prefs from "@/public/angra-logo.webp";
import logo_bemestar from "@/public/animal-logo.svg";
import logo_imar from "@/public/imaar-logo.webp";

import type { AdoptionRequestById } from "@/src/constants/interfaces";

import { Loading } from "@/src/components/layout/Loading";
import { Button } from "@/src/components/ui";
import { PrintIcon } from "@/src/components/icons/outline";

export default function AdoptionTemplatePage() {
    const searchParams = useSearchParams();
    const requestId = searchParams.get("id");

    const [request, setRequest] = useState<AdoptionRequestById | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!requestId) {
                setIsLoading(false);
                return;
            }

            try {
                setIsLoading(true);
                // Ajuste a rota conforme seu backend
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/adoptions/request/details/${requestId}`, {
                    credentials: "include",
                });

                const data = await res.json();
                if (!res.ok) {
                    throw new ApiError(data.message, data.code, data.details);
                }
                
                setRequest(data);

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
    }, [requestId]);

    if (isLoading) {
        return <Loading />;
    }

    const pet = request?.pet;

    const petName = pet?.name || "_________________________________________________________";
    const species = pet?.species;
    const isCanine = species === "DOG";
    const isFeline = species === "CAT";
    
    const gender = pet?.gender;
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
                                    {request?.requestNumber ? formatRequestNumber("ADOPTION", request?.requestNumber)  : "        "}
                                </div>
                            </div>
                        </div>
                    </div>

                    <h1 className="text-center font-bold text-sm bg-gray-200 py-1 uppercase border border-gray-400 mb-2">
                        Termo de Guarda Responsável
                    </h1>

                    <div className="border border-black p-2 flex flex-col gap-1">
                        <h2 className="font-bold uppercase text-[10px]">Dados do Adotante</h2>
                        <div className="flex gap-2">
                            <p className="w-full">Nome: <strong>{request?.adopterName || "_________________________________________________________________________________"}</strong></p>
                        </div>
                        <div className="flex gap-2">
                            <p className="w-1/2">Estado Civil: <strong>______________________________________</strong></p>
                            <p className="w-1/2">Profissão: <strong>____________________________________</strong></p>
                        </div>
                        <div className="flex gap-2">
                            <p className="w-4/12">CPF: <strong>______________________________________________</strong></p>
                            <p className="w-3/12">Celular: <strong>{request?.adopterPhone || "__________________________"}</strong></p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <p className="w-2/3">Endereço: <strong>{request ? `${request.adopterStreet}, ${request.adopterNumber}` : "___________________________________________________________________________________________"}</strong></p>
                            <p className="w-1/3">Bairro: <strong>{request?.adopterNeighborhood || "________________________________________"}</strong></p>
                        </div>
                        <div className="flex gap-2 items-center">
                            <p className="w-1/3">Cidade: <strong>{request?.adopterCity || "Angra dos Reis"}</strong></p>
                            <p className="w-1/3">CEP: <strong>{request?.adopterCep || "____________________________________________"}</strong></p>
                            <p className="w-1/3">E-mail: <strong>{request?.adopterEmail || "_______________________________________"}</strong></p>
                        </div>
                    </div>

                    <div className="border border-black p-2 flex flex-col gap-1 mt-1">
                        <h2 className="font-bold uppercase text-[10px]">Dados do Animal</h2>
                        <div className="flex gap-2">
                            <p className="w-3/12">Espécie: <strong>[{isCanine ? "X" : " "}] Canina [{isFeline ? "X" : " "}] Felina</strong></p>
                            <p className="w-3/12">Sexo: <strong>[{isMale ? "X" : " "}] Macho [{isFemale ? "X" : " "}] Fêmea</strong></p>
                            <p className="w-3/12">Idade: <strong>_________________</strong></p>
                            <p className="w-3/12">Cor: <strong>______________________________</strong></p>
                        </div>
                        <div className="flex gap-2">
                            <p className="w-6/12">Nome do animal: <strong>{petName}</strong></p>
                            <p className="w-6/12">Raça: <strong>{breed || "_________________________________________"}</strong></p>
                        </div>
                        <div className="flex gap-2">
                            <p className="w-5/12">Nº de CHIP: <strong>{pet?.chip || "___________________________________________________"}</strong></p>
                            <p className="w-7/12">Castrado: <strong>[{isNeutered === true ? "X" : " "}] Sim [{isNeutered === false ? "X" : " "}] Não</strong>. Data: <strong>____/____/____</strong> Horário: <strong>_______</strong></p>
                        </div>
                    </div>

                    <div className="border border-black p-2 text-[10px] mt-1 flex flex-col gap-0.5 text-justify">
                        <h3 className="font-bold text-[11px] mb-1 uppercase">Comprometo-me a:</h3>
                        <p>1. Proporcionar ao animal deste termo, respeitando suas características e zelando pelas suas necessidades psicológicas e físicas;</p>
                        <p>2. Garantir sua saúde fornecendo alimento adequado, abrigo seguro, higiene, vacinas e levando-o regularmente ao veterinário;</p>
                        <p>3. Garantir sua saúde psicológica respeitando suas características e fornecendo atenção, carinho, e a possibilidade de interagir com outros animais ou pessoas;</p>
                        <p>4. Garantir sua segurança, mantendo-o sempre dentro de casa e passeando com coleira e guia (no caso de cães);</p>
                        <p>5. Jamais abandonar o animal em vias públicas ou em casas fechadas, nem em hipótese alguma maltratá-lo;</p>
                        <p>6. Não utilizar o animal para fins de guarda comercial, lutas ou experimentação;</p>
                        <p>7. Identificá-lo com coleira e plaqueta ou microchip, tornando mais fácil recuperá-lo caso ele se perca;</p>
                        <p>8. Impedir que o animal procrie, submetendo-o à cirurgia de esterilização (castração);</p>
                        <p>9. Comunicar imediatamente através da Superintendência de Bem-Estar Animal, no telefone (24) 3377-4527, ou e-mail bemestaranimal.imar@angra.rj.gov.br, qualquer outro destino que venha a ter o animal, tais como mudança de tutor, mudança de endereço, desaparecimento ou morte;</p>
                        <p>10. Permitir a visita regular do veterinário da Superintendência de Bem-Estar Animal.</p>
                    </div>

                    <div className="border border-black p-2 text-[10px] mt-1 flex flex-col gap-2 text-justify">
                        <p className="font-bold">Estou ciente de que:</p>
                        <ul className="list-disc ml-4 flex flex-col gap-1">
                            <li>Um cão ou gato pode viver até 15 anos ou mais, e durante todo este tempo serei responsável pelo seu bem-estar, principalmente durante sua velhice;</li>
                            <li>O descumprimento dos itens acima poderá ser interpretado como maus-tratos, o que acarretará a retirada do animal e sanções legais. Além de abertura de Registro de Ocorrência por maus-tratos;</li>
                            <li>Maus-tratos é crime e estará sujeito às penalidades previstas na Lei Federal de Proteção aos Animais nº 9.605 art. 32 de 12 de fevereiro de 1998;</li>
                            <li>Os animais adotados são monitorados pela Superintendência. Obrigatoriamente deverão ser castrados;</li>
                        </ul>
                        <p className=" border-t border-gray-300 py-2">
                            <strong>ATENÇÃO:</strong> Em caso de desistência da adoção, o animal NUNCA PODERÁ ser devolvido, devendo o tutor continuar garantindo sua segurança e bem-estar, assim como passar a guarda para outra pessoa até que a Superintendência de Bem-Estar Animal valide um novo tutor.
                        </p>
                    </div>

                    <div className="w-full text-center mt-4">
                        <p>Angra dos Reis, _____ de ____________________ de _____. </p>
                    </div>

                    <div className="flex flex-col gap-6 mt-8 px-20">
                        <div className="text-center w-full">
                            <div className="border-t border-black mb-1 w-full mx-auto"></div>
                            <p className=" uppercase text-[10px]">(Assinatura)</p>
                        </div>
                        <div className="text-center w-full">
                            <div className="border-t border-black mb-1 w-full mx-auto"></div>
                            <p className=" uppercase text-[10px]">(Nome e assinatura)</p>
                            <p className="text-[9px] italic mt-0.5">Responsável pelo Termo</p>
                        </div>
                    </div>

                    <div className="mt-18 text-center text-[8px] text-gray-500 border-t pt-2">
                        Rua Juvêncio de Resende, 42 - Centro - Angra dos Reis/RJ | Tel: (24) 3377-4527
                    </div>

                    <style dangerouslySetInnerHTML={{__html: `
                        @media print {
                            body { 
                                -webkit-print-color-adjust: exact; 
                                print-color-adjust: exact; 
                                background-color: white !important;
                            }
                            @page { size: A4; margin: 10mm; }
                            .no-print { display: none !important; }
                            #template-page { 
                                box-shadow: none !important; 
                                padding: 0 !important;
                                width: 100% !important;
                            }
                        }
                    `}} />
                </div>
            </main>
        </div>
    );
}