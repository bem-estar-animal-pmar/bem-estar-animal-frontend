import { PublicHeader } from "@/src/components/layout/PublicHeader";
import { Hero } from "../components/features/landing-page/Hero";
import { RegisterCto } from "../components/features/landing-page/RegisterCto";
import { NeuteringCto } from "../components/features/landing-page/NeuteringCto";

export default function Home() {
    return (
        <>
            <PublicHeader />
            <main className="w-full flex flex-col justify-center items-center bg-neutral">
                <Hero />
                <RegisterCto />
                <NeuteringCto />
			</main>
        </>
    );
}
