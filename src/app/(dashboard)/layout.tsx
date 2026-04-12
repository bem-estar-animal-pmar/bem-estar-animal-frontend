import { AuthGuard } from "@/src/components/features/auth/AuthGuard"

/* can export metadata here if want because this is a server component */

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <main className="min-h-screen w-full flex flex-col max-w-384">
                    {children}
            </main>
        </AuthGuard>
    );
}