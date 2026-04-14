"use client"

import { Suspense } from "react"
import { SpinnerIcon } from "@/src/components/icons/SpinnerIcon"

const EmergencyContent = () => {

    return (
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 items-start relative">
           
           emergency
        </div>
    )
}

export default function EmergenciesPage() {
    return (
        <Suspense 
            fallback={
                <div className="w-full flex justify-center items-center h-screen">
                    <SpinnerIcon />
                </div>
            }
        >
            <EmergencyContent />
        </Suspense>
    )
}