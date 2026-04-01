"use client";

import { Card, TextLink } from "@/src/components/ui";
import { LoginForm } from "@/src/components/features/auth/LoginForm";

export default function LoginPage() {
    return (
        <main className="flex min-h-screen items-center justify-center bg-default p-2 sm:p-8 md:p-12">
                <Card className="max-w-120" size="xl">
                    <div className="flex w-full justify-center">
                        {/* logo image goes here
                        <Image
                            src={logo}
                            alt="Logo"
                            className="dark:hidden w-full max-w-50 h-auto mb-8"
                        />
                        <Image
                            src={logo_dark}
                            alt="Logo"
                            className="hidden dark:block w-full max-w-50 h-auto mb-8"
                        /> */}
                    </div>

                    <h1 className="text-center text-lg text-default-fg font-semibold">
                        Entrar em Veterinária São Bento
                    </h1>

                    <p className="text-center text-xs text-muted-fg font-medium"> 
                        Faça login para acessar a área do cliente
                    </p>

                    <div className="py-4">
                        <LoginForm/>
                    </div>

                    <div className="flex pb-4 px-2 items-center">
                        <div className="grow border-b border-muted-fg"></div>
                        <span className="shrink px-4 text-muted-fg text-sm">ou</span>
                        <div className="grow border-b border-muted-fg"></div>
                    </div>

                    <div className="w-full text-center py-4">
                        <span className="text-sm font-medium text-default-fg">Não tem uma conta? </span>
                        <TextLink href="/register" variant="primary">
                            Cadastre-se
                        </TextLink>
                    </div>
                </Card>
        </main>
    );
}