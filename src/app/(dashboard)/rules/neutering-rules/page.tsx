"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

import { ButtonLink } from "@/src/components/ui/ButtonLink"
import { Card } from "@/src/components/ui/Card"

import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon"
import { Badge, TextLink } from "@/src/components/ui"
import {
    CalendarIcon,
    HeartPulseIcon,
    AlertTriangleIcon,
    UsersIcon,
    ClockIcon,
    BanIcon,
    SunIcon,
    MoonIcon
} from "@/src/components/icons/outline"

const NeuteringRulesContent = () => {

    const searchParams = useSearchParams();
    const petIdParam = searchParams.get("petId") || "";

    return (
        <div className="w-full flex flex-col">
                
            <div className="flex flex-col w-full pb-8">
                <h1 className="text-default-fg font-semibold text-xl sm:text-2xl md:text-3xl pb-4">
                    Regulamento e instruções <span className="text-primary-fg">para castração</span>
                </h1>

                <p className="text-muted-fg text-sm md:text-base pb-4">
                    Antes de agendar a castração do seu pet, é fundamental que você leia e compreenda as regras e instruções abaixo. O não cumprimento dessas diretrizes pode resultar na recusa do atendimento no dia da cirurgia.
                </p>
                
                <h2 className="text-default-fg font-semibold text-lg sm:text-xl pb-4 mt-2">
                    Regras de agendamento
                </h2>
                
                <p className="text-muted-fg text-sm md:text-base pb-4 max-w-244">
                    Todas as regras abaixo são aplicadas automaticamente no sistema, leia-as atentamente para evitar problemas ao cadastrar seu pet para castração.
                </p>
                    
                <div className="mb-8 bg-primary/80 px-4 py-4 flex flex-col shadow-sm
                    md:grid md:grid-cols-1 lg:grid-cols-3 gap-4 max-h-68 md:max-h-none overflow-y-auto md:overflow-y-visible rounded-md
                    [&::-webkit-scrollbar]:w-3
                    [&::-webkit-scrollbar-track]:bg-transparent
                    [&::-webkit-scrollbar-thumb]:bg-brand-fg/60
                    [&::-webkit-scrollbar-thumb]:rounded-full
                    hover:[&::-webkit-scrollbar-thumb]:bg-brand-fg"
                >
                
                    <Card className="flex items-start p-4 gap-3 w-full shrink-0 md:shrink shadow-none">
                        <div className="flex shrink-0 items-center justify-center p-2 bg-blue-100 text-blue-600 rounded-lg">
                            <CalendarIcon />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-sm text-default-fg">Faixa Etária</h3>
                            <p className="text-xs text-muted-fg mt-1">A castração só pode ocorrer caso o animal tenha entre <span className="font-semibold">3 meses a 8 anos</span>. Animais idosos ou filhotes não podem ser castrados.</p>
                        </div>
                    </Card>

                    <Card className="flex items-start p-4 gap-3 w-full shrink-0 md:shrink shadow-none">
                        <div className="flex shrink-0 items-center justify-center p-2 bg-rose-100 text-rose-600 rounded-lg">
                            <HeartPulseIcon />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-sm text-default-fg">Exigência de Hemograma</h3>
                            <p className="text-xs text-muted-fg mt-1">Cães fêmeas pesando de <span className="font-semibold">1 a 3 kg</span> ou <span className="font-semibold">acima de 15 kg</span> requerem hemograma prévio. Após realizar o agendamento de castração, envie-nos o hemograma e confirmaremos o agendamento.</p>
                        </div>
                    </Card>

                    <Card className="flex items-start p-4 gap-3 w-full shrink-0 md:shrink shadow-none">
                        <div className="flex shrink-0 items-center justify-center p-2 bg-amber-100 text-amber-600 rounded-lg">
                            <AlertTriangleIcon />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-sm text-default-fg">Raças Específicas</h3>
                            <p className="text-xs text-muted-fg mt-1">Raças de focinho curto precisam de avaliação e exames extras, seu status ficará como <span className="font-semibold">aguardando exames</span> até que o tutor entre em contato com a clínica para agendar e entregas esses exames.</p>
                        </div>
                    </Card>

                    <Card className="flex items-start p-4 gap-3 w-full shrink-0 md:shrink shadow-none">
                        <div className="flex shrink-0 items-center justify-center p-2 bg-purple-100 text-purple-600 rounded-lg">
                            <UsersIcon />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-sm text-default-fg">Limite por Cadastro</h3>
                            <p className="text-xs text-muted-fg mt-1">Para atender a todos, é permitido o agendamento de até <span className="font-semibold">2 animais por mês</span> por CPF.</p>
                        </div>
                    </Card>

                    <Card className="flex items-start p-4 gap-3 w-full shrink-0 md:shrink shadow-none">
                        <div className="flex shrink-0 items-center justify-center p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                            <ClockIcon />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-sm text-default-fg">Cancelamentos</h3>
                            <p className="text-xs text-muted-fg mt-1">Cancelamentos podem ser feitos com até <span className="font-semibold">48h de antecedência</span> pelo usuário. Para cancelamentos no mesmo dia, entre em contato com a clínica e evite faltas.</p>
                        </div>
                    </Card>

                    <Card className="flex items-start p-4 gap-3 w-full shrink-0 md:shrink shadow-none">
                        <div className="flex shrink-0 items-center justify-center p-2 bg-gray-100 text-gray-600 rounded-lg">
                            <BanIcon />
                        </div>
                        <div className="flex flex-col">
                            <h3 className="font-semibold text-sm text-default-fg">Faltas e Bloqueios</h3>
                            <p className="text-xs text-muted-fg mt-1">Faltas sem justificativa geram um <span className="font-semibold">bloqueio de 1 mês</span> no CPF para novos agendamentos.</p>
                        </div>
                    </Card>
                    
                </div>


                <div className="bg-card border-l border-l-primary-border border-y border-r border-primary-border rounded-xl p-6 mb-8">
                    <h2 className="text-default-fg font-semibold text-lg sm:text-xl pb-4">
                        Instruções para o dia da castração
                    </h2>
                    <ul className="list-disc pl-5 flex flex-col gap-3 text-sm md:text-base text-default-fg">
                        <li><span className="font-semibold">Não será permitida a troca de tutor ou lar temporário</span>; caso não possa comparecer no dia da cirurgia, o responsável deverá cancelar o agendamento previamente.</li>
                        <li>No dia da castração, o tutor deverá apresentar originais e xerox do <span className="font-semibold">RG e CPF</span>, do <span className="font-semibold">comprovante de residência</span> e do <span className="font-semibold">formulário de inscrição</span> de cada animal (digital ou impresso). Sem esses documentos, a cirurgia não será realizada.</li>
                        <li>No dia de castração, colocaremos um CHIP de Identificação no animal, que poderá ser visto sistema e ajudará à localizar seu pet.</li>
                        <li>Os responsáveis também devem levar, <span className="font-semibold">OBRIGATORIAMENTE</span>, a roupinha cirúrgica para o pós-operatório das fêmeas.</li>
                        <li>O animal deve estar em <span className="font-semibold">jejum alimentar de 6 horas e hídrico de 4 horas</span>.</li>
                        <li>O <span className="font-semibold">hemograma é obrigatório</span> para canino fêmea abaixo de 3 kg e acima de 15 kg, sendo opcional para caninos macho e felinos macho/fêmea.</li>
                        <li>O animal deve estar em boas condições de saúde.</li>
                        <li><span className="font-semibold">Felinos</span> devem estar em caixa de transporte compatível com seu tamanho, sem panos, jornal, lençol etc., forrada apenas com tapete higiênico. Apenas 01 (um) animal por caixa de transporte. <span className="font-semibold">Não receberemos felinos fora da caixa de transporte.</span></li>
                        <li><span className="font-semibold">Caninos</span> devem estar de coleira, guia ou em caixa de transporte compatível com o tamanho. Caninos bravos ou de grande porte devem estar de focinheira.</li>
                        <li>O animal <span className="font-semibold">não pode estar vacinado</span> no período de 21 dias.</li>
                        <li>Animais braquicefálicos (focinho curto) devem realizar <span className="font-semibold">obrigatoriamente</span>, além do hemograma, outros exames a serem indicados pela Superintendência de Bem-Estar Animal. Para realizar a solicitação de exames, entre em contato através do e-mail: bemestaranimal@angra.rj.gov.br ou telefone: (24) 3377-4527.</li>
                        <li>Mesmo com a apresentação dos exames, o animal ainda está sujeito à avaliação médico-veterinária.</li>
                        <li>
                            <span className="font-semibold block mb-2 mt-2">Lista de animais braquicefálicos:</span>
                            <ul className="list-[circle] pl-5 flex flex-col gap-2 text-muted-fg bg-muted/30 p-4 rounded-lg">
                                <li><span className="font-semibold">Cães:</span> Pug, Boston Terrier, Bulldog Francês, Pequinês, Boxer, Shih Tzu, Dogue de Bordeaux, Lhasa Apso, Shar-pei, Buldogue inglês/francês, Chihuahua, American Bully, Cavalier King Charles Spaniel, Maltês, Staffordshire Bull Terrier.</li>
                                <li><span className="font-semibold">Gatos:</span> Burmês Americano, Himalaio, Persa (todos os tipos) e Shorthair Exótico.</li>
                            </ul>
                        </li>
                    </ul>
                </div>

                <h2 className="text-default-fg font-semibold text-lg sm:text-xl pb-4">
                    Horários
                </h2>
                                
                <p className="text-muted-fg text-sm md:text-base pb-4 max-w-244">
                    No momento de agendar a castração, o sistema só permite que você selecione o horário com base nos horários disponíveis:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
                    
                    <Card className="p-4 flex flex-col gap-4 shadow-none!">
                        <div className="flex items-center gap-2 border-b border-default-border pb-2 text-default-fg">
                            <CalendarIcon />
                            <h3 className="font-bold text-sm md:text-base">Segunda à Quinta-feira</h3>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-default-border">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-default-fg flex items-center gap-1">
                                        <span className="text-amber-500"><SunIcon /></span>
                                        Manhã (09:00)
                                    </span>
                                    <span className="text-sm text-muted-fg mt-0.5">Atendimento para felinos</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-default-border">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-default-fg flex items-center gap-1">
                                        <span className="text-orange-500"><MoonIcon /></span>
                                        Tarde (14:00)
                                    </span>
                                    <span className="text-sm text-muted-fg mt-0.5">Atendimento para caninos</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 flex flex-col gap-4 shadow-none!">
                        <div className="flex items-center gap-2 border-b border-default-border pb-2 text-default-fg">
                            <CalendarIcon />
                            <h3 className="font-bold text-sm md:text-base">Sexta-feira</h3>
                        </div>
                        
                        <div className="flex flex-col gap-3">
                            <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-default-border">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-default-fg flex items-center gap-1">
                                        <span className="text-amber-500"><SunIcon /></span>
                                        Manhã (09:00)
                                    </span>
                                    <span className="text-sm text-muted-fg mt-0.5">Apenas felinos machos</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border border-default-border">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-default-fg flex items-center gap-1">
                                        <span className="text-orange-500"><MoonIcon /></span>
                                        Tarde (14:00)
                                    </span>
                                    <span className="text-sm text-muted-fg mt-0.5">Apenas caninos machos</span>
                                </div>
                            </div>
                        </div>
                    </Card>

                </div>

                <h2 className="text-default-fg font-semibold text-lg sm:text-xl pb-4">
                    Documentações em PDF
                </h2>

                <div className="gap-y-2 flex flex-col pb-4">
                    <TextLink target="_blank" variant="primary" className="underline! w-fit" href="https://portal.angra.rj.gov.br/downloads/IMAAR/Solicitacao-Hemograma-Castracao.pdf">
                        - Documento de solicitação de hemograma
                    </TextLink>
                    <TextLink target="_blank" variant="primary" className="underline! w-fit" href="https://portal.angra.rj.gov.br/downloads/IMAAR/Regulamento-Programa-Castracao-2025.pdf">
                        - Regulamento do programa de castração
                    </TextLink>
                    <TextLink target="_blank" variant="primary" className="underline! w-fit" href="/neutering-template">
                        - Formulário de inscrição e termo de compromisso do animal
                    </TextLink>
                </div>

                <div className="flex w-full justify-end">
                    <ButtonLink 
                        variant="primary" 
                        size="lg" 
                        href={`/dashboard/neuterings${ petIdParam ? `?petId=${petIdParam}` : ""}`}
                    >
                        Li e concordo com as regras
                    </ButtonLink>
                </div>

            </div>
        </div>
    )
}

export default function NeuteringPage() {
  return (
    <Suspense 
        fallback={
            <div className="w-full flex justify-center items-center h-screen">
                <SpinnerIcon />
            </div>
        }
    >
        <NeuteringRulesContent />
    </Suspense>
  )
}