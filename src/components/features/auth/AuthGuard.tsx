"use client";

import { useSession } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loading } from "@/src/components/layout/Loading";
import { CURRENT_PRIVACY_POLICY_VERSION, CURRENT_TERMS_OF_SERVICE_VERSION } from "@/src/constants/constants";

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

        const acceptedTerms = session?.user.termsAcceptedAt && session?.user.privacyAcceptedAt;
        const versionTerms = session?.user.termsVersion === CURRENT_TERMS_OF_SERVICE_VERSION && session?.user.privacyVersion === CURRENT_PRIVACY_POLICY_VERSION;

        if (!acceptedTerms || !versionTerms) {
            router.replace("/accept-terms");
            return;
        }
    }, [session, isPending, router]);

    const termsAccepted = session?.user.termsAcceptedAt && session?.user.privacyAcceptedAt;
    const termsVersion = session?.user.termsVersion === CURRENT_TERMS_OF_SERVICE_VERSION && session?.user.privacyVersion === CURRENT_PRIVACY_POLICY_VERSION;

    if (isPending && !session) {
        return <Loading />;
    }

    if (!termsAccepted || !termsVersion) {
        return <Loading />;
    }

    return (
        <>
            {children}
        </>
    );
}