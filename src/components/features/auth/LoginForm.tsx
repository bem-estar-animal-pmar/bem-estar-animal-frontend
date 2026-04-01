"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, sendVerificationEmail } from "@/src/lib/auth-client";

import { toast } from "@/src/lib/toast-store";
import { Input, Button, Label, TextLink, TextButton } from "@/src/components/ui";

export function LoginForm() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
	const [loading, setLoading] = useState(false);

    /* state to handle unverified login and show send email button */
	const [isUnverified, setIsUnverified] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    const handleEmailLogin = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            setIsUnverified(false);
    
            await signIn.email(
                {
                    email,
                    password,
                }, 
                {
                    onSuccess: () => {
                        router.push("/dashboard"); /* push to dashboard on success */
                    },
                    onError: (ctx) => {
    
                        /* this is the status for when user login and is not verified */
                        if(ctx.error.status === 403) {
                            setIsUnverified(true);
                            toast.warning(ctx.error.code, {
                                message: "Verifique seu e-mail para continuar"
                            }); /* ctx is the backend response from better auth routes */
                            setLoading(false);
                            return;
                        }
                        toast.danger(ctx.error.code || ctx.error.message); /* ctx is the backend response from better auth routes */
                        setLoading(false);
                    }
                }
            );
    };

    const handleResendVerification = async () => {
        setResendLoading(true);
        
        await sendVerificationEmail({
            email,
            callbackURL: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/email-verified`
        }, {
            onSuccess: () => {
                toast.info("Novo link enviado! Verifique sua caixa de entrada.");
                setResendLoading(false);
                setIsUnverified(false); /* reset so they can login again */
            },
            onError: (ctx) => {
                toast.danger(ctx.error.code);
                setResendLoading(false);
            }
        });
    };
    
    return (
        <form 
            onSubmit={handleEmailLogin} 
            className="flex flex-col gap-2"
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
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="pb-2"> 
                <div className="flex w-full justify-between mb-1">
                    <Label htmlFor="password">
                        Senha
                    </Label>
                    
                    <TextLink href="/forgot-password" variant="primary" size="sm">
                        Esqueceu sua senha?
                    </TextLink>
                </div>
                <Input
                    id="password"
                    type="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <Button 
                className="w-full"
                type="submit"
                variant="primary"
            >
                {loading ? "Entrando..." : "Entrar na conta"}
            </Button>

            {isUnverified &&
                <div className="w-full text-center">
                    <span className="text-sm font-medium text-danger-fg">Conta ainda não verificada. </span>
                    <TextButton
                        onClick={handleResendVerification}
                        disabled={resendLoading}
                        variant="danger"
                        size="md"
                    >
                        {resendLoading ? "Enviando..." : "Reenviar e-mail de verificação"}
                    </TextButton>
                </div>
            }
        </form>
    );
}