import { TextLink } from "../ui/TextLink";

import Image from "next/image";
import animal_logo from "@/public/animal-logo.svg"

import { EnvelopeIcon, LocationIcon, PhoneIcon } from "@/src/components/icons/outline/";

export const PublicFooter = () => {
    return (
        <footer className="flex w-full items-center justify-center border-t-48 border-(--primary-300) bg-(--primary-100) pt-4 py-8">
            <div className="w-full max-w-384 py-8 px-8 md:px-16 lg:px-32">
                <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 gap-y-8">
                    <div className="flex flex-col w-full gap-4 md:col-span-3 lg:col-span-1">
                        <Image
                            src={animal_logo}
                            alt="Logo do Bem-Estar Animal"
                            className="w-full max-w-28 sm:max-w-32"
                        />
                        <h1 className="text-default-fg font-semibold text-base sm:text-xl">
                            Superintendência de Bem-Estar Animal
                        </h1>
                        <p className="text-default-fg text-xs">
                            Informações, atendimentos e programas públicos voltados ao cuidado animal no município.
                        </p>
                    </div>
                    <div className="flex flex-col">
                        <h3 className="text-default-fg font-semibold text-lg mb-2">Navegação</h3>
                        <nav className="flex flex-col w-fit gap-2">
                            <TextLink 
                                href="/"
                                size="md"
                                className="text-default-fg!"
                            >
                                Início
                            </TextLink>
                            <TextLink 
                                href="/neutering"
                                size="md"
                                className="text-default-fg!"
                            >
                                Castração
                            </TextLink>
                            <TextLink 
                                href="/emergency"
                                size="md"
                                className="text-default-fg!"
                            >
                                Emergência
                            </TextLink>
                            <TextLink 
                                href="/adoption"
                                size="md"
                                className="text-default-fg!"
                            >
                                Adoção
                            </TextLink>
                        </nav>
                    </div>
                    <div className="flex flex-col md:col-span-2 lg:col-span-1">
                        <h3 className="text-default-fg font-semibold text-lg mb-2">Contato</h3>
                        <div className="flex flex-col gap-4">
    
                            <div className="flex items-center gap-2 text-default-fg text-sm">
                                <span className="text-default-fg!">
                                    <LocationIcon />
                                </span>
                                R. Juíz Orlando Caldelas, no 42 - Parque das Palmeiras, Angra dos Reis - RJ, 23906-470
                            </div>
                            <div className="flex items-center gap-2 text-default-fg text-sm">
                                <span className="text-default-fg!">
                                    <PhoneIcon />
                                </span>
                                (24) 3365-0019
                            </div>
                            <div className="flex items-center gap-2 text-default-fg text-sm">
                                <span className="text-default-fg!">
                                    <EnvelopeIcon />
                                </span>
                                bemestaranimal@angra.rj.gov.br
                            </div>
                        </div>
                    </div>
                </div>
                <div className="w-full border-b border-default-accent-border my-4"></div>
                <div className="flex flex-wrap w-full justify-between gap-2">
                    <p className="text-default-fg text-xs">
                        © 2026 Prefeitura Municipal de Angra dos Reis. Todos os direitos reservados.
                    </p>
                    <nav 
                        aria-label="Menu do Rodapé"
                        className="flex gap-x-4"
                    >
                        <TextLink 
                            size="sm"
                            href="/privacy-policy"
                            variant="default"
                            className="text-default-fg!"
                        >
                            Políticas de Privacidade
                        </TextLink>
                        <TextLink 
                            size="sm"
                            href="/terms-of-use"
                            variant="default"
                            className="text-default-fg!"
                        >
                            Termos de Uso
                        </TextLink>
                    </nav>
                </div>
            </div>
        </footer>
    );
}