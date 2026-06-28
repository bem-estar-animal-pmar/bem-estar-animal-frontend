import { ButtonLink } from "@/src/components/ui"

export const EmergencyCto = () => {
    return (
        <section 
            id="inicio"
            className="w-full flex flex-col h-140 sm:h-132 md:h-144 pt-16 bg-[url('/pet-sick-emergency-bg.webp')] items-center gap-4 md:gap-8
            bg-no-repeat bg-bottom bg-size-[640px] sm:bg-size-[720px] md:bg-size-[960px] px-4 sm:px-6"
        >
            <h2 className="text-default-fg font-bold text-2xl md:text-3xl lg:text-4xl max-w-160 md:text-center">
                Conhece algum animal em situação de rua que precisa de ajuda?
            </h2>
            <div className="flex flex-col md:flex-row w-full justify-evenly items-center gap-4">
                <div className="flex flex-col lg:max-w-120">
                    <p className="text-muted-fg text-sm md:text-base">
                        Nós prezamos pela saúde e segurança de todos os animais do munícipio, e, à medida do possível, 
                        oferecemos serviços gratuitos de consulta e tratamentos.
                    </p>
                </div>
                <div className="flex flex-col lg:max-w-120">
                    <p className="text-muted-fg text-sm md:text-base">
                        Se você acredita que algum bichinho está precisando de cuidados e quer saber mais sobre nosso atendimento
                        emergencial, clique no botão abaixo.
                    </p>
                </div>
            </div>
            <ButtonLink
                href="/emergency"
                variant="primary"
                className="sm:h-12 sm:px-8 sm:text-base gap-2"
                size="md"
            >
                Atendimento emergencial
            </ButtonLink>
        </section>
    )
}