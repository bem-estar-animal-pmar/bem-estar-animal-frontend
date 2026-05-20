"use client"; /* we use client here because login page does not need SEO */

import { useState } from "react";
import { requestPasswordReset } from "@/src/lib/auth-client";
import { toast } from "@/src/lib/toast-store";
import { translateError } from "@/src/lib/translation-map";

import Image from "next/image";
import animal_logo from "@/public/animal-logo.svg"

import { Card, Button, Label, Input, TextLink } from "@/src/components/ui";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRequestReset = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setLoading(true);
        
        await requestPasswordReset({
            email,
            redirectTo: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/reset-password`
        }, {
            onSuccess: () => {
                toast.success("E-mail de verificação enviado", {
                    message: "Enviaremos um e-mail com o passo a passo para o reset de sua senha caso seu e-mail esteja cadastrado no nosso sistema."
                })
                setLoading(false);
            },
            onError: (ctx) => {
                toast.danger(translateError(ctx.error.code), {
                    message:  translateError(ctx.error.message)
                });
                setLoading(false);
            }
        });
    };

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
                    Esqueci minha senha
                </h1>
                <p className="text-center text-xs text-muted-fg font-medium pb-8"> 
                    Informe seu e-mail cadastrado no sistema.
                </p>
                <form 
                    onSubmit={handleRequestReset} 
                    className="flex flex-col gap-2 w-full max-w-120 justify-self-center"
                >
                    <div className="pb-2"> 
                        <Label htmlFor="email">
                            E-mail
                        </Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="seu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>      
                    <Button 
                        className="w-full"
                        type="submit"
                        variant="primary"
                    >
                        {loading ? "Enviando..." : "Enviar"}
                    </Button>       
                    <div className="w-full text-center py-2">
                        <TextLink href="/login" variant="primary">
                            Voltar para login
                        </TextLink>
                    </div>     
                </form>
            </Card>
        </main>
    );
}