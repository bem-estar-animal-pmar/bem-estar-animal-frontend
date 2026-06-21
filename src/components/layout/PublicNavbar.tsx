import { NavLink } from "@/src/components/ui"

export const PublicNavbar = () => {
    return (
        <nav 
            className="flex flex-col md:flex-row gap-2 lg:gap-4 md:justify-self-center md:justify-between"
            aria-label="Menu Principal"
        >
            <NavLink
                href="/"
                variant="primary-accent"
                pill="true"
            >
                Início
            </NavLink>
            <NavLink
                href="/neutering"
                variant="primary-accent"
                pill="true"
            >
                Castração
            </NavLink>
            <NavLink
                href="/emergency"
                variant="primary-accent"
                pill="true"
            >
                Emergência
            </NavLink>
            <NavLink
                href="/adoption"
                variant="primary-accent"
                pill="true"
            >
                Adoção
            </NavLink>
        </nav>
    )
}