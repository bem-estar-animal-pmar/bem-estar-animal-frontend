import { Card } from "../../ui";

export const AdoptionHistorySection = ({ history }: { history: string }) => {
    const historyLogs = history ? history.split('\n').filter(log => log.trim() !== '') : [];

    const parseLogEntry = (log: string) => {
        const match = log.match(/^\[(.*?)\]\s*(.*)$/);
        if (match) {
            return { timestamp: match[1], message: match[2] };
        }
        return { timestamp: null, message: log };
    };

    return (
        <Card size="lg" className="shadow-sm! h-fit!">
            <section className="flex flex-col">
                <h3 className="text-base lg:text-lg font-semibold pb-2 mb-4 border-b border-default-border">
                    Histórico do Pedido
                </h3>
                <div className="rounded-md p-4 text-sm max-h-80 overflow-y-auto border border-default-border bg-default/30">
                    {historyLogs.length > 0 ? (
                        <div className="relative border-l-2 border-default-border/60 ml-2 space-y-5 my-2">
                            {historyLogs.map((log, index) => {
                                const { timestamp, message } = parseLogEntry(log);
                                const color = index === historyLogs.length - 1 ? "bg-primary-fg animate-bounce h-3 w-3" : "bg-muted-fg"
                                return (
                                    <div key={index} className="relative pl-5">
                                        <div className={`absolute w-2.5 h-2.5 ${color} rounded-full -left-[5.5px] top-1.5 ring-4 ring-default/30`} />
                                        
                                        <div className="flex flex-col">
                                            {timestamp && (
                                                <span className="text-xs font-semibold text-muted-fg mb-1">
                                                    {timestamp}
                                                </span>
                                            )}
                                            <span className="text-default-fg text-sm leading-relaxed">
                                                {message}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <span className="text-muted-fg text-sm">Nenhum histórico registrado.</span>
                    )}
                </div>
            </section>
        </Card>
    );
};