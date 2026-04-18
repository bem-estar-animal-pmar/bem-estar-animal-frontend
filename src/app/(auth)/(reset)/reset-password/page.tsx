"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { resetPassword } from "@/src/lib/auth-client";
import { toast } from "@/src/lib/toast-store";

import Image from "next/image";
import animal_logo from "@/public/animal-logo.svg"

import { Card } from "@/src/components/ui/Card";
import { Loading } from "@/src/components/layout/Loading";
import { ResetPasswordForm } from "@/src/components/features/auth/ResetPasswordForm";
import type { ResetPasswordFormData } from "@/src/components/features/auth/ResetPasswordForm";
import { translateError } from "@/src/lib/error-map";

/* even though this is a client component, next.js still tries to pre-render it on the server at build time to generate a fast, 
static HTML file to send to the user immediately 

in this specific case, on build time, pre-render will fail and cause build errors because useSearchParams() which strictly only runs on 
client

the solution for this is wrapping the page around a <Suspense> element from React, when building this static HTML file, next won't try 
to run the code inside here, it'll  just put the fallback HTML in its place until it goes to the client 

suspense cannot be wrapped inside the same component where the useSearchParams is because it needs to PREVENT it to run, so we make it
wrapped around the component */

const ResetPasswordContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();

    /* get the token from the params url */
    const token = searchParams.get("token");
    
    useEffect(() => {
        if (!token) {
            router.replace("/forgot-password"); 
        }
    }, [token, router]);

    if (!token) {
		return (
			<Loading />
		);
    }

    const handleReset = async (formData: ResetPasswordFormData) => {
        const { data, error } = await resetPassword({
            newPassword: formData.password,
            token: token
        });

        if (error?.code) {
            toast.danger(translateError(error.code));
            return;
        } 

        toast.success("Senha alterada com sucesso, redirecionando para login.");
        router.push("/login");
    }

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
                <h1 className="text-center text-lg text-default-fg font-semibold pb-1">
					Alteração de senha
				</h1>
				<p className="text-center text-sm text-muted-fg font-medium pb-8"> 
					O token foi efetivado com sucesso. Digite a nova senha desejada.
				</p>
                <div className="w-full max-w-120 justify-self-center">
                    <ResetPasswordForm handleReset={handleReset} />
                </div>
            </Card>
        </main>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<Loading/>}>
            <ResetPasswordContent/>
        </Suspense>
    );
}