export default function PrivacyPolicyPage() {
    return (
        <div className="flex flex-col gap-4 text-default-fg leading-relaxed">
            <h1 className="text-2xl font-bold mb-2">Política de Privacidade</h1>
            
            <p>
                <strong>Plataforma Bem-Estar Animal - Sistema de Castração, Atendimento Emergencial e Adoção</strong>
            </p>
            
            <p>
                Esta Política de Privacidade foi elaborada em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018). Nosso objetivo é dar total transparência sobre como seus dados são tratados.
            </p>

            <h3 className="text-lg font-semibold mt-4">1. Dados Coletados e Finalidade</h3>
            <p>
                Coletamos dados pessoais do tutor (Nome, Sobrenome, CPF, E-mail, Telefone e Endereço completo) e dados dos animais para as seguintes finalidades estritas (Art. 7º, incisos V e VIII da LGPD):
            </p>
            <ul className="list-disc list-inside ml-2">
                <li>Identificação unívoca e autenticação segura no sistema.</li>
                <li>Agendamento e organização de consultas, cirurgias de castração e emergências.</li>
                <li>Criação e manutenção do <strong>prontuário médico-veterinário</strong>, documento de caráter legal e obrigatório.</li>
                <li>Formalização de termos de responsabilidade para lares temporários e processos de adoção.</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">2. Retenção Legal e Exclusão de Dados</h3>
            <p>
                A exclusão de dados na área da saúde não é absoluta. Em obediência às resoluções do Conselho Federal de Medicina Veterinária (CFMV), o prontuário médico-veterinário e os dados do tutor a ele vinculados são documentos legais. O tratamento da sua solicitação de exclusão dependerá do seu histórico:
            </p>
            <ul className="list-disc list-inside ml-2">
                <li className="mb-2">
                    <strong>Se você NÃO possui histórico clínico:</strong> Caso você nunca tenha concluído um atendimento na clínica, sua conta será desativada e, após um período de carência de 30 dias, seus dados pessoais serão <strong>permanentemente excluídos</strong> de nosso banco de dados.
                </li>
                <li>
                    <strong>Se você POSSUI histórico clínico:</strong> Caso seu animal tenha passado por consultas, cirurgias ou você tenha assinado termos de adoção, a exclusão da conta desativará seu acesso ao aplicativo. No entanto, seus dados pessoais e o histórico do animal serão <strong>mantidos bloqueados e armazenados de forma segura</strong> nos servidores da clínica pelo período mínimo de 5 anos (ou o período exigido por lei) para fins de auditoria, defesa legal e continuidade médica. Caso deseje, você poderá reativar seu acesso no futuro.
                </li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">3. Seus Direitos</h3>
            <p>Você possui os seguintes direitos em relação aos seus dados:</p>
            <ul className="list-disc list-inside ml-2">
                <li>Acessar e visualizar os dados pessoais e informações dos seus animais.</li>
                <li>Corrigir dados incompletos ou desatualizados diretamente pelo aplicativo (alterações de CPF requerem validação presencial para evitar fraudes).</li>
                <li>Revogar os termos de aceite (o que suspenderá o uso da conta).</li>
                <li>Solicitar a exclusão da conta, respeitadas as regras de retenção médica detalhadas no item 2.</li>
            </ul>

            <h3 className="text-lg font-semibold mt-4">4. Contato</h3>
            <p>
                Para exercer seus direitos, relatar problemas ou esclarecer dúvidas sobre esta política, entre em contato com nossa administração através do e-mail oficial:
                <br />
                <strong>E-mail:</strong> bemestaranimal@angra.rj.gov.br
            </p>
        </div>
    );
}