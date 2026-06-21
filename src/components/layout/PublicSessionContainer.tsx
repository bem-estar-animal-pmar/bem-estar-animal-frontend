"use client"

import { useSession, signOut } from "@/src/lib/auth-client";
import { useState, useEffect } from "react";
import { Button, ButtonLink } from "@/src/components/ui"
import { SpinnerIcon } from "../icons/SpinnerIcon";

export const PublicSessionContainer = () => {

    const { data: session, isPending, refetch } = useSession(); /* this better auth hook searches on the backend for an active session */
    
    /* when switching tabs on browser better auth tends to recall useSession to get new session data, to prevent the 'loading' 
    component to flicker, we usually do if(isPending && !session), but in this specific page, session sometimes can be null 
    forever, and pending would still reload, so we need a state that says the first attempt on getting session already happened */
    const [initialLoadPending, setInitialLoadPending] = useState(true);

    useEffect(() => { /* the moment isPending becomes false for the first time, flip initialLoad */
        if (!isPending && initialLoadPending) {
            setInitialLoadPending(false);
        }
    }, [isPending, initialLoadPending]);

    const handleLogout = async () => {
        await signOut({
            fetchOptions: {
                onSuccess: () => {
                    refetch();
                },
            },
        });
    };
    
    if (initialLoadPending) { /* loading state, in the future, you can make a loading.tsx skeleton page */
        return (
            <SpinnerIcon size={20} />
        );
    }

    if (!session) { /* if there is no active session could render a forbidden page here */
        return (
            <div>   
                <ButtonLink 
                    href="/login"
                    variant="primary"
                    pill="true"
                >
                    Entrar
                </ButtonLink>
            </div>
        );
    }

    return (
        <div className="flex flex-col md:flex-row gap-2">
            <ButtonLink 
                href="/dashboard"
                size="sm"
                variant="primary"
                pill="true"
            >
                Minha Área
            </ButtonLink>
            <Button
                onClick={handleLogout} 
                size="sm"
                variant="ghost"
                pill="true"
            >
                Encerrar Sessão
            </Button>
        </div>
    );
}