import { AuthGuard } from "@/src/components/features/auth/AuthGuard"

/* can export metadata here if want because this is a server component */

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <div className="h-screen md:h-auto md:min-h-screen w-full flex flex-col md:flex-row bg-default">
                <main className="min-h-screen w-full flex flex-col max-w-384">
                        {children}
                </main>
            </div>
        </AuthGuard>
    );
}