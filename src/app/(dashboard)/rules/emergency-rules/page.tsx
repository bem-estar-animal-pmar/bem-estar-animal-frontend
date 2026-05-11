"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"
import Image from "next/image"

import care from "@/public/emergencyone.webp"
import treatment from "@/public/emergencytwo.webp"
import visit from "@/public/emergencythree.webp"
import adopt from "@/public/emergencyfour.webp"

import { ButtonLink } from "@/src/components/ui/ButtonLink"
import { Card } from "@/src/components/ui/Card"
import { TextLink } from "@/src/components/ui"
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon"

const EmergencyRulesContent = () => {
    const searchParams = useSearchParams();
    const petIdParam = searchParams.get("petId") || "";

    return (
        <div className="w-full flex flex-col">
            <div className="flex flex-col w-full pb-8">
                <h1 className="text-default-fg font-semibold text-xl sm:text-2xl md:text-3xl pb-4">
                    Regulamento e instruções para <span className="text-primary-fg">atendimento emergencial</span>
                </h1>

                <p className="text-muted-fg text-sm md:text-base pb-4">
                    O serviço de atendimento emergencial é destinado exclusivamente a <span className="text-default-fg font-medium">animais de rua</span>. Ao solicitar este atendimento, você se compromete a atuar como <span className="text-default-fg font-medium">Lar Temporário</span>, assumindo a guarda provisória e a responsabilidade sobre a recuperação do animal.
                </p>

                <h2 className="text-default-fg font-semibold text-lg sm:text-xl pb-4 mt-2">
                    Deveres do Lar Temporário
                </h2>
                
                {/* Seção de Cards com Imagens - Estilo Adoção */}
                <div className="flex flex-col items-center lg:items-start lg:flex-row gap-4 pb-8">
                    <div className="flex gap-4 flex-col sm:flex-row justify-center h-full">
                        <Card className="flex flex-col p-5 gap-2 shadow-sm max-w-92!">
                            <Image
                                src={care}
                                alt="Guarda e Cuidados"
                                className="w-full max-w-64 self-center h-auto mb-2"
                            />
                            <h3 className="font-semibold text-base text-default-fg z-10">1. Guarda e Cuidados</h3>
                            <p className="text-sm text-muted-fg z-10">
                                Garantir boas condições de alojamento e alimentação, preservando a saúde e integridade do animal. É proibido transmitir a posse a terceiros.
                            </p>
                        </Card>

                        <Card className="flex flex-col p-5 gap-2 shadow-sm max-w-92!">
                            <Image
                                src={treatment}
                                alt="Tratamento Médico"
                                className="w-full max-w-64 self-center h-auto mb-2"
                            />
                            <h3 className="font-semibold text-base text-default-fg z-10">2. Tratamento Médico</h3>
                            <p className="text-sm text-muted-fg z-10">
                                Realizar rigorosamente todo o tratamento conforme orientação veterinária, durante todo o período de recuperação.
                            </p>
                        </Card>
                    </div>

                    <div className="flex gap-4 flex-col sm:flex-row justify-center h-full">
                        <Card className="flex flex-col p-5 gap-2 shadow-sm max-w-92!">
                            <Image
                                src={visit}
                                alt="Acesso e Fiscalização"
                                className="w-full max-w-64 self-center h-auto mb-2"
                            />
                            <h3 className="font-semibold text-base text-default-fg z-10">3. Acesso e Fiscalização</h3>
                            <p className="text-sm text-muted-fg z-10">
                                Permitir o acesso dos funcionários do IMAAR ao local do animal para averiguação. Constatada situação inadequada, o tutor perderá a guarda.
                            </p>
                        </Card>

                        <Card className="flex flex-col p-5 gap-2 shadow-sm max-w-92!">
                            <Image
                                src={adopt}
                                alt="Pós-tratamento e Adoção"
                                className="w-full max-w-64 self-center h-auto mb-2"
                            />
                            <h3 className="font-semibold text-base text-default-fg z-10">4. Pós-tratamento e Adoção</h3>
                            <p className="text-sm text-muted-fg z-10">
                               Após a alta, o animal pode ser colocado para adoção, devolvido à comunidade ou adotado pelo solicitante.
                            </p>
                        </Card>
                    </div>
                </div>

                <div className="bg-card border-l border-l-primary-border border-y border-r border-primary-border rounded-xl p-6 mb-8">
                    <h2 className="text-default-fg font-semibold text-lg sm:text-xl pb-4">
                        Termos de Responsabilidade
                    </h2>
                    <ul className="list-disc pl-5 flex flex-col gap-3 text-sm md:text-base text-muted-fg">
                        <li><span className="font-semibold text-default-fg">Veracidade das informações:</span> Declaro que o animal é de rua e garanto que todas as informações fornecidas são verdadeiras, tendo ciência das sanções legais caso haja prova em contrário.</li>
                        <li><span className="font-semibold text-default-fg">Riscos e convivência:</span> Declaro estar ciente de todos os cuidados que a recuperação do animal exige e de conhecer os riscos inerentes à espécie/raça no convívio humano.</li>
                        <li><span className="font-semibold text-default-fg">Comunicação ativa:</span> Comprometo-me a entrar em contato com o IMAAR caso haja qualquer problema clínico ou comportamental com o animal no período pós-cirúrgico.</li>
                        <li><span className="font-semibold text-default-fg">Adoção pelo Lar Temporário:</span> Caso decida permanecer com a guarda do animal após o tratamento, ele passa a ser caracterizado "animal de tutor" e exigirá a assinatura formal do Termo de Guarda Responsável.</li>
                        <li><span className="font-semibold text-default-fg">Em caso de óbito:</span> A responsabilidade sobre o destino e descarte adequado do corpo do animal é exclusiva do lar temporário.</li>
                    </ul>
                </div>

                <h2 className="text-default-fg font-semibold text-lg sm:text-xl pb-4">
                    Documentações em PDF
                </h2>

                <div className="gap-y-2 flex flex-col pb-8">
                    <TextLink target="_blank" variant="primary" className="underline! w-fit" href="/emergency-template">
                        - Termo de Responsabilidade - Atendimento Emergencial e Lar Temporário
                    </TextLink>
                </div>

                <div className="flex w-full justify-end">
                    <ButtonLink 
                        variant="primary" 
                        size="lg" 
                        href={`/dashboard/emergencies/new${ petIdParam ? `?petId=${petIdParam}` : ""}`}
                    >
                        Li e concordo com as regras
                    </ButtonLink>
                </div>
            </div>
        </div>
    )
}

export default function EmergencyRulesPage() {
  return (
    <Suspense 
        fallback={
            <div className="w-full flex justify-center items-center h-screen">
                <SpinnerIcon />
            </div>
        }
    >
        <EmergencyRulesContent />
    </Suspense>
  )
}