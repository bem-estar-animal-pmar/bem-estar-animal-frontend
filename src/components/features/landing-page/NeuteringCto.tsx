import Image from "next/image";
import neutering_cto_image from "@/public/neutering-cto-pet.webp"
import { ButtonLink } from "@/src/components/ui"
import { SquareArrowUpRightIcon } from "@/src/components/icons/outline";

export const NeuteringCto = () => {
    return (
        <section className="flex py-16 w-full px-4 sm:px-6 justify-center">
            <div className="flex flex-col sm:flex-row w-full justify-around items-center max-w-384">
                <div className="flex flex-col items-center max-w-108 sm:max-w-92 justify-center gap-4 text-center">
                    <h2 className="text-default-fg font-bold text-2xl md:text-3xl lg:text-4xl">
                        Mais saúde, menos riscos. <span className="text-brand-fg">Castre seu pet!</span>
                    </h2>
                    <p className="text-muted-fg text-sm md:text-base max-w-2xl">
                        A castração previne tumores, infecções e garante muito mais qualidade de vida para ele.
                    </p>
                    <div className="flex sm:hidden max-w-56 sm:max-w-96 w-full">
                        <Image
                            src={neutering_cto_image}
                            alt="Imagem de pet com responsável"
                            className="rounded-lg"
                        />
                    </div>
                    <ButtonLink
                        href="/neutering"
                        variant="primary"
                        className="sm:h-12 sm:px-8 sm:text-base gap-2"
                        size="md"
                    >
                        Quero saber mais
                        <SquareArrowUpRightIcon size={20} />
                    </ButtonLink>
                </div>
                <div className="hidden sm:flex max-w-56 sm:max-w-96 w-full">
                    <Image
                        src={neutering_cto_image}
                        alt="Imagem de pet com responsável"
                        className="rounded-lg"
                    />
                </div>
            </div>

        </section>
    );
};