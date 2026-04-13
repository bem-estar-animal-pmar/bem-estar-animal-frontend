"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

import Image from "next/image";
import animal_logo from "@/public/animal-logo.svg"

import { Card, TextButton } from "@/src/components/ui";

export default function CheckEmailPage() {
    const router = useRouter();

    /* time left before redirect */
    const [timeLeft, setTimeLeft] = useState(5);

    useEffect(() => {
        /* add a countdown to timeLeft */
        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);

        /* cleanup function */
        return () => clearInterval(interval);
    }, []); /* runs only once on mount */

    useEffect(() => {
        if (timeLeft === 0) {
            router.replace("/login");
            return;
        }
    }, [router, timeLeft]);

    return (
        <main className="flex min-h-screen items-center justify-center bg-default p-2 sm:p-8 md:p-12">
            <Card className="max-w-200" size="xl">
                <div className="flex w-full justify-center">
					<Image
						src={animal_logo}
						alt="Logo do Bem-estar Animal"
						className="w-full max-w-50 h-auto mb-2"
					/>
                </div>
                <h1 className="p-4 text-center text-2xl font-semibold text-default-fg">
                    Verifique seu e-mail
                </h1>

                <p className="pb-2 text-muted-fg text-center">
                    Enviamos um link de confirmação para o seu endereço de e-mail. Por favor, clique no link para ativar sua conta.
                </p>

                <p className="pb-8 text-sm text-muted-fg text-center">
                    Não recebeu? Verifique sua pasta de spam ou lixo eletrônico.
                </p>

                <p className="pb-2 text-sm text-default-fg text-center">
                    Redirecionando para login em {timeLeft}s...
                </p>

                <TextButton
                    className="w-full justify-center mb-2"
                    onClick={() => router.replace('/login')}
                    variant="primary"
                >
                    Voltar para login agora
                </TextButton>
            </Card>
        </main>
    );
}