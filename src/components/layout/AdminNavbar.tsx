"use client";

import { AdminNavLink } from "./AdminNavLink";
import { usePathname } from "next/navigation";

export const AdminNavbar = () => {
    const pathname = usePathname();
    console.log(pathname)
    return (
        <nav 
            className="md:gap-2 lg:gap-4 flex flex-wrap justify-center border border-default-border px-2 py-2 rounded-full"
            aria-label="Menu Principal"
        >
            <div className="flex md:gap-2 lg:gap-4">
                <AdminNavLink
                    href="/admin/dashboard"
                    variant="primary"
                    pill="true"
                    className="px-2! sm:px-3!"
                    active={pathname === "/admin/dashboard"}
                >
                    Início
                </AdminNavLink>
                <AdminNavLink
                    href="/admin/dashboard/pets"
                    variant="primary"
                    pill="true"
                    className="px-2! sm:px-3!"
                    active={pathname.includes("admin/dashboard/pets")}
                >
                    Pets
                </AdminNavLink>
                <AdminNavLink
                    href="/admin/dashboard/neuterings"
                    variant="primary"
                    pill="true"
                    className="px-2! sm:px-3!"
                    active={pathname.includes("admin/dashboard/neuterings")}
                >
                    Castrações
                </AdminNavLink>
            </div>
            <div className="flex md:gap-2 lg:gap-4">

                <AdminNavLink
                    href="/admin/dashboard/emergencies"
                    variant="primary"
                    pill="true"
                    className="px-2! sm:px-3!"
                    active={pathname.includes("admin/dashboard/emergencies")}
                >
                    Atendimentos
                </AdminNavLink>
                <AdminNavLink
                    href="/admin/dashboard/adoptions"
                    variant="primary"
                    pill="true"
                    className="px-2! sm:px-3!"
                    active={pathname.includes("admin/dashboard/adoptions") || pathname.includes("admin/dashboard/give-ups")}
                >
                    Adoções
                </AdminNavLink>
            </div>

        </nav>
    )
}