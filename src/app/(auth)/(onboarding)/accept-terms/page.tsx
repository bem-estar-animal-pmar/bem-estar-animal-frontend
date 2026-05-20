"use client";

import Image from "next/image";
import animal_logo from "@/public/animal-logo.svg"
import { CURRENT_TERMS_OF_SERVICE_VERSION, CURRENT_PRIVACY_POLICY_VERSION } from "@/src/constants/constants";
import { useSession, signOut } from "@/src/lib/auth-client";
import { useState, useEffect } from "react";
import { Button, Card, TextButton, TextLink } from "@/src/components/ui";
import { toast } from "@/src/lib/toast-store";
import { useRouter } from "next/navigation";
import { Loading } from "@/src/components/layout/Loading";
import { ApiError } from "@/src/lib/api-error";
import { translateError } from "@/src/lib/translation-map";

export default function AcceptTermsPage() {

    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);
    const [isAccepting, setIsAccepting] = useState(false);
    const { data: session, isPending, error, refetch } = useSession();

    useEffect(() => {
        if (isPending) {
            return;
        }

        if (!session) {
            router.replace("/login");
            return;
        }

        if ((session?.user.termsAcceptedAt && session?.user.privacyAcceptedAt) || session.user.role === "ADMIN") {
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

    const handleAcceptTerms = async () => {
        try {
            setIsAccepting(true);

            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/reaccept-terms`,
                {
                    method: "POST",
                    credentials: "include",
                }
            );

            const data = await response.json();
            if (!response.ok) {
                throw new ApiError(data.message, data.code, data.details);
            }

            toast.success("Termos aceitos com sucesso.");
            await refetch();

        } catch (err: unknown) { 
            if (err instanceof ApiError) {
                toast.danger(translateError(err.code), { message: translateError(err.details?.[0]?.message || err.message) });
                return;
            }
            toast.danger("Erro desconhecido ao aceitar os termos.");
        } finally {
            setIsAccepting(false);
        }
    };

    const termsAccepted = (session?.user.termsAcceptedAt && session?.user.privacyAcceptedAt ? true : false);

    if (isPending && !session) {
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
                        Ação necessária
                    </h1>

                    <p className="text-xs sm:text-sm text-muted-fg font-medium pb-4"> 
                        Para continuar para o sistema do Bem-estar Animal, é necessário que você leia e aceite a <strong>política de privacidade</strong> e os <strong>termos de uso</strong> mais recentes.
                    </p>

                    <div className="flex gap-1 flex-col">
                        <TextLink
                            href="/terms-of-service"
                            target="_blank"
                        >
                            Termos de uso - {CURRENT_TERMS_OF_SERVICE_VERSION}
                        </TextLink>
                        
                        <TextLink
                            href="/privacy-policy"
                            target="_blank"
                        >
                            Política de privacidade - {CURRENT_PRIVACY_POLICY_VERSION}
                        </TextLink>
                    </div>



                    <div className="w-full flex flex-col text-center py-4 gap-2">
                        <Button
                            variant="primary"
                            onClick={handleAcceptTerms}
                            disabled={isAccepting || termsAccepted}
                        >
                            {isAccepting
                                ? "Confirmando..."
                                : "Li e concordo."}
                        </Button>
                        <TextButton
                            onClick={handleLogout}
                            disabled={isLoggingOut || termsAccepted}
                            variant="danger"
                            className="self-center"
                        >
                            Sair
                        </TextButton>
                    </div>
                </Card>
        </main>
    );
}