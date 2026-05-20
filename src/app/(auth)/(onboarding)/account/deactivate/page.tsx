"use client";

import Image from "next/image";
import animal_logo from "@/public/animal-logo.svg"
import { useSession, signOut } from "@/src/lib/auth-client";
import { useState, useEffect } from "react";
import { Button, Card, Input, Label, TextButton, TextLink } from "@/src/components/ui";
import { toast } from "@/src/lib/toast-store";
import { useRouter } from "next/navigation";
import { Loading } from "@/src/components/layout/Loading";
import { ApiError } from "@/src/lib/api-error";
import { translateError } from "@/src/lib/error-map";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";

export default function DeactivateAccountPage() {
    const router = useRouter();
    const { data: session, isPending, refetch } = useSession();

    const [isReturning, setIsReturning] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [deactivateConfirmation, setDeactivateConfirmation] = useState("");

    useEffect(() => {
        if (isPending) {
            return;
        }

        if (!session) {
            router.replace("/login");
            return;
        }

        if (session?.user.deletedAt !== null) {
            router.replace("/");
            return;
        }
    }, [session, isPending, router]);
    
    const handleReturn = async () => {
        setIsReturning(true);
        router.replace("/dashboard");
    };

    const handleDeactivateAccount = async () => {
        try {
            setIsLoading(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/deactivate-account`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            const data = await response.json();
            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.warning("Conta desativada.", { message: "Sua conta foi desativada e será excluída em breve."});
            
            router.replace("/login");

        } catch (err: unknown) { 
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { message: err.details?.[0]?.message || err.message });
                return;
            }
            toast.danger("Erro desconhecido", { message: "Não foi possível desativar sua conta."});
        } finally {
            setIsLoading(false);
        }
    };

    const accountDeactivated = session?.user.deletedAt !== null;

    if (isPending && !session) {
        return <Loading />;
    }

    if (accountDeactivated) {
        return <Loading />;
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-default p-2 sm:p-8 md:p-12">
                <Card className="max-w-120" size="xl">
                    <div className="flex w-full justify-center">
                        <Image
                            src={animal_logo}
                            alt="Logo do Bem-estar Animal"
                            className="w-full max-w-50 h-auto mb-4"
                        />
                    </div>

                    <h1 className="text-center text-lg text-default-fg font-semibold pb-2">
                        Desativar Conta
                    </h1>

                    <p className="text-xs sm:text-sm text-muted-fg font-medium pb-2 text-justify"> 
                        Ao desativar sua conta, ela ficará inacessível e seus agendamentos pendentes serão <strong>cancelados</strong> imediatamente.
                    </p>
                    <p className="text-xs sm:text-sm text-muted-fg font-medium pb-4 text-justify">
                        Após 1 mês de carência, se você não possuir histórico clínico concluído, seus dados serão apagados permanentemente.
                    </p>
                    <p className="text-xs sm:text-sm text-muted-fg font-medium pb-4 text-justify">
                        Caso possua prontuários médicos, os dados serão retidos e bloqueados conforme exigência legal do Conselho de Medicina Veterinária.
                    </p>

                    <Label

                    >
                        Digite: eu-{session?.user.name.split(" ")[0].toLowerCase()}-desejo-desativar-minha-conta
                    </Label>
                    <Input
                        id="name"
                        value={deactivateConfirmation}
                        onChange={(e: any) => setDeactivateConfirmation(e.target.value)}
                        placeholder="Digite o texto de confirmação..."
                        maxLength={100}
                    />

                    <div className="w-full flex flex-col text-center py-4 gap-2">
                        <Button
                            variant="danger"
                            onClick={handleDeactivateAccount}
                            disabled={isLoading || accountDeactivated || isReturning || deactivateConfirmation !== `eu-${session?.user.name.split(" ")[0].toLowerCase()}-desejo-desativar-minha-conta`}
                        >
                            {isLoading ? 
                                <span className="gap-1 flex items-center">
                                    <SpinnerIcon/> "Desativando..."
                                </span>
                                : 
                                "Desejo desativar minha conta"
                            }
                        </Button>
                        <TextButton
                            onClick={handleReturn}
                            disabled={isReturning || accountDeactivated}
                            variant="default"
                            className="self-center"
                        >
                            Voltar para dashboard
                        </TextButton>
                    </div>
                </Card>
        </main>
    );
}