import "./globals.css";
import type { Metadata } from "next";

import { Noto_Sans } from "next/font/google";
import { Toaster } from "@/src/components/ui/Toaster"

const notoSans = Noto_Sans({
  variable: "--font-noto-sans",
  subsets: ["latin"]},
)

export const metadata: Metadata = {
  title: "Bem Estar Animal - Secretaria de Cuidados à Animais de Rua | IMAAR",
  description: "O Bem Estar Animal faz parte do Instituto Municipal do Ambiente de Angra dos Reis, é uma secretaria destinada à consulta, castração, adoção e proteção de animais em situação de rua.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <html
            lang="en"
            className="scroll-smooth"
        >
            <body
                className={`${notoSans.className} antialiased min-h-screen w-full`}
            >
                {children}
                <Toaster position="top-center"/>
            </body>
        </html>
    );
}
