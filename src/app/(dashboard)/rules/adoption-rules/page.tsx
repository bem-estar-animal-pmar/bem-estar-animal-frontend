"use client"
import { ButtonLink } from "@/src/components/ui/ButtonLink"
import { Card } from "@/src/components/ui/Card"
import { TextLink } from "@/src/components/ui"

import Image from "next/image"
import adoption_one from "@/public/adoptionone.webp"
import adoption_two from "@/public/adoptiontwo.webp"
import adoption_three from "@/public/adoptionthree.webp"
import adoption_four from "@/public/adoptionfour.webp"

export default function AdoptionRulesPage() {
    return (
        <div className="w-full flex flex-col">
                
            <div className="flex flex-col w-full pb-8">
                <h1 className="text-default-fg font-semibold text-xl sm:text-2xl md:text-3xl pb-4">
                    Regulamento e instruções <span className="text-primary-fg">para adoção</span>
                </h1>

                <p className="text-muted-fg text-sm md:text-base pb-4">
                    O Bem-Estar Animal disponibiliza um serviço de vitrine de adoção para pessoas que encontraram animais em situação rua 
                    cadastrarem esses pets para adoção. É importante reforçar que <span className="text-default-fg font-medium">nós não disponibilizamos abrigo</span> para 
                    os pets em questão.
                </p>

                <section className="flex flex-col items-center lg:items-start lg:flex-row gap-4 pb-8">
                    <div className="flex gap-4 flex-col sm:flex-row justify-center h-full">
                        <Card className="flex flex-col p-5 gap-2 shadow-sm max-w-92!">
                            <Image
                                src={adoption_one}
                                alt="Exemplo 1 Adoção"
                                className="w-full max-w-64 self-center h-auto mb-2"
                            />
                            <h3 className="font-semibold text-base text-default-fg z-10">1. Solicitação</h3>
                            <p className="text-sm text-muted-fg z-10">
                                Você cadastra os dados e a foto do animal no sistema e cria um pedido formal para colocá-lo para adoção.
                            </p>
                        </Card>
                        <Card className="flex flex-col p-5 gap-2 shadow-sm max-w-92!">
                            <Image
                                src={adoption_two}
                                alt="Exemplo 2 Adoção"
                                className="w-full max-w-64 self-center h-auto mb-2"
                            />
                            <h3 className="font-semibold text-base text-default-fg z-10">2. Triagem e Contato</h3>
                            <p className="text-sm text-muted-fg z-10">
                                Nossa equipe clínica avaliará o pedido e entrará em contato com você para confirmar os dados e validar a solicitação.
                            </p>
                        </Card>
                    </div>

                    <div className="flex gap-4 flex-col sm:flex-row justify-center h-full">
                        <Card className="flex flex-col p-5 gap-2 shadow-sm  max-w-92!">
                            <Image
                                src={adoption_three}
                                alt="Exemplo 3 Adoção"
                                className="w-full max-w-64 self-center h-auto mb-2"
                            />
                            <h3 className="font-semibold text-base text-default-fg z-10">3. Vitrine Pública</h3>
                            <p className="text-sm text-muted-fg z-10">
                                Após aprovado, o status muda para "Para Adoção" e o pet passa a ser exibido na vitrine pública do site para interessados.
                            </p>
                        </Card>

                        <Card className="flex flex-col p-5 gap-2 shadow-sm max-w-92!">
                            <Image
                                src={adoption_four}
                                alt="Exemplo 4 Adoção"
                                className="w-full max-w-64 self-center h-auto mb-2"
                            />
                            <h3 className="font-semibold text-base text-default-fg z-10">4. Lar Temporário</h3>
                            <p className="text-sm text-muted-fg z-10">
                                Durante todo esse tempo, a responsabilidade pelo bem-estar e abrigo do animal é 100% sua, como lar temporário.
                            </p>
                        </Card>
                    </div>
                </section>

                <section className="bg-card border border-default-border rounded-xl p-6 mb-8">
                    <h2 className="text-default-fg font-semibold text-lg sm:text-xl pb-4 border-b border-default-border mb-4">
                        Deveres e Regras do Lar Temporário
                    </h2>
                    <ul className="list-disc pl-5 flex flex-col gap-3 text-sm md:text-base text-muted-fg">
                        <li><span className="font-semibold text-default-fg">Responsabilidade integral:</span> Ao solicitar a inclusão de um pet na vitrine, você assume automaticamente o papel de lar temporário até a conclusão da adoção.</li>
                        <li><span className="font-semibold text-default-fg">Alimentação e cuidados:</span> Fornecer alimentação adequada, água fresca, abrigo seguro contra sol e chuva, e manter o ambiente limpo.</li>
                        <li><span className="font-semibold text-default-fg">Saúde:</span> Informar imediatamente à clínica caso o animal apresente qualquer problema de saúde durante a estadia no lar temporário.</li>
                        <li><span className="font-semibold text-default-fg">Contato atualizado:</span> Manter seu número de telefone e WhatsApp atualizados no sistema, pois os possíveis adotantes serão direcionados a você.</li>
                        <li><span className="font-semibold text-default-fg">Adoção concluída:</span> Caso encontre um adotante antes de nós, é sua responsabilidade comunicar a equipe para remover o animal da vitrine.</li>
                        <li><span className="font-semibold text-default-fg">Abandono é crime:</span> O abandono de animais nas ruas ou nas dependências da clínica configura crime ambiental (Lei Federal nº 9.605/98), sujeito a penalidades severas.</li>
                    </ul>
                </section>

                <p className="text-muted-fg text-sm md:text-base pb-8">
                    <span className="font-semibold text-default-fg">*</span> O serviço descrito refere-se apenas à colocar animais para adoção, se você deseja 
                    <span className="font-medium text-muted-fg italic"> adotar um pet</span>, 
                    <TextLink
                        href="/adoption"
                        className="text-sm! md:text-base!"
                    >
                       {" "} clique aqui.
                    </TextLink>
                </p>

                <section className="flex flex-col">
                    <h2 className="text-default-fg font-semibold text-lg sm:text-xl pb-4">
                        Documentações em PDF
                    </h2>

                    <div className="gap-y-2 flex flex-col pb-8">
                        <TextLink target="_blank" variant="primary" className="underline! w-fit" href="/termo_de_adocao_responsavel.pdf">
                            - Termo de Responsabilidade - Lar Temporário
                        </TextLink>
                    </div>
                </section>

                <div className="flex w-full justify-end gap-2 sm:gap-4 items-center">
                    <TextLink 
                        variant="primary" 
                        size="md" 
                        href={`/dashboard`}
                    >
                        Não concordo
                    </TextLink>
                    <ButtonLink 
                        variant="primary" 
                        size="md" 
                        href="/dashboard/adoptions"
                    >
                        Li e concordo com as regras
                    </ButtonLink>
                </div>
            </div>
        </div>
    )
}