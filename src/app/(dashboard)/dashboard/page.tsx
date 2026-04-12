"use client";

import { useSession, signOut, updateUser } from "@/src/lib/auth-client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

export default function DashboardPage() {
    const router = useRouter();

    /* fields to show update example */
    const [newName, setNewName] = useState<string>("");

    const { data: session, isPending, refetch } = useSession();

    if (isPending) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-slate-50">
                <p className="text-sm font-medium text-slate-500 animate-pulse">Carregando dados...</p>
            </div>
        );
    }

    if (!session) return null;

    const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

    const handleLogout = async () => {
        await signOut({ fetchOptions: { onSuccess: () => router.push("/login") } });
    };

    const handleUpdateUser = async () => {
        if (newName !== "") {
            await updateUser({ name: newName }, { onError: (ctx) => alert(ctx.error.message) });
            await refetch();
            setNewName("");
        }
    };


    return (
        <div className="flex min-h-screen items-start justify-center bg-slate-50 p-4 gap-4 flex-wrap">
            
            {/* CARD: DADOS DO USUÁRIO */}
            <div className="w-full space-y-4 max-w-md bg-white p-8 border text-slate-700">
                <div className="w-full font-bold text-lg border-b pb-2">Dados do usuário</div>
                <div className="space-y-1 text-sm">
                    <p><strong>id:</strong> {session.session.userId}</p>
                    <p className="truncate"><strong>token:</strong> {session.session.token}</p>
                    <p><strong>name:</strong> {session.user.name}</p>
                    <p><strong>role:</strong> {session.user.role}</p>
                    <p><strong>email:</strong> {session.user.email}</p>
                    <p>{session.user.emailVerified ? "Verificado ✅" : "Pendente ⚠️"}</p>
                </div>
                <button onClick={handleLogout} className="w-full border bg-red-50 text-red-600 py-2 hover:bg-red-100 transition">Sair</button>
                <div className="pt-4 space-y-2 border-t">
                    <input type="text" placeholder="novo nome" value={newName} onChange={(e) => setNewName(e.target.value)} className="w-full border bg-slate-50 p-2" />
                    <button onClick={handleUpdateUser} className="w-full border bg-slate-100 py-2 hover:bg-slate-200 transition">Mudar Nome</button>
                </div>
            </div>

        </div>
    );
}