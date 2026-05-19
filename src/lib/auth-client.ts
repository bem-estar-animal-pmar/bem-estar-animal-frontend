import { createAuthClient } from "better-auth/react"
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000", /* fallback points to localhost */
    plugins: [
        inferAdditionalFields({ /* this plugin let typescript know we added custom fields to user table */
            user: {
                role: {
                    type: "string",
                    required: false,
                    defaultValue: "USER", 
                    input: false,
                },
                lastName: {
                    type: "string",
                    required: true, 
                    input: true,    
                    returned: false
                },
                phone: {
                    type: "string",
                    required: true,
                    input: true,
                    returned: false
                },
                cpf: {
                    type: "string",
                    required: true,
                    input: true,
                    returned: false
                },
                cep: {
                    type: "string",
                    required: true,
                    input: true,
                    returned: false
                },
                street: {
                    type: "string",
                    required: true,
                    input: true,
                    returned: false
                },
                neighborhood: {
                    type: "string",
                    required: true,
                    input: true,
                    returned: false
                },
                city: {
                    type: "string",
                    required: true,
                    input: true,
                    returned: false
                },
                state: {
                    type: "string",
                    required: true,
                    input: true,
                    returned: false
                },
                number: {
                    type: "string",
                    required: true,
                    input: true,
                    returned: false
                },
                history: {
                    type: "string",
                    required: false,
                    input: false, /* Set automatically by DB or server, not frontend */
                    returned: false
                },
                termsAcceptedAt: {
                    type: "date",
                    required: false,
                    input: false, /* Set automatically by DB or server, not frontend */
                    returned: true
                },
                termsVersion: { 
                    type: "string", 
                    required: false, 
                    input: true, /* input must be true because we inject this field on the before hook, even being true, our 
                        zod schema prevents user from sending it from the client */ 
                    returned: true 
                },
                privacyAcceptedAt: {
                    type: "date",
                    required: false,
                    input: false, /* Set automatically by DB or server, not frontend */
                    returned: true
                },
                privacyVersion: { 
                    type: "string", 
                    required: false, 
                    input: true, /* input must be true because we inject this field on the before hook, even being true, our 
                        zod schema prevents user from sending it from the client */ 
                    returned: true 
                },
                blockedUntil: {
                    type: "date",
                    required: false,
                    input: false,     /* user nor admin can set blockedUntil, it automatically goes to true if a status is NO_SHOW */
                    returned: false
                },
                deletedAt: {
                    type: "date",
                    required: false,
                    input: false,
                    returned: true
                }
            },
        }),
    ],
})

export const { 
    signIn, signUp, useSession, signOut, updateUser, sendVerificationEmail, requestPasswordReset, resetPassword
} = authClient;