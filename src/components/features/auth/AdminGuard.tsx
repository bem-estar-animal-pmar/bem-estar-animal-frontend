"use client";

import { useSession } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loading } from "@/src/components/layout/Loading";

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
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

        if (session.user.role !== "ADMIN") {
            router.replace("/dashboard");
            return;
        }
    }, [session, isPending, router]);

    if (isPending && !session) {
        return <Loading />;
    }

    if (session && session.user.role !== "ADMIN") {
        return <Loading />;
    }

    return (
        <>
            {children}
        </>
    );
}