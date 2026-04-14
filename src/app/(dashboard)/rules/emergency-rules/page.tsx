"use client"

import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

import { ButtonLink } from "@/src/components/ui/ButtonLink"

import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon"

const NeuteringRulesContent = () => {

    const searchParams = useSearchParams();
    const petIdParam = searchParams.get("petId") || "";

    return (
        <div className="w-full flex flex-col">
                
            <div className="flex flex-col w-full pb-8">
                <h1 className="text-default-fg font-semibold text-xl sm:text-2xl md:text-3xl pb-4">
                    Regulamento e instruções para <span className="text-primary-fg">consulta de animais</span>
                </h1>

                <div className="flex w-full justify-end">
                    <ButtonLink 
                        variant="primary" 
                        size="lg" 
                        href={`/dashboard/emergencies${ petIdParam ? `?petId=${petIdParam}` : ""}`}
                    >
                        Li e concordo com as regras
                    </ButtonLink>
                </div>

            </div>
        </div>
    )
}

export default function NeuteringPage() {
  return (
    <Suspense 
        fallback={
            <div className="w-full flex justify-center items-center h-screen">
                <SpinnerIcon />
            </div>
        }
    >
        <NeuteringRulesContent />
    </Suspense>
  )
}