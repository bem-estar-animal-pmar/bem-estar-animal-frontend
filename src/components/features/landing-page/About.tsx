import Image from "next/image";
import about_image from "@/public/about-image.webp"
import { Card } from "@/src/components/ui";

export const About = () => {
    return (
        <section className="flex pt-8 w-full justify-center">
            <div className="flex flex-col md:flex-row w-full max-w-384 justify-center">
                <div className="flex flex-col w-full p-4 gap-2 justify-center items-center ">
                    <div className="py-4 max-w-144 ">
                        <div className="flex flex-col items-center justify-center text-center gap-4">
                            <h2 className="text-default-fg font-bold text-2xl md:text-3xl lg:text-4xl">
                                Nossa missão: proteger, cuidar e conscientizar
                            </h2>
                            <p className="text-muted-fg text-sm md:text-base max-w-2xl">
                                A Superintendência de Bem-Estar animal é a estrutura do município dedicada exclusivamente a cuidar dos animais em situação de rua e apoiar tutores.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <Card className="flex items-center gap-2 hover:border-brand-fg transition-colors duration-200 p-4 shadow-sm!">
                            <div className="flex flex-col">
                                <h3 className="font-bold text-sm text-default-fg">Atendimento Clínico Público</h3>
                                <p className="text-xs text-muted-fg mt-0.5">Disponibilizamos castração e atendimentos de emergência para animais resgatados e comunitários.</p>
                            </div>
                        </Card>
                        <Card className="flex items-center gap-2 hover:border-brand-fg transition-colors duration-200 p-4 shadow-sm!">
                            <div className="flex flex-col">
                                <h3 className="font-bold text-sm text-default-fg">Adoção Responsável</h3>
                                <p className="text-xs text-muted-fg mt-0.5">Mantemos programas de reabilitação para que animais de rua encontrem lares seguros e definitivos.</p>
                            </div>
                        </Card>
                        <Card className="flex items-center gap-2 hover:border-brand-fg transition-colors duration-200 p-4 shadow-sm!">
                            <div className="flex flex-col">
                                <h3 className="font-bold text-sm text-default-fg">Campanhas</h3>
                                <p className="text-xs text-muted-fg mt-0.5">Realizamos anualmente diversas campanhas de adoção, proteção e bem-estar animal.</p>
                            </div>
                        </Card>                        
                        <Card className="flex items-center gap-2 hover:border-brand-fg transition-colors duration-200 p-4 shadow-sm!">
                            <div className="flex flex-col">
                                <h3 className="font-bold text-sm text-default-fg">2343 animais castrados esse ano</h3>
                                <p className="text-xs text-muted-fg mt-0.5">Realizamos a castração de animais do munípicio que possuem responsável e também em situação de rua.</p>
                            </div>
                        </Card>
                    </div>
                </div>
                <div className="hidden md:flex flex-col w-full max-w-196 max-h-124 md:max-h-164 ">
                    <Image
                        src={about_image}
                        alt="Imagem de pet com responsável"
                        className="w-full object-cover object-right h-full"
                    />
                </div>
            </div>

        </section>
    );
};