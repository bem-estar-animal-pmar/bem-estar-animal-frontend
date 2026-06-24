import { PublicHeader } from "@/src/components/layout/PublicHeader";
import { Hero } from "../components/features/landing-page/Hero";
import { RegisterCto } from "@/src/components/features/landing-page/RegisterCto";
import { NeuteringCto } from "@/src/components/features/landing-page/NeuteringCto";
import { AdoptionSection } from "@/src/components/features/landing-page/AdoptionSection";
import { EmergencyCto } from "@/src/components/features/landing-page/EmergencyCto";
import { PublicFooter } from "@/src/components/layout/PublicFooter";
import { Contact } from "@/src/components/features/landing-page/Contact";
import { About } from "@/src/components/features/landing-page/About";

export default function Home() {
    return (
        <>
            <PublicHeader />
            <main className="w-full flex flex-col justify-center items-center bg-neutral">
                <Hero />
                <About />
                <AdoptionSection />
                <NeuteringCto />
                <EmergencyCto />
                <RegisterCto />
                <Contact />
			</main>
            <PublicFooter />
        </>
    );
}
