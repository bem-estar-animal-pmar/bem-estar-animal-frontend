import { PublicHeader } from "@/src/components/layout/PublicHeader";
import { Hero } from "../components/features/landing-page/Hero";
import { RegisterCto } from "../components/features/landing-page/RegisterCto";
import { NeuteringCto } from "../components/features/landing-page/NeuteringCto";
import { AdoptionSection } from "../components/features/landing-page/AdoptionSection";
import { EmergencyCto } from "../components/features/landing-page/EmergencyCto";
import { PublicFooter } from "../components/layout/PublicFooter";

export default function Home() {
    return (
        <>
            <PublicHeader />
            <main className="w-full flex flex-col justify-center items-center bg-neutral">
                <Hero />
                <span>story</span>
                <NeuteringCto />
                <AdoptionSection />
                <EmergencyCto />
                <RegisterCto />
                <span>contact</span>
			</main>
            <PublicFooter />
        </>
    );
}
