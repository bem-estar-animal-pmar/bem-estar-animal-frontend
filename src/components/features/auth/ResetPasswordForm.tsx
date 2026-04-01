"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";

import { Input } from "@/src/components/ui/Input";
import { Button } from "@/src/components/ui/Button";
import { Label } from "@/src/components/ui/Label";

/* import zod and react-hook-form */
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

/* makes a zod schema almost identical to the backend one, with a few changes */
const resetPasswordSchema = z.object({
    password: z.string()
        .min(8, "A senha deve ter mais de 8 caracters.")
        .max(60, "A senha deve ter menos de 60 caracters.")
        .regex(/[A-Z]/, "A senha deve ter pelo menos uma letra maiúscula.")
        .regex(/[a-z]/, "A senha deve ter pelo menos uma letra minúscula.")
        .regex(/[0-9]/, "A senha deve ter pelo menos um número.")
        .regex(/[\W_]/, "A senha deve ter pelo menos um símbolo."),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, { /* make sure password and confirmPassword are equals */
    message: "As senhas não coincidem.", 
    path: ["confirmPassword"], /* if not, confirmPassword field will throw this error */
});

/* register its type so react-hook-form useForm will be able to know which fields 'data' object has */
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

interface ResetPasswordFormProps {
    handleReset: (data: ResetPasswordFormData) => Promise<void>;
}

export const ResetPasswordForm = ({handleReset}: ResetPasswordFormProps) => {
    const [loading, setLoading] = useState(false);

    const { control, handleSubmit, formState: { errors } } = useForm<ResetPasswordFormData>({
            resolver: zodResolver(resetPasswordSchema), /* tells useForm() which fields are allowed to exist and update error states based on the schema rules */
            defaultValues: { /* defines the initial state of each field, controller is what actually creates the fields */
                password: "",
                confirmPassword: "",
            }
    });

    const onSubmit = async (data: ResetPasswordFormData) => {
            setLoading(true);
            await handleReset(data);
            setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
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
            <Button
                className="w-full"
                type="submit"
                variant="primary"
                disabled={loading}
            >
                {loading ? "Enviando..." : "Salvar"}
            </Button>
        </form>
    );
};