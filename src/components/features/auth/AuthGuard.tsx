"use client";

import { useSession } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loading } from "@/src/components/layout/Loading";

export const AuthGuard = ({ children }: { children: React.ReactNode }) => {
    const { data: session, isPending } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (isPending) {
            return;
        }

        if (!session) {
            router.replace("/login");
            return;
        }
    }, [session, isPending, router]);

    if (isPending && !session) {
        return <Loading />;
    }

    return (
        <>
            {children}
        </>
    );
}