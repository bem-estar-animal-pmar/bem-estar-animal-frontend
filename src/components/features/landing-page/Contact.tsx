import Link from "next/link";

import { ButtonLink } from "../../ui/ButtonLink";
import { Badge } from "../../ui/Badge";
import { Card } from "../../ui/Card";

import { WhatsappIcon, InstagramIcon, FacebookIcon } from "@/src/components/icons/brand/";
import { PhoneIcon, LocationIcon, EnvelopeIcon, ClockIcon } from "@/src/components/icons/outline/";

export const Contact = () => {
    return (
        <section 
            id="contato"
            className="w-full flex flex-col items-center justify-center py-12 sm:py-16 px-4 sm:px-6 max-w-384"
        >
            <div className="flex flex-col md:items-center justify-center gap-4 pb-8 md:text-center">
                <h2 className="text-default-fg font-bold text-xl sm:text-3xl lg:text-4xl">
                    Quer saber mais? Fale conosco
                </h2>
                <p className="text-muted-fg text-sm sm:text-base  max-w-2xl">
                    Entre em contato conosco para esclarecimento de dúvidas e sugestões, ou visite-nos.
                </p>
            </div>

            <div className="w-full max-w-6xl flex flex-col gap-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="md:col-span-2 p-0! rounded-md! overflow-hidden h-88 md:h-auto grow shadow-sm!">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3672.684538115296!2d-44.307066123804006!3d-22.99862504116142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9c4e5df97430e3%3A0x596d963333c3ee6d!2sR.%20Ju%C3%ADz%20Orlando%20Caldelas%2C%2042%20-%20Parque%20das%20Palmeiras%2C%20Angra%20dos%20Reis%20-%20RJ%2C%2023906-470%2C%20Brasil!5e0!3m2!1spt-BR!2sus!4v1782222819526!5m2!1spt-BR!2sus" 
                            width="100%" 
                            height="100%" 
                            style={{ border: 0, borderRadius: 'var(--radius-sm)' }} 
                            allowFullScreen={false} 
                            loading="lazy" 
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Mapa de Localização"
                        ></iframe>
                    </Card>
                    <div className="flex flex-col gap-6 justify-between">
                        <Card className="flex flex-row md:flex-col items-center md:items-start justify-between gap-4 shadow-sm!">
                            <div className="flex items-center gap-2">
                                <div className="bg-default text-muted-fg p-2.5 sm:p-3 rounded-full">
                                    <span className="sm:hidden"><PhoneIcon size={20} /></span>
                                    <span className="hidden sm:inline"><PhoneIcon size={24} /></span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">Telefone</span>
                                    <span className="text-muted-fg text-sm">(24) 3365-0019</span>
                                </div>
                            </div>
                            <ButtonLink 
                                href="tel:2433650019"
                                target="_blank"
                                size="sm" 
                                variant="default" 
                                className="w-full max-w-20 sm:max-w-32 md:max-w-full"
                            >
                                Ligar
                            </ButtonLink>
                        </Card>
                        <Card className="flex flex-row md:flex-col items-center md:items-start justify-between gap-4 shadow-sm!">
                            <div className="flex items-center gap-2">
                                <div className="bg-primary dark:bg-primary/20 text-primary-fg dark:text-brand-fg p-2.5 sm:p-3 rounded-full">
                                    <span className="sm:hidden"><LocationIcon size={20} /></span>
                                    <span className="hidden sm:inline"><LocationIcon size={24} /></span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="font-semibold text-sm">Visite-nos</span>
                                    <span className="text-muted-fg text-xs">
                                        R. Juíz Orlando Caldelas, no 42 - Parque das Palmeiras, Angra dos Reis - RJ, 23906-470
                                    </span>
                                </div>
                            </div>
                            <ButtonLink 
                                href="https://maps.app.goo.gl/6vXnZMGPjaUXUfhbA"
                                target="_blank"
                                size="sm" 
                                variant="outline" 
                                className="w-full max-w-20 sm:max-w-32 md:max-w-full"
                            >
                                Mapa
                            </ButtonLink>
                            </Card>
                        <Card className="flex items-center gap-3 sm:gap-4 shadow-sm!">
                            <div className="bg-primary text-primary-fg p-2.5 sm:p-3 rounded-full">
                                <span className="sm:hidden"><ClockIcon size={20} /></span>
                                <span className="hidden sm:inline"><ClockIcon size={24} /></span>
                                
                            </div>
                            <div className="flex flex-col grow">
                                <span className="font-semibold text-sm">Horários</span>
                                <span className="text-muted-fg text-sm">Seg - Sex: 9h às 16h</span>
                                <span className="text-muted-fg text-xs">Não atendemos em finais de semana</span>
                            </div>
                        </Card>

                        <Card className="flex items-center gap-4 shadow-sm!">
                            <div className="bg-primary text-primary-fg p-2.5 sm:p-3 rounded-full">
                                <span className="sm:hidden"><EnvelopeIcon size={20} /></span>
                                <span className="hidden sm:inline"><EnvelopeIcon size={24} /></span>
                            </div>
                            <div className="flex flex-col grow">
                                <span className="font-semibold text-sm">E-mail</span>
                                <span className="text-muted-fg text-xs truncate max-w-none sm:max-w-44 lg:max-w-60">
                                    bemestaranimal@angra.rj.gov.br
                                </span>
                            </div>
                        </Card>

                        <Card className="flex items-center gap-4 shadow-sm!">
                            <div className="bg-primary text-primary-fg p-2.5 sm:p-3 rounded-full">
                                <span className="sm:hidden"><InstagramIcon size={20} /></span>
                                <span className="hidden sm:inline"><InstagramIcon size={24} /></span>
                            </div>
                            <div className="flex flex-col grow">
                                <span className="font-semibold text-sm">Siga-nos no instagram</span>
                                <div className="flex w-full gap-2 py-1.5">
                                    <Link 
                                        href="https://www.instagram.com/bemestaranimalangra" 
                                        aria-label="Visite nosso Instagram" 
                                        className="text-muted-fg hover:text-brand-fg transition-colors"
                                    >
                                        <InstagramIcon size={20} />
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                </div>
            </div>
        </section>
    );
};