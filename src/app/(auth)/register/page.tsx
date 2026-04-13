"use client";

import { useRouter } from "next/navigation";

import Image from "next/image";
import animal_logo from "@/public/animal-logo.svg"

import { Card, TextLink} from "@/src/components/ui";
import { RegisterForm } from "@/src/components/features/auth/RegisterForm";

export default function RegisterPage() {
	const router = useRouter(); /* router is next routing state, the same as useNavigation() on SPA react */

	return (
		<main className="flex min-h-screen items-center justify-center bg-default p-2 sm:p-8 md:p-12">
			<Card className="max-w-200" size="xl">
				<div className="flex w-full justify-center">
					<Image
						src={animal_logo}
						alt="Logo do Bem-estar Animal"
						className="w-full max-w-50 h-auto mb-8"
					/>
				</div>

				<h1 className="text-center text-lg text-default-fg font-semibold">
					Cadastrar em Bem Estar Animal
				</h1>

				<p className="text-center text-xs text-muted-fg font-medium"> 
					Crie uma conta em nosso site para acessar a área do cliente
				</p>

				<div className="w-full max-w-120 justify-self-center py-4">
					<RegisterForm></RegisterForm>
				</div>

				<div className="w-full text-center py-2">
					<span className="text-sm font-medium text-default-fg">Já possui uma conta? </span>
					<TextLink href="/login" variant="primary">
						Faça o login
					</TextLink>
				</div>

				<div className="w-full text-center py-2">
					<TextLink href="/" variant="default">
						Voltar para o site
					</TextLink>
				</div>
			</Card>
		</main>
	);
}