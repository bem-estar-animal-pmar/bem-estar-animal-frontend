import { AuthGuard } from "@/src/components/features/auth/AuthGuard"
import { Header } from "@/src/components/layout/Header";

/* can export metadata here if want because this is a server component */

/* min-h-[calc(100vh-72px)] is needed because it is screen - the header padding (18em) */

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AuthGuard>
            <Header/>
            <div className="flex justify-center w-full pt-18">
                <main className="min-h-[calc(100vh-72px)] w-full flex flex-col max-w-332 px-4 sm:px-6 md:px-8 py-4 sm:py-8">
                    {children}
                </main>
            </div>
        </AuthGuard>
    );
}