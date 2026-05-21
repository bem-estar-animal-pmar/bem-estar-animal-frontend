"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "@/src/lib/auth-client";
import { ApiError } from "@/src/lib/api-error";
import { useRouter } from "next/navigation";
import { translateTable, translateError } from "@/src/lib/translation-map";
import { toast } from "@/src/lib/toast-store";

import Image from "next/image";
import pet_avatar_placeholder from "@/public/pet-avatar-placeholder.webp"

import { Button, ButtonLink, Badge, Dialog, Card, InfoPopUp, DetailsField, Input, Label } from "@/src/components/ui";
import { CreatePetForm } from "@/src/components/features/dashboard/CreatePetForm";

import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";
import { GearIcon, LogoutIcon, SquareArrowUpRightIcon, XIcon } from "@/src/components/icons/outline";

import type { Pet } from "@/src/constants/interfaces"

export default function DashboardPage() {

    const { data: session, error } = useSession();
    const router = useRouter();
    
    const [pets, setPets] = useState<Pet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [fetchError, setFetchError] = useState(false);

    const [isConfigDialogOpen, setIsConfigDialogOpen] = useState(false);
    const [isRevokingTerms, setIsRevokingTerms] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [revokeTermsConfirmation, setRevokeTermsConfirmation] = useState("");
    
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    useEffect(() => {
        fetchPets();
    }, []);

    const fetchPets = async () => {
        setIsLoading(true);
        setFetchError(false);
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/me`, {
                credentials: "include",
            });

            const data = await response.json();

            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            setPets(data);
        } catch (err: unknown) { 
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível carregar pets."
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handlePetCreated = () => {
        setIsDialogOpen(false);
        fetchPets();
    };

    const handleRevokeTerms = async () => {
        try {
            setIsRevokingTerms(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/revoke-terms`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success("Aceite revogado com sucesso.");
            router.push("/login");

        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível revogar termos."
            });
        } finally {
            setIsRevokingTerms(false);
        }
    };

    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut({
            fetchOptions: {
            onSuccess: () => {
                router.push("/");
            },
            },
        });
    };

    const isAdmin = session?.user.role === "ADMIN" || session?.user.role === "MANAGER"

    return (
        <div className="w-full flex flex-col h-[calc(100vh-108px)] sm:h-[calc(100vh-136px)] overflow-clip">
            <section className="w-full flex justify-between items-center flex-wrap gap-y-2 pb-4">
                <h1 className="text-default-fg font-semibold text-xl sm:text-2xl lg:text-3xl text-center lg:text-start">
                    Bem-vindo (a), <span className="text-primary-fg">{session?.user.name}</span>!
                </h1>

                <div className="flex gap-2 items-center">
                    <Button 
                        variant="primary" 
                        pill="true"
                        onClick={() => setIsDialogOpen(true)}
                        size="sm"
                    >
                        + Cadastrar novo pet
                    </Button>
                    <Button
                        variant="ghost-default"
                        size="sm"
                        onClick={() => setIsConfigDialogOpen(true)}
                        className="w-fit! px-1.5! active:rotate-90 hover:rotate-90 transition-transform duration-500"
                        pill="true"
                    >
                        <GearIcon/>
                    </Button>
                    <Button
                        variant="ghost-default"
                        size="sm"
                        onClick={handleLogout}
                        className="w-fit! px-2! gap-1 text-danger-fg! hover:text-btn-danger-fg! hover:bg-btn-danger!"
                        disabled={isLoggingOut}
                    >
                        <LogoutIcon/>
                    </Button>
                </div>
            </section>
            
            <section className="flex flex-col pb-4">
                <p className="text-muted-fg text-sm sm:text-base max-w-316 mb-1">
                    Esta é sua área do usuário, aqui você pode ver detalhes sobre seus pets cadastrados, cadastrar novos pets e agendar 
                    consultas para eles.
                </p>
                <p className="text-muted-fg text-sm sm:text-base max-w-316 mb-2">
                    Se você cadastrou um pet por engano ou precisa mudar algum dado importante, por favor, 
                    entre em contato com a clínica para realizar a edição / remoção do pet.
                </p>
                <div className="flex gap-2 justify-between items-center">
                    <p className="text-muted-fg text-xs sm:text-sm">
                        No momento você 
                        {pets.length > 0 ? ` tem ${pets.length} pet${pets.length === 1 ? "" : "s"}.` : " ainda não tem pets cadastrados."}

                    </p>
                    {isAdmin && (
                        <ButtonLink
                            href="/admin/dashboard/"
                            pill="true"
                            variant="outline"
                            className="flex gap-1 text-xs sm:text-sm"
                        >
                            Painel do administrador <SquareArrowUpRightIcon size={18} />
                        </ButtonLink>
                    )}
                </div>
            </section>

            {pets.length === 0 &&
                <div className="flex flex-col items-center justify-center p-4 min-h-88 border-2 border-dashed border-primary-border 
                    bg-card rounded-xl gap-y-4">
                    {isLoading ? 
                        <div className="flex justify-center">
                            <SpinnerIcon /> 
                        </div>
                        : 
                        fetchError ? 
                            <>
                                <div className="text-5xl text-muted-fg">
                                    <XIcon size={40}/>
                                </div>
                                <h2 className="text-default-fg font-medium">
                                    Erro ao carregar pets
                                </h2>
                                <Button
                                    variant="outline" 
                                    pill="true"
                                    onClick={fetchPets}
                                >
                                    Tentar novamente
                                </Button>
                            </>
                            :
                            <>
                                <div className="text-5xl">
                                    <XIcon size={32}/>
                                </div>
                                <h2 className="text-default-fg font-medium">
                                    Nenhum pet cadastrado
                                </h2>
                                <Button
                                    variant="outline" 
                                    pill="true"
                                    onClick={() => setIsDialogOpen(true)}
                                >
                                    Cadastrar meu primeiro pet
                                </Button>
                            </>
                    }
                </div>            
            }
            
            {/* must update the pet display here */}
            {pets.length !== 0 && 
                <div className="border-2 border-dashed border-default-border rounded-xl overflow-y-auto">
                    <div className="flex flex-col w-full max-w-184 justify-self-center justify-center p-4 gap-4">
                        {pets.map((pet) => (
                            <Card 
                                key={pet.id}
                                className="shadow-sm!"
                                size="lg"
                            >
                                <div className="flex w-full">
                                    <Image 
                                        className="max-w-24 self-start justify-self-center rounded-full"
                                        src={pet_avatar_placeholder}
                                        alt="Foto de perfil do pet"
                                    />
                                    <div className="flex flex-col w-full pl-2"> 
                                        <div className="flex w-full flex-wrap items-center justify-between gap-y-3 gap-2 pb-2">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium text-base sm:text-lg text-default-fg truncate">
                                                    {pet.name}
                                                </h3>
                                                <Badge
                                                    variant="primary"
                                                    size="sm"
                                                    pill="true"
                                                >
                                                    {translateTable(pet.species)}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="text-xs sm:text-sm text-muted-fg flex truncate">
                                                    {translateTable(pet.homeStatus)}
                                                </p>
                                                {pet.adoptionStatus !== "NONE" && (
                                                    <>
                                                        <Badge>
                                                            {translateTable(pet.adoptionStatus)}
                                                        </Badge>
                                                        <InfoPopUp>
                                                            {pet.adoptionStatus === "FOR_ADOPTION" ? 
                                                                "Esse pet foi colocado para adoção à pedido do tutor. Caso queira desistir entre em contato com a clínica para remover o pet da vitrine."
                                                                :
                                                                "Esse pet foi adotado, o registro dele é mantido no perfil do tutor original. Entre em contato com a clínica para saber detalhes sobre a adoção."
                                                            }
                                                        </InfoPopUp>
                                                    </>
                                                )}

                                            </div>

                                        </div>      
                                        <div className="flex w-full flex-wrap justify-between max-w-104 gap-2 pb-2">
                                            <div className="flex flex-col max-w-48">   
                                                <p className="text-xs sm:text-sm text-muted-fg flex truncate">
                                                    Raça: {translateTable(pet.breed)}
                                                </p>
                                                <p className="text-xs sm:text-sm text-muted-fg flex">
                                                    Genero: {translateTable(pet.gender)}
                                                </p>
                                            </div>
                                            <div className="flex flex-col">   
                                                <p className="text-xs sm:text-sm text-muted-fg flex truncate">
                                                    Peso: {pet.weight} kg ({translateTable(pet.size)})
                                                </p>
                                                <p className="text-xs sm:text-sm text-muted-fg flex">
                                                    Cor da pelagem: {pet.coatColor}
                                                </p>
                                            </div>
                                        </div>                           
                                    </div>
                                </div>
                                <div className="flex w-full justify-between flex-wrap gap-y-2">
                                    <div className="flex flex-col w-full max-w-52">   
                                        <p className="text-xs sm:text-sm text-muted-fg flex truncate">
                                            Nascimento: {pet.birthDate.split('T')[0].split('-').reverse().join('/')}
                                        </p>
                                        <p className="text-xs sm:text-sm text-muted-fg text-end flex">
                                            Identificação: {pet.chip === "NO_CHIP" ? "Sem chip" : pet.chip}
                                        </p>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                            {pet.adoptionStatus === "ADOPTED" ?
                                                <span className="text-xs text-default-fg italic">Nenhuma ação disponível.</span>
                                            :
                                                ""}
                                            {pet.isNeutered === true ? 
                                                <Badge
                                                    size="md"
                                                >
                                                    Pet castrado
                                                </Badge>
                                            : 
                                            pet.adoptionStatus !== "ADOPTED" ?
                                                <ButtonLink
                                                    variant="outline"
                                                    size="sm"
                                                    href={`/rules/neutering-rules?petId=${pet.id}`}
                                                >
                                                    Agendar castração
                                                </ButtonLink>
                                                :
                                                ""
                                            }
                                            {pet.allowEmergency === true && pet.adoptionStatus !== "ADOPTED" ? 
                                                <ButtonLink
                                                    variant="primary"
                                                    size="sm"
                                                    href={`/rules/emergency-rules?petId=${pet.id}`}
                                                >
                                                    Agendar consulta
                                                </ButtonLink>
                                            : 
                                                ""
                                            }
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div> 
                </div>
            }

            <Dialog
                className="text-sm! sm:text-base! max-w-132!"
                isOpen={isDialogOpen}
                size="md"
                onClose={() => setIsDialogOpen(false)}
                title="Cadastrar novo pet"
            > 
                <CreatePetForm 
                    onSuccess={handlePetCreated} 
                    onCancel={() => setIsDialogOpen(false)} 
                />
            </Dialog>

            <Dialog
                isOpen={isConfigDialogOpen}
                onClose={() => setIsConfigDialogOpen(false)}
                title="Painel de administração"
                size="lg"
            >
                <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2 text-sm sm:text-base text-muted-fg pt-4">
                        <h3 className="text-default-fg text-sm sm:text-base font-semibold border-b border-default-border pb-2">
                            Termos de Serviço e Política de Privacidade
                        </h3>
                        <div className="flex flex-col gap-1">
                            <div className="flex flex-col sm:flex-row gap-1 justify-between">
                                <DetailsField
                                    title="Versão dos Termos:"
                                >
                                    {session?.user.termsVersion ?? "N/A"}
                                </DetailsField>            
                                <DetailsField
                                    title="Aceito em:"
                                >
                                    {session?.user.termsAcceptedAt
                                        ? new Date(session.user.termsAcceptedAt)
                                            .toLocaleDateString("pt-BR")
                                        : "N/A"
                                    }
                                </DetailsField>                       
                            </div>
                            <div className="flex flex-col sm:flex-row gap-1 justify-between">
                                <DetailsField
                                    title="Versão da Política de Privacidade:"
                                >
                                    {session?.user.privacyVersion ?? "N/A"}
                                </DetailsField>     
                                <DetailsField
                                    title="Aceito em:"
                                >
                                    {session?.user.privacyAcceptedAt
                                        ? new Date(session.user.privacyAcceptedAt)
                                            .toLocaleDateString("pt-BR")
                                        : "N/A"
                                    }
                                </DetailsField>                       
                            </div>
                        </div>

                        <p className="text-xs sm:text-sm italic">
                            Ao revogar o aceite, sua sessão será encerrada imediatamente e o acesso às funcionalidades da plataforma será bloqueado até um novo aceite.
                        </p>

                        <Label

                        >
                            Digite: eu-{session?.user.name.split(" ")[0].toLowerCase()}-desejo-revogar-a-aceitação-dos-termos
                        </Label>
                        <Input
                            id="name"
                            value={revokeTermsConfirmation}
                            onChange={(e: any) => setRevokeTermsConfirmation(e.target.value)}
                            placeholder="Digite o texto para continuar..."
                            maxLength={100}
                        />
                        <Button
                            variant="danger"
                            onClick={handleRevokeTerms}
                            disabled={isRedirecting || isRevokingTerms || revokeTermsConfirmation !== `eu-${session?.user.name.split(" ")[0].toLowerCase()}-desejo-revogar-a-aceitação-dos-termos`}
                        >
                            {isRevokingTerms ? 
                                <span className="flex gap-2 items-center">
                                    <SpinnerIcon/> Revogando... 
                                </span>
                                : 
                                "Revogar aceite"
                            }
                        </Button>
                    </div>

                    <div className="flex flex-col gap-2 text-sm sm:text-base text-muted-fg pt-4">
                        <h3 className="text-default-fg text-sm sm:text-base font-semibold border-b border-default-border pb-2">
                            Acesso à Conta e Privacidade
                        </h3>

                        <p className="text-xs sm:text-sm">
                            Você tem o direito de desativar sua conta e posteriormente apagar todos os seus dados da plataforma, para saber mais clique no botão abaixo.
                        </p>
                        <Button
                            variant="danger"
                            onClick={() => {
                                setIsRedirecting(true);
                                router.push("/account/deactivate");
                            }}
                            disabled={isRedirecting || isRevokingTerms}
                        >
                            {isRedirecting ? 
                                <span className="flex gap-2 items-center">
                                    <SpinnerIcon/> Carregando... 
                                </span>
                                : 
                                <span className="flex gap-2 items-center">
                                    Continuar para desativar <SquareArrowUpRightIcon/>
                                </span>
                            }
                        </Button>
                    </div>
                    
                    <Button
                        variant="outline"
                        onClick={() => setIsConfigDialogOpen(false)}
                        className="text-danger-fg border-danger-accent-border! hover:text-danger-fg! hover:bg-danger!"
                    >
                        Voltar
                    </Button>

                </div>
            </Dialog>
        </div>
    );
}
