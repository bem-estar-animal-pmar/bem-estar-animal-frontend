import { AdminGuard } from "@/src/components/features/auth/AdminGuard"
import { AdminHeader } from "@/src/components/layout/AdminHeader";

/* can export metadata here if want because this is a server component */

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <AdminGuard>
            <AdminHeader/>
            <div className="flex justify-center w-full pt-18">
                <main className="min-h-screen w-full flex flex-col max-w-332 px-4 sm:px-6 md:px-8 py-4 sm:py-8">
                    {children}
                </main>
            </div>
        </AdminGuard>
    );
}