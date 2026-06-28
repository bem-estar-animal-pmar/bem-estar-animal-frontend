import Image from "next/image";
import about_image from "@/public/about-image.webp"
import { Card } from "@/src/components/ui";

export const About = () => {
    return (
        <section className="flex px-4 sm:px-6 xl:px-12 pt-4 sm:pt-8 w-full justify-center">
            <div className="flex flex-col lg:flex-row w-full max-w-384 justify-between">
                <div className="flex flex-col w-full pr-4 gap-2 justify-center items-center">
                    <div className="py-4">
                        <div className="flex flex-col lg:items-center justify-center lg:text-center gap-4">
                            <h2 className="text-default-fg font-bold text-2xl md:text-3xl lg:text-4xl">
                                Nossa missão: proteger, cuidar e conscientizar 
                            </h2>
                            <p className="text-muted-fg text-sm md:text-base">
                                A Superintendência de Bem-Estar animal é a estrutura do município dedicada exclusivamente a cuidar dos animais em situação de rua e apoiar tutores.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <Card className="flex bg-(--neutral-100)! shadow-none! border-none! items-center gap-2 p-4!">
                            <div className="flex flex-col">
                                <h3 className="font-bold text-sm text-default-fg">Atendimento Clínico Público</h3>
                                <p className="text-xs text-muted-fg mt-0.5">Disponibilizamos castração e atendimentos de emergência para animais resgatados e comunitários.</p>
                            </div>
                        </Card>
                        <Card className="flex bg-(--neutral-100)! shadow-none! border-none! items-center gap-2 p-4!">
                            <div className="flex flex-col">
                                <h3 className="font-bold text-sm text-default-fg">Adoção Responsável</h3>
                                <p className="text-xs text-muted-fg mt-0.5">Mantemos programas de reabilitação para que animais de rua encontrem lares seguros e definitivos.</p>
                            </div>
                        </Card>
                        <Card className="flex bg-(--neutral-100)! shadow-none! border-none! items-center gap-2 p-4!">
                            <div className="flex flex-col">
                                <h3 className="font-bold text-sm text-default-fg">Campanhas</h3>
                                <p className="text-xs text-muted-fg mt-0.5">Realizamos anualmente diversas campanhas de adoção, proteção e bem-estar animal.</p>
                            </div>
                        </Card>                        
                        <Card className="flex bg-(--neutral-100)! shadow-none! border-none! items-center gap-2 p-4!">
                            <div className="flex flex-col">
                                <h3 className="font-bold text-sm text-default-fg">2343 animais castrados esse ano</h3>
                                <p className="text-xs text-muted-fg mt-0.5">Realizamos a castração de animais do munípicio que possuem responsável e também em situação de rua.</p>
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="hidden lg:flex flex-col w-full lg:max-w-108 xl:max-w-full justify-center lg:items-end items-center">
                    <Image
                        src={about_image}
                        alt="Imagem de pet com responsável"
                        className="w-full max-w-120 h-full object-cover object-right"
                    />
                </div>
            </div>
        </section>
    );
};