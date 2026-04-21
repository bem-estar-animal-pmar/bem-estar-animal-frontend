import { NavLink } from "../ui/NavLink"

export const AdminNavbar = () => {
    return (
        <nav 
            className="md:gap-2 lg:gap-4 flex flex-wrap justify-center"
            aria-label="Menu Principal"
        >
            <div className="flex md:gap-2 lg:gap-4">
                <NavLink
                    href="/admin/dashboard"
                    variant="primary"
                    pill="true"
                    className="px-2! sm:px-3!"
                >
                    Início
                </NavLink>
                <NavLink
                    href="/admin/dashboard/pets"
                    variant="primary"
                    pill="true"
                    className="px-2! sm:px-3!"
                >
                    Pets
                </NavLink>
                <NavLink
                    href="/admin/dashboard/neuterings"
                    variant="primary"
                    pill="true"
                    className="px-2! sm:px-3!"
                >
                    Castrações
                </NavLink>
            </div>
            <div className="flex md:gap-2 lg:gap-4">

                <NavLink
                    href="/admin/dashboard/emergencies"
                    variant="primary"
                    pill="true"
                    className="px-2! sm:px-3!"
                >
                    Atendimentos
                </NavLink>
                <NavLink
                    href="/rules/adoption-rules"
                    variant="primary"
                    pill="true"
                    className="px-2! sm:px-3!"
                >
                    Adoções
                </NavLink>
            </div>

        </nav>
    )
}