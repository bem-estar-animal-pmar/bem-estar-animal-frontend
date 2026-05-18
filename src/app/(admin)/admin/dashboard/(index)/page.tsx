export default function AdminDashboardPage() {
    return (
        <div className="w-full flex flex-col gap-4 pt-4">
            <section className="flex w-full flex-wrap justify-between items-center border-b border-default-border pb-6 gap-4">
                <div className="flex flex-col">
                    <h1 className="font-semibold text-xl sm:text-xl lg:text-2xl text-default-fg">
                        Dashboard
                    </h1>
                    <p className="text-muted-fg text-sm sm:text-base">
                        Análise e gerenciamento de dados do sistema.
                    </p>
                </div>
            </section>
        </div>
    );
}