import Image from "next/image";
import neutering_cto_image from "@/public/neutering-image.webp"
import neutering_cto_image_mobile from "@/public/neutering-image-mobile.webp"
import { ButtonLink } from "@/src/components/ui"
import { SquareArrowUpRightIcon } from "@/src/components/icons/outline";

/*
    <div className="flex flex-col lg:items-center justify-center lg:text-center gap-4">
        <h2 className="text-default-fg font-bold text-2xl md:text-3xl lg:text-4xl">
            Nossa <span className="text-brand-fg">missão</span>: proteger, cuidar e conscientizar 
        </h2>
        <p className="text-muted-fg text-sm md:text-base">
            A Superintendência de Bem-Estar animal é a estrutura do município dedicada exclusivamente a cuidar dos animais em situação de rua e apoiar tutores.
        </p>
    </div>
*/
export const NeuteringCto = () => {
    return (
        <section className="flex py-4 md:py-12 w-full px-4 sm:px-6 justify-center">
            <div className="flex flex-col sm:flex-row w-full justify-around sm:items-center max-w-384">
                <div className="flex flex-col sm:items-center sm:max-w-104 sm:justify-center gap-4 sm:text-center">
                    <h2 className="text-default-fg font-bold text-2xl md:text-3xl lg:text-4xl">
                        Mais saúde, menos riscos.  Castre seu pet!
                    </h2>
                    <p className="text-muted-fg text-sm md:text-base max-w-2xl">
                        A castração previne tumores, infecções e garante muito mais qualidade de vida para ele.
                    </p>
                    <div className="flex flex-col gap-4 sm:hidden max-w-148 w-full">
                            <Image
                                src={neutering_cto_image_mobile}
                                alt="Imagem de pet com responsável"
                                className="max-h-48 object-cover w-full" 
                            />
                            <div className="flex justify-center">
                                <ButtonLink
                                    href="/neutering"
                                    variant="primary"
                                    className="gap-2 px-12! w-full!"
                                    pill="true"
                                    size="md"
                                >
                                    Saiba como agendar
                                    <SquareArrowUpRightIcon size={20} />
                                </ButtonLink>
                            </div>
                        </div>
                        <ButtonLink
                            href="/neutering"
                            variant="primary"
                            className="hidden sm:flex sm:h-12 sm:px-8 sm:text-base gap-2 w-fit! self-center"
                            size="md"
                        >
                            Saiba como agendar
                            <SquareArrowUpRightIcon size={22} />
                        </ButtonLink>
                </div>
                <div className="hidden sm:flex max-w-114 pl-4 w-full">
                    <Image
                        src={neutering_cto_image}
                        alt="Imagem de pet com responsável"
                        className=""
                    />
                </div>
            </div>
        </section>
    );
};