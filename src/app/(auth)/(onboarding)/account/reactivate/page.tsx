"use client";

import Image from "next/image";
import animal_logo from "@/public/animal-logo.svg"
import { useSession, signOut } from "@/src/lib/auth-client";
import { useState, useEffect } from "react";
import { Button, Card, TextButton, TextLink } from "@/src/components/ui";
import { toast } from "@/src/lib/toast-store";
import { useRouter } from "next/navigation";
import { Loading } from "@/src/components/layout/Loading";
import { ApiError } from "@/src/lib/api-error";
import { translateError } from "@/src/lib/error-map";
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon";

export default function ReactivateAccountPage() {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const { data: session, isPending, refetch } = useSession();

    useEffect(() => {
        if (isPending) {
            return;
        }

        if (!session) {
            router.replace("/login");
            return;
        }

        if (session?.user.deletedAt === null) {
            router.replace("/dashboard");
            return;
        }
    }, [session, isPending, router]);
    
    const handleLogout = async () => {
        setIsLoggingOut(true);
        await signOut({
            fetchOptions: {
            onSuccess: () => {
                router.push("/");
            },
            },
        });
        setIsLoggingOut(false);
    };

    const handleReactivateAccount = async () => {
        try {
            setIsLoading(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/reactivate-account`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            const data = await response.json();
            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success("Bem-vindo de volta!", { message: "Conta reativada com sucesso."});
            
            await refetch();

        } catch (err: unknown) { 
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { message: err.details?.[0]?.message || err.message });
                return;
            }
            toast.danger("Erro desconhecido", { message: "Não foi possível reativar sua conta."});
        } finally {
            setIsLoading(false);
        }
    };

    const accountActivated = session?.user.deletedAt === null;

    if (isPending && !session) {
        return <Loading />;
    }

    if (session?.user.deletedAt === null || session?.user.deletedAt === undefined) {
        return <Loading />;
    }

    const formattedDate = new Date(session.user.deletedAt).toLocaleDateString("pt-BR", {day: "2-digit", month: "long", year: "numeric"});

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
                        Conta Desativada
                    </h1>

                    <p className="text-xs sm:text-sm text-muted-fg font-medium pb-4 text-justify"> 
                        Você desativou o acesso a esta conta em <strong>{formattedDate}</strong>. Essa conta será automaticamente deletada em breve. 
                        Para continuar utilizando os serviços da plataforma, é necessário reativá-la.
                    </p>


                    <div className="w-full flex flex-col text-center py-4 gap-2">
                        <Button
                            variant="primary"
                            onClick={handleReactivateAccount}
                            disabled={isLoading || accountActivated || isLoggingOut}
                        >
                            {isLoading ? 
                                <span className="gap-1 flex items-center">
                                    <SpinnerIcon/> "Reativando..."
                                </span>
                                : 
                                "Desejo reativar minha conta"
                            }
                        </Button>
                        <TextButton
                            onClick={handleLogout}
                            disabled={isLoggingOut || accountActivated}
                            variant="danger"
                            className="self-center"
                        >
                            Voltar
                        </TextButton>
                    </div>
                </Card>
        </main>
    );
}