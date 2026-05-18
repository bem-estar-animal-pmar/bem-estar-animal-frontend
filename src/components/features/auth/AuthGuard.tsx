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

        if ((!session?.user.termsAcceptedAt || !session?.user.privacyAcceptedAt) && session.user.role !== "ADMIN") {
            router.replace("/accept-terms");
            return;
        }
    }, [session, isPending, router]);

    const termsAccepted = session?.user.termsAcceptedAt && session?.user.privacyAcceptedAt

    if (isPending && !session) {
        return <Loading />;
    }

    if (!termsAccepted && session?.user.role !== "ADMIN") {
        return <Loading />;
    }

    return (
        <>
            {children}
        </>
    );
}