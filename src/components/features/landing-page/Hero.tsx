import { ButtonLink } from "@/src/components/ui"
import { SquareArrowUpRightIcon } from "@/src/components/icons/outline"

export const Hero = () => {
    return (
        <div className="w-full flex bg-[#E5F0CA] justify-center">
            <section 
                id="inicio"
                className="w-full flex h-120 sm:h-144 lg:h-168 max-w-384 items-center bg-[url('/hero.png')] md:bg-[url('/herolg.png')]
                bg-no-repeat bg-bottom-right bg-size-[340px] sm:bg-size-[480px] md:bg-size-[652px] lg:bg-size-[760px]"
            >
                <div className="flex flex-col max-w-80 sm:max-w-108 lg:max-w-124 p-4 sm:ml-4 lg:ml-8 xl:ml-36">
                    <div className="bg-default/10 dark:bg-default/70 dark:xl:bg-transparent xl:bg-transparent 
                        backdrop-blur-sm xl:backdrop-blur-none p-2 rounded-md"
                    >
                        <h1 className="text-default-fg font-bold text-2xl sm:text-4xl lg:text-5xl">
                            Superintendência de Bem-Estar <span className="text-brand-fg">Animal</span>
                        </h1>
                        <p className="text-muted-fg text-xs sm:text-sm lg:text-lg">
                            Informações, atendimentos e programas públicos voltados ao cuidado animal no município.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-y-1 gap-x-2 items-center justify-center py-2">
                        <ButtonLink 
                            href="/dashboard"
                            target="_blank"
                            className="sm:h-11! w-fit gap-1"
                            variant="primary"
                            pill="true"
                        >
                           
                            Acessar serviços <SquareArrowUpRightIcon />
                        </ButtonLink>
                    </div>
                </div>
            </section>
        </div>
    )
}