"use client";

import { useState } from "react";
import { Tabs, ButtonTab } from "@/src/components/ui"; 
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";


export default function IndexLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <div className="w-full flex flex-col">
            <Tabs>
                <ButtonTab
                    isActive={pathname === "/admin/dashboard"}
                    disabled={pathname === "/admin/dashboard"}
                    onClick={() => {
                        router.push("/admin/dashboard/")
                    }}
                >
                    Dashboard
                </ButtonTab>
                <ButtonTab
                    isActive={pathname === "/admin/dashboard/quotas"}
                    disabled={pathname === "/admin/dashboard/quotas"}
                    onClick={() => {
                        router.push("/admin/dashboard/quotas")
                    }}
                >
                    Cotas
                </ButtonTab>
                <ButtonTab
                    isActive={pathname.includes("/admin/dashboard/users")}
                    disabled={pathname.includes("/admin/dashboard/users")}
                    onClick={() => {
                        router.push("/admin/dashboard/users")
                    }}
                >
                    Administrativo
                </ButtonTab>
            </Tabs>
            {children}
        </div>
    );
}