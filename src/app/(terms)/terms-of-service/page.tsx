export default function TermsOfServicePage() {
    return (
        <div className="flex flex-col gap-4 text-default-fg leading-relaxed">
            <h1 className="text-2xl font-bold mb-2">Termos de Uso</h1>
            
            <p>
                <strong>Plataforma Bem-Estar Animal - Sistema de Castração, Atendimento Emergencial e Adoção</strong>
            </p>
            
            <p>
                Bem-vindo(a) ao sistema Bem-Estar Animal. Este documento estabelece as regras de utilização da plataforma. Ao utilizar nosso sistema, você declara ter lido, compreendido e aceito estes termos.
            </p>

            <h3 className="text-lg font-semibold mt-4">1. Aceite e Revogação</h3>
            <p>
                Ao utilizar nosso sistema de agendamentos veterinários, você concorda com estes Termos de Uso. Você pode revogar este aceite a qualquer momento através das configurações da sua conta. A revogação suspenderá imediatamente seu acesso às funcionalidades do aplicativo até que um novo aceite seja fornecido.
            </p>

            <h3 className="text-lg font-semibold mt-4">2. Regras e Limites de Utilização</h3>
            <p>
                Para garantir que o serviço público atenda de forma justa a todos os cidadãos e animais que necessitam, o sistema opera sob regras estritas de agendamento:
            </p>
            <ul className="list-disc list-inside ml-2">
                <li><strong>Limite Mensal:</strong> É permitido um limite máximo de <strong>2 (dois) agendamentos por mês</strong> por usuário.</li>
                <li><strong>Evasão de Regras:</strong> É terminantemente proibido tentar burlar este limite através da criação de múltiplas contas. O sistema monitora a utilização indevida de recursos públicos.</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">3. Política de Faltas (No-Show)</h3>
            <p>
                A falta de comparecimento prejudica animais que aguardam atendimento. O não comparecimento a um agendamento confirmado (seja castração ou emergência) sem o devido cancelamento prévio no sistema resultará no <strong>bloqueio automático da conta por 30 (trinta) dias</strong>.
            </p>
            <ul className="list-disc list-inside ml-2">
                <li>Durante o período de bloqueio, o usuário não poderá realizar novos agendamentos ou solicitações.</li>
                <li>Casos excepcionais ou de força maior poderão ser avaliados pela administração mediante apresentação de justificativa válida presencialmente na clínica.</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">4. Veracidade das Informações e Fraude</h3>
            <p>
                O usuário é integralmente responsável por fornecer dados exatos, atualizados e verdadeiros (especialmente Nome e CPF). A clínica reserva-se o direito de solicitar documento de identificação com foto (físico ou digital) durante o atendimento presencial para validação.
            </p>
            <p className="mt-2">
                A constatação de uso de dados falsos, CPF de terceiros (falsidade ideológica) ou informações intencionalmente incorretas resultará na <strong>suspensão permanente da conta</strong>. Nesses casos, o e-mail atrelado à infração será retido em nossa base de bloqueio para proteção do sistema, e o CPF original será liberado para o seu legítimo titular.
            </p>
        </div>
    );
}