import { AuthGuard } from "@/src/components/features/auth/AuthGuard"
import { Header } from "@/src/components/layout/Header";

/* can export metadata here if want because this is a server component */

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <Header/>
            <div className="flex justify-center w-full pt-18">
                <main className="min-h-screen w-full flex flex-col max-w-384 px-2 sm:px-4 py-4 sm:py-8">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}