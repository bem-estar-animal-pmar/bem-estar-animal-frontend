"use client";

import { useState } from "react";
import { signUp } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";

/* import zod and react-hook-form */
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { cpf } from 'cpf-cnpj-validator'; 

import { toast } from "@/src/lib/toast-store";
import { Button, Input, Label } from "@/src/components/ui";

/* makes a zod schema almost identical to the backend one, with a few changes */
const registerSchema = z.object({
    password: z.string()
        .min(8, "A senha deve ter mais de 8 caracters.")
        .max(60, "A senha deve ter menos de 60 caracters.")
        .regex(/[A-Z]/, "A senha deve ter pelo menos uma letra maiúscula.")
        .regex(/[a-z]/, "A senha deve ter pelo menos uma letra minúscula.")
        .regex(/[0-9]/, "A senha deve ter pelo menos um número.")
        .regex(/[\W_]/, "A senha deve ter pelo menos um símbolo."),
    confirmPassword: z.string(),
    name: z.string()
        .min(1, "Nome não deve ficar vazio.")
        .max(60, "Nome deve ter no máximo 60 caracteres.")
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Nome só pode conter letras."),
    email: z.email("Formato de e-mail inválido."),
    lastName: z.string()
        .min(1, "Sobrenome não deve ficar vazio.")
        .max(60, "Sobrenome deve ter no máximo 60 caracteres.")
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Sobrenome só pode conter letras."),
    phone: z.string()
        .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Formato de telefone inválido."),
    cpf: z.string()
        .refine((val) => cpf.isValid(val), {
            message: "CPF inválido.",
        }),
    cep: z.string()
        .regex(/^\d{5}-?\d{3}$/, "Formato de CEP inválido."),
}).refine((data) => data.password === data.confirmPassword, { /* make sure password and confirmPassword are equals */
    message: "As senhas não coincidem", 
    path: ["confirmPassword"], /* if not, confirmPassword field will throw this error */
});

/* register its type so react-hook-form useForm will be able to know which fields 'data' object has */
type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {

    const router = useRouter();

    /* instead of creating states for each field / error field, create a useForm() */
    /* handleSubmit is the function that will be called inside the form onSubmit={} field before our actual handleRegister 
    function, it will handle every single validation, call event.preventDefault() and only calls our handleRegister function if 
    every field is ok */
    const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema), /* tells useForm() which fields are allowed to exist and update error states based on the schema rules */
        defaultValues: { /* defines the initial state of each field, controller is what actually creates the fields */
            name: "",
            lastName: "",
            email: "",
            cpf: "",
            cep: "",
            phone: "",
            password: "",
            confirmPassword: "",
        }
    });
    
    const [loading, setLoading] = useState(false);

    /* handleRegister now is changed to receive not the event, but the data object with all useForm() fields */
    const handleRegister = async (data: RegisterFormData) => {
        setLoading(true);
        
        await signUp.email(
            {
                email: data.email,
                password: data.password,
                name: data.name,
                lastName: data.lastName,
                cpf: data.cpf,
                cep: data.cep,
                phone: data.phone,
                callbackURL: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/email-verified`
            }, 
            {
                onSuccess: () => {
                    const safeEmail = encodeURIComponent(data.email);
                    router.push(`/check-email?email=${safeEmail}`);
                },
                onError: (ctx) => {
                    toast.danger(ctx.error.code || ctx.error.message);
                    setLoading(false);
                }
            }
        );
    };
    
    return (
        <form 
            onSubmit={handleSubmit(handleRegister)} /* here handleSubmit runs and if everything is ok it passes all data to handleRegister() */
            className="flex flex-col gap-2"
        >

            <div className="pb-2">
                <Label htmlFor="name">
                    Nome
                </Label>
                <Controller
                    name="name"
                    control={control}
                    render={({ field }) => (
                        <Input 
                            id="name"
                            type="text" 
                            placeholder="Ex: Vitor"
                            autoComplete="given-name"
                            {...field}
                            variant={errors.name ? "danger" : "default"}
                        />
                    )}
                />
                {errors.name && <span className="text-danger-fg text-sm">{errors.name.message}</span>}
            </div>
            <div className="pb-2">
                <Label htmlFor="lastName">
                    Sobrenome
                </Label>
                <Controller
                    name="lastName"
                    control={control}
                    render={({ field }) => (
                        <Input 
                            id="lastName"
                            type="text"
                            placeholder="Ex: Nascimento" 
                            autoComplete="family-name"
                            {...field}
                            variant={errors.lastName ? "danger" : "default"}
                        />
                    )}
                />
                {errors.lastName && <span className="text-danger-fg text-sm">{errors.lastName.message}</span>}
            </div>
            <div className="pb-2"> 
                <Label htmlFor="email">
                    E-mail
                </Label>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input 
                            id="email" 
                            type="email"
                            placeholder="seu@email.com"
                            autoComplete="email"
                            {...field}
                            variant={errors.email ? "danger" : "default"}
                        />
                    )}
                />
                {errors.email && <span className="text-danger-fg text-sm">{errors.email.message}</span>}
            </div>
            <div className="pb-2"> 
                <Label htmlFor="password">
                    Senha
                </Label>
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <Input 
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            {...field}
                            variant={errors.password ? "danger" : "default"}
                        />
                    )}
                />
                {errors.password && <span className="text-danger-fg text-sm">{errors.password.message}</span>}
            </div>
            <div className="pb-2"> 
                <Label htmlFor="confirmPassword">
                    Confirmar senha
                </Label>
                <Controller
                    name="confirmPassword"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="confirmPassword"
                            type="password"
                            placeholder="••••••••"
                            autoComplete="new-password"
                            {...field}
                            variant={errors.confirmPassword ? "danger" : "default"}
                        />
                    )}
                />
                {errors.confirmPassword && <span className="text-danger-fg text-sm">{errors.confirmPassword.message}</span>}
            </div>
            <div className="pb-2"> 
                <Label htmlFor="phone">
                    Telefone
                </Label>
                <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="phone"
                            type="tel"
                            placeholder="(00) 00000-0000 ou 00000000000"
                            autoComplete="tel"
                            {...field}
                            variant={errors.phone ? "danger" : "default"}
                        />
                    )}
                />
                {errors.phone && <span className="text-danger-fg text-sm">{errors.phone.message}</span>}
            </div>
            <div className="pb-2"> 
                <Label htmlFor="cpf">
                    CPF
                </Label>
                <Controller
                    name="cpf"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="cpf"
                            type="text"
                            placeholder="000.000.000-00 ou 00000000000"
                            {...field}
                            variant={errors.cpf ? "danger" : "default"}
                        />
                    )}
                />
                {errors.cpf && <span className="text-danger-fg text-sm">{errors.cpf.message}</span>}
            </div>
            <div className="pb-2"> 
                <Label htmlFor="cep">
                    CEP
                </Label>
                <Controller
                    name="cep"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="cep"
                            type="text"
                            placeholder="00000-000 ou 00000000"
                            autoComplete="postal-code"
                            {...field}
                            variant={errors.cep ? "danger" : "default"}
                        />
                    )}
                />
                {errors.cep && <span className="text-danger-fg text-sm">{errors.cep.message}</span>}
            </div>
            <Button 
                className="w-full"
                type="submit"
                variant="primary"
                disabled={loading}
            >
                {loading ? "Carregando..." : "Criar conta"}
            </Button>
        </form>
    );
}


