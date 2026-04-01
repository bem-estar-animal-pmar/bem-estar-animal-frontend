"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "@/src/lib/auth-client";
import { useEffect, useState, Suspense } from "react";

import { Loading } from "@/src/components/layout/Loading";
import { Card, TextButton } from "@/src/components/ui";

/* even though this is a client component, next.js still tries to pre-render it on the server at build time to generate a fast, 
static HTML file to send to the user immediately 

in this specific case, on build time, pre-render will fail and cause build errors because useSearchParams() which strictly only runs on 
client

the solution for this is wrapping the page around a <Suspense> element from React, when building this static HTML file, next won't try 
to run the code inside here, it'll  just put the fallback HTML in its place until it goes to the client 

suspense cannot be wrapped inside the same component where the useSearchParams is because it needs to PREVENT it to run, so we make it
wrapped around the component */

const EmailVerifiedContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    /* try to get session to check if user is really verified */
    const { data: session, isPending } = useSession(); 
    
    /* if there is any error, get it it here from the params url */
    const error = searchParams.get("error");

    /* when switching tabs on browser better auth tends to recall useSession to get new session data, to prevent the 'loading' 
    component to flicker, we usually do if(isPending && !session), but in this specific page, session sometimes can be null 
    forever, and pending would still reload, so we need a state that says the first attempt on getting session already happened */
    const [initialLoadPending, setInitialLoadPending] = useState(true);

    /* time left before redirect */
    const [timeLeft, setTimeLeft] = useState(5);

    const targetUrl = error || !session?.user?.emailVerified ? "/login" : "/dashboard";

    useEffect(() => { /* the moment isPending becomes false for the first time, flip initialLoad */
        if (!isPending && initialLoadPending) {
            setInitialLoadPending(false);
        }
    }, [isPending, initialLoadPending]);

    useEffect(() => {
        /* if it's loading, don't start the timer yet */
        if (initialLoadPending) {
            return;
        }

        /* update time left */
        const interval = setInterval(() => {
            setTimeLeft((prev) => prev > 0 ? prev - 1 : prev);
        }, 1000);

        /* cleanup functions */
        return () => {
            clearInterval(interval);
        };
        
    }, [initialLoadPending]);

    useEffect(() => {
        if (timeLeft === 0) {
            router.replace(targetUrl);
            return;
        }
    }, [router, timeLeft, targetUrl]);

    if (initialLoadPending) {
        return (
            <Loading />
        );
    }

    /* first case: the backend returned an error in the params, that means the link is expired or invalid */
    if (error) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-default p-2 sm:p-8 md:p-12">
                <Card className="max-w-200" size="xl">
                    <div className="flex w-full justify-center">
                        {/* image logo goes here
                        <Image
                            src={logo}
                            alt="Logo"
                            className="dark:hidden w-full max-w-50 h-auto mb-2"
                        />
                        <Image
                            src={logo_dark}
                            alt="Logo"
                            className="hidden dark:block w-full max-w-50 h-auto mb-2"
                        /> */}
                    </div>
                    <h1 className="p-4 text-center text-2xl font-semibold text-default-fg">
                        Link Inválido
                    </h1>

                    <p className="pb-2 text-muted-fg text-center">
                        Esse link de confirmação expirou ou é inválido. Tente novamente.
                    </p>

                    <p className="pb-8 text-sm text-default-fg text-center">
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

    /* second case: the user is logged in and really is verified */
    if (session?.user.emailVerified) {
        return (
            <main className="flex min-h-screen items-center justify-center bg-default p-2 sm:p-8 md:p-12">
                <Card className="max-w-200" size="xl">
                    <div className="flex w-full justify-center">
                        {/* image logo goes here
                        <Image
                            src={logo}
                            alt="Logo"
                            className="dark:hidden w-full max-w-50 h-auto mb-2"
                        />
                        <Image
                            src={logo_dark}
                            alt="Logo"
                            className="hidden dark:block w-full max-w-50 h-auto mb-2"
                        /> */}
                    </div>
                    <h1 className="p-4 text-center text-2xl font-semibold text-success-fg">
                        Email Verificado!
                    </h1>

                    <p className="pb-2 text-muted-fg text-center">
                        Sua conta foi ativada com sucesso. Você já pode acessar a área do usuário.
                    </p>

                    <p className="pb-8 text-sm text-default-fg text-center">
                        Redirecionando para dashboard em {timeLeft}s...
                    </p>

                    <TextButton
                        className="w-full justify-center mb-2"
                        onClick={() => router.replace('/dashboard')}
                        variant="primary"
                    >
                        Voltar para dashboard agora
                    </TextButton>
                </Card>
            </main>
        );
    }

    /* third case: the user is not logged in and we cant check if they are verified or just manually accessed this page */
    return (
        <main className="flex min-h-screen items-center justify-center bg-default p-2 sm:p-8 md:p-12">
            <Card className="max-w-200" size="xl">
                <div className="flex w-full justify-center">
                    {/* image logo goes here
                    <Image
                        src={logo}
                        alt="Logo"
                        className="dark:hidden w-full max-w-50 h-auto mb-2"
                    />
                    <Image
                        src={logo_dark}
                        alt="Logo"
                        className="hidden dark:block w-full max-w-50 h-auto mb-2"
                    /> */}
                </div>
                <h1 className="p-4 text-center text-2xl font-semibold text-success-fg">
                    Email Verificado!
                </h1>

                <p className="pb-2 text-muted-fg text-center">
                    Sua conta foi ativada com sucesso. Faça login para continuar.
                </p>

                <p className="pb-8 text-sm text-default-fg text-center">
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

export default function EmailVerifiedPage() {
    return (
        <Suspense fallback={<Loading/>}>
            <EmailVerifiedContent />
        </Suspense>
    );
}