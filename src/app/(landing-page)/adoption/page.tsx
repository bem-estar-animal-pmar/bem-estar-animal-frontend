"use client"

import { useEffect, useState, Suspense } from "react"
import { useForm, Controller } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { ApiError } from "@/src/lib/api-error"
import { translateError, translateTable } from "@/src/lib/translation-map"
import { toast } from "@/src/lib/toast-store"

import Image from "next/image"
import pet_avatar_placeholder from "@/public/pet-avatar-placeholder.webp"

import { PublicHeader } from "@/src/components/layout/PublicHeader"
import { PublicFooter } from "@/src/components/layout/PublicFooter"
import { Label, Input, Button, Card, Dialog, Badge } from "@/src/components/ui"
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon"

import { createAdoptionSchema, CreateAdoptionFormData } from "@/src/constants/schemas"
import type { PetForAdoption } from "@/src/constants/interfaces"


interface CreateAdoptionFormProps {
    petId: string;
    onCancel: () => void;
    onSuccess: () => void;
}

const CreateAdoptionForm = ({ petId, onCancel, onSuccess }: CreateAdoptionFormProps) => {
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<CreateAdoptionFormData>({
        resolver: zodResolver(createAdoptionSchema),
        defaultValues: {
            petId: petId,
            adopterName: "",
            adopterEmail: "",
            adopterPhone: "",
            adopterCep: "",
            adopterStreet: "",
            adopterNeighborhood: "",
            adopterCity: "",
            adopterState: "",
            adopterNumber: "",
            // Como o usuário já aceitou os termos no passo 1 do Modal, deixamos true
            termsAccepted: true 
        }
    });

    const handleCreateAdoption = async (data: CreateAdoptionFormData) => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/adoptions/request`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            const dataRes = await response.json();

            if (!response.ok) {
                throw new ApiError(dataRes.message, dataRes.code, dataRes.details);
            }

            toast.success("Pedido de adoção realizado com sucesso!");
            onSuccess();

        } catch (err: unknown) {
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { 
                    message: translateError(err.details?.[0]?.message || err.message)
                });
                return;
            }
            toast.danger("Erro desconhecido", {
                message: "Não foi possível realizar o pedido de adoção."
            });
        }
    };

    return (
        <form 
            // O segundo parâmetro loga os erros do Zod no console se a validação falhar
            onSubmit={handleSubmit(handleCreateAdoption, (errors) => console.log("Erros de validação:", errors))} 
            className="flex flex-col gap-4"
        >
            <div className="flex flex-col gap-2 pt-2">
                <Label htmlFor="adopterName">Nome Completo</Label>
                <Controller
                    name="adopterName"
                    control={control}
                    render={({ field }) => (
                        <Input 
                            id="adopterName"
                            placeholder="João da Silva"
                            {...field}
                            variant={errors.adopterName ? "danger" : "default"}
                        />
                    )}
                />
                {errors.adopterName && <span className="text-danger-fg text-sm">{errors.adopterName.message}</span>}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="adopterEmail">E-mail</Label>
                    <Controller
                        name="adopterEmail"
                        control={control}
                        render={({ field }) => (
                            <Input 
                                id="adopterEmail"
                                type="email"
                                placeholder="joao@email.com"
                                {...field}
                                variant={errors.adopterEmail ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.adopterEmail && <span className="text-danger-fg text-sm">{errors.adopterEmail.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="adopterPhone">Celular</Label>
                    <Controller
                        name="adopterPhone"
                        control={control}
                        render={({ field }) => (
                            <Input 
                                id="adopterPhone"
                                type="tel"
                                placeholder="(24) 99999-9999"
                                {...field}
                                variant={errors.adopterPhone ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.adopterPhone && <span className="text-danger-fg text-sm">{errors.adopterPhone.message}</span>}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="adopterCep">CEP</Label>
                    <Controller
                        name="adopterCep"
                        control={control}
                        render={({ field }) => (
                            <Input 
                                id="adopterCep"
                                placeholder="23900-000"
                                {...field}
                                variant={errors.adopterCep ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.adopterCep && <span className="text-danger-fg text-sm">{errors.adopterCep.message}</span>}
                </div>
                <div className="flex flex-col gap-2 sm:col-span-2">
                    <Label htmlFor="adopterStreet">Rua</Label>
                    <Controller
                        name="adopterStreet"
                        control={control}
                        render={({ field }) => (
                            <Input 
                                id="adopterStreet"
                                placeholder="Rua das Flores"
                                {...field}
                                variant={errors.adopterStreet ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.adopterStreet && <span className="text-danger-fg text-sm">{errors.adopterStreet.message}</span>}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2">
                    <Label htmlFor="adopterNumber">Número</Label>
                    <Controller
                        name="adopterNumber"
                        control={control}
                        render={({ field }) => (
                            <Input 
                                id="adopterNumber"
                                placeholder="123"
                                {...field}
                                variant={errors.adopterNumber ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.adopterNumber && <span className="text-danger-fg text-sm">{errors.adopterNumber.message}</span>}
                </div>
                <div className="flex flex-col gap-2 sm:col-span-3">
                    <Label htmlFor="adopterNeighborhood">Bairro</Label>
                    <Controller
                        name="adopterNeighborhood"
                        control={control}
                        render={({ field }) => (
                            <Input 
                                id="adopterNeighborhood"
                                placeholder="Centro"
                                {...field}
                                variant={errors.adopterNeighborhood ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.adopterNeighborhood && <span className="text-danger-fg text-sm">{errors.adopterNeighborhood.message}</span>}
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col gap-2 sm:col-span-3">
                    <Label htmlFor="adopterCity">Cidade</Label>
                    <Controller
                        name="adopterCity"
                        control={control}
                        render={({ field }) => (
                            <Input 
                                id="adopterCity"
                                placeholder="Angra dos Reis"
                                {...field}
                                variant={errors.adopterCity ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.adopterCity && <span className="text-danger-fg text-sm">{errors.adopterCity.message}</span>}
                </div>
                <div className="flex flex-col gap-2">
                    <Label htmlFor="adopterState">Estado (UF)</Label>
                    <Controller
                        name="adopterState"
                        control={control}
                        render={({ field }) => (
                            <Input 
                                id="adopterState"
                                placeholder="RJ"
                                maxLength={2}
                                {...field}
                                variant={errors.adopterState ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.adopterState && <span className="text-danger-fg text-sm">{errors.adopterState.message}</span>}
                </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
                    Cancelar
                </Button>
                <Button type="submit" variant="primary" disabled={isSubmitting}>
                    {isSubmitting ? (
                        <span className="flex gap-2 items-center"><SpinnerIcon/> Enviando...</span>
                    ) : "Enviar Pedido"}
                </Button>
            </div>
        </form>
    );
};

const AdoptionPageContent = () => {
    const [pets, setPets] = useState<PetForAdoption[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const [currentIndex, setCurrentIndex] = useState(0);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [modalStep, setModalStep] = useState<1 | 2>(1); // 1 = Regras, 2 = Formulário

    useEffect(() => {
        loadPets();
    }, []);

    const loadPets = async () => {
        try {
            setIsLoading(true);
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/pets/adoption`);
            const data = await res.json();

            if (!res.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }
            setPets(data);
        } catch (err: unknown) {
            toast.danger("Erro ao carregar pets", {
                message: "Não foi possível carregar a lista de pets para adoção."
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % pets.length);
    };

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + pets.length) % pets.length);
    };

    const openAdoptionModal = () => {
        setModalStep(1);
        setIsDialogOpen(true);
    };

    const handleAdoptionSuccess = () => {
        setIsDialogOpen(false);
        // Opcional: Atualizar a lista de pets se o backend já remover imediatamente
        loadPets();
        setCurrentIndex(0);
    };

    const activePet = pets[currentIndex];

    return (
        <main className="w-full flex flex-col bg-neutral items-center px-4 sm:px-12 pt-16 min-h-[70vh]">
            <div className="w-full flex justify-between items-center flex-wrap gap-y-2 pb-4 max-w-4xl">
                <h1 className="text-default-fg font-semibold text-xl sm:text-2xl lg:text-3xl text-center lg:text-start w-full">
                    Adoção <span className="text-primary-fg">responsável</span>
                </h1>
            </div>

            <p className="text-muted-fg text-sm sm:text-base pb-8 max-w-4xl text-center lg:text-left w-full">
                Nesta página você pode visualizar os pets do município que estão em busca de um novo lar. Navegue pelos perfis, conheça um pouco sobre eles e realize seu pedido de adoção. Lembre-se: adotar é um ato de amor e muita responsabilidade.
            </p>

            {isLoading ? (
                <div className="w-full flex justify-center items-center h-64">
                    <SpinnerIcon />
                </div>
            ) : pets.length === 0 ? (
                <div className="w-full flex justify-center items-center h-64 text-muted-fg italic">
                    Nenhum pet disponível para adoção no momento.
                </div>
            ) : (
                <div className="flex flex-col items-center w-full max-w-2xl gap-6 mb-12">
                    {/* CARROSSEL */}
                    <div className="flex items-center justify-between w-full gap-4">
                        <Button variant="outline" pill="true" size="sm" onClick={handlePrev} aria-label="Pet anterior">
                            anterior
                        </Button>

                        <Card className="flex flex-col sm:flex-row w-full shadow-md! p-4 gap-6 items-center sm:items-start" size="lg">
                            <Image 
                                className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-xl"
                                src={activePet?.image || pet_avatar_placeholder}
                                alt={`Foto de ${activePet.name}`}
                                width={192}
                                height={192}
                            />
                            <div className="flex flex-col w-full gap-2">
                                <div className="flex w-full items-center justify-between pb-2 border-b border-primary-border border-dashed">
                                    <h3 className="font-bold text-xl text-default-fg truncate">{activePet.name}</h3>
                                    <Badge variant="primary" size="sm" pill="true">
                                        {translateTable(activePet.species)}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm text-muted-fg mt-2">
                                    <p><strong>Raça:</strong> {translateTable(activePet.breed)}</p>
                                    <p><strong>Gênero:</strong> {translateTable(activePet.gender)}</p>
                                    <p><strong>Porte:</strong> {translateTable(activePet.size)}</p>
                                    <p><strong>Peso:</strong> {activePet.weight} kg</p>
                                    <p><strong>Cor:</strong> {activePet.coatColor}</p>
                                    <p><strong>Castrado:</strong> {activePet.isNeutered ? "Sim" : "Não"}</p>
                                </div>
                                
                                <Button 
                                    className="mt-6 w-full sm:w-auto self-start" 
                                    variant="primary" 
                                    onClick={openAdoptionModal}
                                >
                                    Quero Adotar
                                </Button>
                            </div>
                        </Card>

                        <Button variant="outline" pill="true" size="sm" onClick={handleNext} aria-label="Próximo pet">
                            proximo
                        </Button>
                    </div>
                    <p className="text-xs text-muted-fg">Pet {currentIndex + 1} de {pets.length}</p>
                </div>
            )}

            {/* MODAL DE ADOÇÃO */}
            <Dialog 
                size={modalStep === 1 ? "lg" : "md"}
                isOpen={isDialogOpen}
                onClose={() => setIsDialogOpen(false)}
                title={modalStep === 1 ? "Termos de Guarda Responsável" : `Adotar ${activePet?.name}`}
            >
                {modalStep === 1 ? (
                    <div className="flex flex-col gap-4">
                        <div className="bg-gray-50 border border-gray-200 p-4 rounded-md h-[50vh] overflow-y-auto text-sm text-default-fg flex flex-col gap-3">
                            <p className="font-bold">Ao adotar, o tutor compromete-se a:</p>
                            <ol className="list-decimal pl-4 flex flex-col gap-2">
                                <li>Proporcionar ambiente adequado ao animal, respeitando suas características e zelando pelas suas necessidades psicológicas e físicas;</li>
                                <li>Garantir sua saúde fornecendo alimento adequado, abrigo seguro, higiene, vacinas e levando-o regularmente ao veterinário;</li>
                                <li>Garantir sua saúde psicológica fornecendo atenção, carinho e a possibilidade de interagir;</li>
                                <li>Garantir sua segurança, mantendo-o sempre dentro de casa e passeando com coleira e guia (no caso de cães);</li>
                                <li>Jamais abandonar o animal em vias públicas ou em casas fechadas, nem em hipótese alguma maltratá-lo;</li>
                                <li>Não utilizar o animal para fins de guarda comercial, lutas ou experimentação;</li>
                                <li>Identificá-lo com coleira e plaqueta ou microchip;</li>
                                <li>Impedir que o animal procrie, submetendo-o à cirurgia de esterilização (castração);</li>
                                <li>Comunicar imediatamente a Superintendência de Bem-Estar Animal (mudança de endereço, desaparecimento ou morte);</li>
                                <li>Permitir a visita regular do veterinário da Superintendência.</li>
                            </ol>
                            <div className="border-t border-gray-300 pt-3 mt-2">
                                <p className="font-bold">Estou ciente de que:</p>
                                <ul className="list-disc pl-4 mt-2 flex flex-col gap-2">
                                    <li>Um cão ou gato pode viver até 15 anos ou mais;</li>
                                    <li>Maus-tratos é crime (Lei Federal nº 9.605/98);</li>
                                    <li><strong>ATENÇÃO:</strong> Em caso de desistência, o animal NUNCA PODERÁ ser devolvido sem validação da Superintendência para um novo tutor.</li>
                                </ul>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-2">
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancelar</Button>
                            <Button variant="primary" onClick={() => setModalStep(2)}>Li e Concordo</Button>
                        </div>
                    </div>
                ) : (
                    <CreateAdoptionForm 
                        petId={activePet?.id} 
                        onCancel={() => setIsDialogOpen(false)} 
                        onSuccess={handleAdoptionSuccess}
                    />
                )}
            </Dialog>
        </main>
    );
};

export default function AdoptionPage() {
    return (
        <>
            <PublicHeader />
            <Suspense fallback={
                <div className="w-full flex justify-center items-center h-screen bg-neutral">
                    <SpinnerIcon />
                </div>
            }>
                <AdoptionPageContent />
            </Suspense>
            <PublicFooter />
        </>
    );
}