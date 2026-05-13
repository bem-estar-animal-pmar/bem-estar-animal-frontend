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
import { translateError } from "@/src/lib/error-map";

import { Button, Input, Label, TextLink } from "@/src/components/ui";
import { SpinnerIcon } from "../../icons/SpinnerIcon";

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
        .max(20, "Nome deve ter no máximo 20 caracteres.")
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Nome só pode conter letras."),
    email: z.email("Formato de e-mail inválido."),
    lastName: z.string()
        .min(1, "Sobrenome não deve ficar vazio.")
        .max(40, "Sobrenome deve ter no máximo 40 caracteres.")
        .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/, "Sobrenome só pode conter letras."),
    phone: z.string()
        .regex(/^\(?\d{2}\)?\s?\d{4,5}-?\d{4}$/, "Formato de telefone inválido."),
    cpf: z.string()
        .refine((val) => cpf.isValid(val), {
            message: "CPF inválido.",
        }),
    cep: z.string()
        .regex(/^\d{5}-?\d{3}$/, "Formato de CEP inválido."),
    street: z.string().trim()
        .min(1, "Rua é obrigatória")
        .max(200, "Rua deve ter no máximo 200 caracteres"),
    neighborhood: z.string().trim()
        .min(1, "Bairro é obrigatório")
        .max(100, "Bairro deve ter no máximo 100 caracteres"),
    city: z.string().trim()
        .min(1, "Cidade é obrigatória")
        .max(100, "Cidade deve ter no máximo 100 caracteres"),
    state: z.string().trim()
        .length(2, "Estado deve ser UF (2 letras)"),
    number: z.string().trim()
        .min(1, "Número é obrigatório")
        .max(16, "Número deve ter no máximo 16 caracteres"),
    termsAccepted: z.boolean().refine((val) => val === true, {
        message: "Você deve aceitar os Termos de Uso e a Política de Privacidade.",
    }),
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
    const { control, handleSubmit, setValue, formState: { errors } } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema), /* tells useForm() which fields are allowed to exist and update error states based on the schema rules */
        defaultValues: { /* defines the initial state of each field, controller is what actually creates the fields */
            name: "",
            lastName: "",
            email: "",
            cpf: "",
            cep: "",
            phone: "",
            street: "",
            neighborhood: "",
            city: "",
            state: "",
            number: "",
            password: "",
            confirmPassword: "",
            termsAccepted: false,
        }
    });
    
    const [loading, setLoading] = useState(false);
    const [isFetchingCep, setIsFetchingCep] = useState(false);

    const handleCepSearch = async (cepValue: string) => {
        const cleanCep = cepValue.replace(/\D/g, "");
        if (cleanCep.length === 8) {
            setIsFetchingCep(true); // Bloqueia os inputs de endereço
            try {
                const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
                const data = await res.json();
                
                if (!data.erro) {
                    setValue("street", data.logradouro, { shouldValidate: true });
                    setValue("neighborhood", data.bairro, { shouldValidate: true });
                    setValue("city", data.localidade, { shouldValidate: true });
                    setValue("state", data.uf, { shouldValidate: true });
                }
            } catch (error) {
                console.error("Erro ao buscar CEP", error);
            } finally {
                setIsFetchingCep(false);
            }
        }
    };

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
                street: data.street,
                neighborhood: data.neighborhood,
                city: data.city,
                state: data.state,
                number: data.number,
                callbackURL: `${process.env.NEXT_PUBLIC_WEBSITE_URL}/email-verified`
            }, 
            {
                onSuccess: () => {
                    const safeEmail = encodeURIComponent(data.email);
                    router.push(`/check-email?email=${safeEmail}`);
                },
                onError: (ctx) => {
                    toast.danger(translateError(ctx.error.code || ctx.error.message));
                    setLoading(false);
                }
            }
        );
        
        setLoading(false);
    };
    
return (
        <form 
            onSubmit={handleSubmit(handleRegister)}
            className="flex flex-col gap-2"
        >
            <div className="flex flex-col sm:flex-row gap-2">
                <div className="pb-2 sm:w-4/10">
                    <Label htmlFor="name">Nome</Label>
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
                <div className="pb-2 sm:w-6/10">
                    <Label htmlFor="lastName">Sobrenome</Label>
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
            </div>


            <div className="pb-2"> 
                <Label htmlFor="email">E-mail</Label>
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

            <div className="flex flex-col sm:flex-row gap-2">
                <div className="pb-2 sm:w-1/2"> 
                    <Label htmlFor="phone">Telefone</Label>
                    <Controller
                        name="phone"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="phone"
                                type="tel"
                                placeholder="(00) 00000-0000"
                                autoComplete="tel"
                                {...field}
                                variant={errors.phone ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.phone && <span className="text-danger-fg text-sm">{errors.phone.message}</span>}
                </div>

                <div className="pb-2 sm:w-1/2"> 
                    <Label htmlFor="cpf">CPF</Label>
                    <Controller
                        name="cpf"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="cpf"
                                type="text"
                                placeholder="000.000.000-00"
                                {...field}
                                variant={errors.cpf ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.cpf && <span className="text-danger-fg text-sm">{errors.cpf.message}</span>}
                </div>
            </div>

            <p className="text-xs text-muted-fg italic">Certifique-se de que o nome e sobrenome inseridos aqui são os mesmos do número do CPF. Caso contrário, qualquer serviço pedido será cancelado e o usuário poderá perder o acesso à conta.</p>

            <div className="pb-2"> 
                <Label htmlFor="cep">CEP</Label>
                <Controller
                    name="cep"
                    control={control}
                    render={({ field }) => (
                        <Input
                            id="cep"
                            type="text"
                            placeholder="00000-000"
                            autoComplete="postal-code"
                            {...field}
                            onBlur={(e) => {
                                field.onBlur(); // Mantém o onBlur nativo do react-hook-form para validação
                                handleCepSearch(e.target.value); // Dispara a nossa busca
                            }}
                            variant={errors.cep ? "danger" : "default"}
                        />
                    )}
                />
                {errors.cep && <span className="text-danger-fg text-sm">{errors.cep.message}</span>}
            </div>
            {isFetchingCep && (
                <div className="flex  items-center gap-2 text-sm text-muted-fg">
                    <SpinnerIcon size={14}/> <span>Buscando endereço...</span>
                </div>
            )}
            <div className="flex gap-2">
                <div className="pb-2 w-3/4">
                    <Label htmlFor="street">Rua</Label>
                    <Controller
                        name="street"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="street"
                                type="text"
                                placeholder="Nome da rua"
                                {...field}
                                disabled={isFetchingCep}
                                variant={errors.street ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.street && <span className="text-danger-fg text-sm">{errors.street.message}</span>}
                </div>

                <div className="pb-2 w-1/4">
                    <Label htmlFor="number">Número</Label>
                    <Controller
                        name="number"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="number"
                                type="text"
                                placeholder="123"
                                {...field}
                                variant={errors.number ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.number && <span className="text-danger-fg text-sm">{errors.number.message}</span>}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row  gap-2">
                <div className="pb-2 sm:w-1/3">
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Controller
                        name="neighborhood"
                        control={control}
                        render={({ field }) => (
                            <Input
                                id="neighborhood"
                                type="text"
                                placeholder="Bairro"
                                {...field}
                                disabled={isFetchingCep}
                                variant={errors.neighborhood ? "danger" : "default"}
                            />
                        )}
                    />
                    {errors.neighborhood && <span className="text-danger-fg text-sm">{errors.neighborhood.message}</span>}
                </div>
                <div className="flex gap-2">
                    <div className="pb-2 w-2/3">
                        <Label htmlFor="city">Cidade</Label>
                        <Controller
                            name="city"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id="city"
                                    type="text"
                                    placeholder="Cidade"
                                    {...field}
                                    disabled={isFetchingCep}
                                    variant={errors.city ? "danger" : "default"}
                                />
                            )}
                        />
                        {errors.city && <span className="text-danger-fg text-sm">{errors.city.message}</span>}
                    </div>

                    <div className="pb-2 w-1/3">
                        <Label htmlFor="state">UF</Label>
                        <Controller
                            name="state"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    id="state"
                                    type="text"
                                    placeholder="RJ"
                                    maxLength={2}
                                    {...field}
                                    disabled={isFetchingCep}
                                    variant={errors.state ? "danger" : "default"}
                                />
                            )}
                        />
                        {errors.state && <span className="text-danger-fg text-sm">{errors.state.message}</span>}
                    </div>
                </div>
            </div>

            <div className="pb-2"> 
                <Label htmlFor="password">Senha</Label>
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
                <Label htmlFor="confirmPassword">Confirmar senha</Label>
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

            <div className="pb-4 pt-2">
                <div className="flex items-center gap-2">
                    <Controller
                        name="termsAccepted"
                        control={control}
                        render={({ field }) => (
                            <input
                                type="checkbox"
                                id="termsAccepted"
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                                className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                            />
                        )}
                    />
                    <Label htmlFor="termsAccepted" className="text-sm cursor-pointer select-none">
                        Li e concordo com os <TextLink target="_blank" variant="primary" href={"/terms_of_service"}>Termos de Uso</TextLink> e <TextLink target="_blank" variant="primary" href={"/privacy_policy"}>Política de Privacidade</TextLink>.
                    </Label>
                </div>
                {errors.termsAccepted && <span className="text-danger-fg text-sm mt-1 block">{errors.termsAccepted.message}</span>}
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


