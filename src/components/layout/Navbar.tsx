import { NavLink } from "../ui/NavLink"

export const Navbar = () => {
    return (
        <nav 
            className="md:gap-2 lg:gap-4 flex"
            aria-label="Menu Principal"
        >
            <NavLink
                href="/dashboard"
                variant="primary"
                pill="true"
                className="px-2! sm:px-3!"
            >
                Pets
            </NavLink>
            <NavLink
                href="/rules/neutering-rules"
                variant="primary"
                pill="true"
                className="px-2! sm:px-3!"
            >
                Castração
            </NavLink>
            <NavLink
                href="/rules/emergency-rules"
                variant="primary"
                pill="true"
                className="px-2! sm:px-3!"
            >
                Consulta
            </NavLink>
            <NavLink
                href="/rules/adption-rules"
                variant="primary"
                pill="true"
                className="px-2! sm:px-3!"
            >
                Adoção
            </NavLink>
        </nav>
    )
}