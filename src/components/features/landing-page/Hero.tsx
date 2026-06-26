import { ButtonLink } from "@/src/components/ui"
import { SquareArrowUpRightIcon } from "@/src/components/icons/outline"

export const Hero = () => {
    return (
        <div className="w-full flex justify-center">
            <style>{`
                .hero-section {
                    position: relative;
                    background-size: cover; 
                    background-position: center;
                }

                .hero-section::before {
                    content: "";
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 0;
                    background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 1536 672' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'><path fill='%23ffffff' d='M0,280 C768,280 768,600 1536,600 L1536,672 L0,672 Z'></path></svg>");
                    background-size: 100% 100%;
                    background-repeat: repeat;
                    transform: scaleX(-1);
                }

                @media (min-width: 640px) {
                    .hero-section::before {
                        background-image: url("data:image/svg+xml;utf8,<svg viewBox='0 0 1536 672' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'><path fill='%23ffffff' d='M0,320 C250,350 450,250 700,420 C950,560 1050,640 1350,610 C1450,600 1500,580 1536,570 L1536,672 L0,672 Z'></path></svg>");
                    }
                }

                .hero-section > div {
                    position: relative;
                    z-index: 1;
                }
            `}</style>

            <section 
                id="inicio"
                className="w-full flex h-120 sm:h-144 lg:h-168 max-w-384 items-center justify-start hero-section bg-[url('/hero-pattern.webp')] bg-size-[300px]! sm:bg-size-[440px]!"
            >
                <div className="flex flex-col max-w-80 sm:max-w-108 lg:max-w-132 p-4 ml-[2vw] md:ml-[4vw] xl:ml-28 gap-4">
                    <div className="bg-default/60 p-6 sm:p-8 rounded-md">
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