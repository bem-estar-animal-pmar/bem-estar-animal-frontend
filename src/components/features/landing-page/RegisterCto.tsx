import Image from "next/image";
import animal_logo from "@/public/animal-logo.svg"
import { ButtonLink } from "@/src/components/ui"
import { SquareArrowUpRightIcon } from "@/src/components/icons/outline";

export const RegisterCto = () => {
    return (
        <section 
            className="w-full flex items-center justify-center py-16 sm:py-24 px-4 sm:px-6 bg-[#F2F9ED]"
        >
            <div className="flex flex-col sm:flex-row max-w-304 w-full justify-around items-center gap-12">
                    <div className="flex max-w-64 sm:max-w-80 w-full">
                        <Image
                            src={animal_logo}
                            alt="Logo do Bem-Estar Animal"
                        />
                    </div>

                    <div className="flex flex-col items-center max-w-108 justify-center gap-4 text-center">
                        <h2 className="text-default-fg font-bold text-2xl md:text-3xl lg:text-4xl">
                            Acesse todos os nossos serviços na <span className="text-brand-fg">área do usuário</span>
                        </h2>
                        <p className="text-muted-fg text-sm md:text-base max-w-2xl">
                            Cadastre-se no nosso sistema e registre seu pet para castrações e outros serviços.
                        </p>
                        <ButtonLink
                            href="/neutering"
                            variant="primary"
                            className="sm:h-12 sm:px-8 sm:text-base gap-2"
                            size="md"
                        >
                            Criar conta agora
                            <SquareArrowUpRightIcon size={20} />
                        </ButtonLink>
                    </div>
            </div>
        </section>
    );
};