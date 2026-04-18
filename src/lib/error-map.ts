/* wont be adding zod errors here */
/* better auth errors are sent directly as response in a different format than common errors because they do not pass through
errorHandler middleware, they can be translateError(ctx.error.code) or translateError(ctx.error.message) */

const errorTranslations: Record<string, string> = {
    USER_NOT_FOUND: "Usuário não encontrado.", /* better auth errors (code) */
	FAILED_TO_CREATE_USER: "Falha ao criar usuário.",
	FAILED_TO_UPDATE_USER: "Falha ao atualizar usuário.",
	USER_ALREADY_EXISTS: "Usuário já existe.",
	USER_EMAIL_NOT_FOUND: "Email do usuário não encontrado.",
	USER_ALREADY_HAS_PASSWORD: "Usuário já possui uma senha. Forneça-a para excluir a conta.",
	USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL: "Usuário já existe. Use outro email.",
	FAILED_TO_CREATE_SESSION: "Falha ao criar sessão.",
	FAILED_TO_GET_SESSION: "Falha ao obter sessão.",
	SESSION_EXPIRED: "Sessão expirada. Autentique-se novamente para realizar esta ação.",
	INVALID_PASSWORD: "Senha inválida.",
	INVALID_EMAIL: "Email inválido.",
	INVALID_EMAIL_OR_PASSWORD: "Email ou senha inválidos.",
	INVALID_TOKEN: "Token inválido.",
	EMAIL_NOT_VERIFIED: "Email não verificado.",
	CREDENTIAL_ACCOUNT_NOT_FOUND: "Conta de credenciais não encontrada.",
	PASSWORD_TOO_SHORT: "Senha muito curta.",
	PASSWORD_TOO_LONG: "Senha muito longa.",
	SOCIAL_ACCOUNT_ALREADY_LINKED: "Conta já vinculada.",
	PROVIDER_NOT_FOUND: "Provedor não encontrado.",
	ID_TOKEN_NOT_SUPPORTED: "id_token não suportado.",
	FAILED_TO_GET_USER_INFO: "Falha ao obter informações do usuário.",
	EMAIL_CAN_NOT_BE_UPDATED: "Email não pode ser atualizado.",
	FAILED_TO_UNLINK_LAST_ACCOUNT: "Você não pode desvincular sua última conta.",
	ACCOUNT_NOT_FOUND: "Conta não encontrada.",
	
    /* backend errorhandler status errors code (title) */
    "VALIDATION_ERROR" : "Erro de validação.",
    "UNAUTHORIZED" : "Acesso negado.",
    "FORBIDDEN" : "Acesso negado.",
    "NOT_FOUND" : "Não encontrado.",
    "CONFLICT" : "Conflito.",
	"TOO_MANY_REQUESTS": "Muitas tentativas enviadas. Por favor tente novamente mais tarde.",
    "INTERNAL_SERVER_ERROR" : "Erro Interno do Servidor.",
    "INVALID_JSON" : "Json inválido.",

    /* backend status errors messages */

    /* pets route */
    "Maximum pet limit per user reached": "Limite máximo de pets por usuário atingido.",
    "Pet not found": "Pet não encontrado.",
    "You are not allowed to update this pet": "Você não tem permissão para atualizar este pet.",
    "Unauthorized": "Não autorizado.",
    "You are not allowed to delete pets with future appointments. Please resolve them first": "Você não tem permissão para excluir pets com agendamentos futuros. Por favor, resolva-os primeiro.",
    "Validation Error. Invalid params": "Erro de validação. Parâmetros inválidos.",
    "Validation failed. Invalid filters": "Falha na validação. Filtros inválidos.",
    "Validation Error. Invalid body": "Erro de validação. Corpo da requisição inválido.",

    /* neutering route */
    "User or Pet not found": "Usuário ou pet não encontrado.",
    "You can only schedule appointments for your own pet": "Você só pode agendar consultas para o seu próprio pet.",
    "This pet already has an active neutering appointment or is already neutered": "Este pet já possui um agendamento ativo de castração ou já está castrado.",
    "You must agree with all terms and declarations": "Você deve concordar com todos os termos e declarações.",
    "Neutering is only allowed for pets between 3 months and 8 years old": "A castração só é permitida para pets entre 3 meses e 8 anos de idade.",
    "Appointments must be scheduled at least 1 days in advance": "Os agendamentos devem ser feitos com pelo menos 1 dia de antecedência.",
    "Appointments must be scheduled at least 2 days in advance": "Os agendamentos devem ser feitos com pelo menos 2 dias de antecedência.",
    "Monthly limit of neutering appointments reached for this CPF": "Limite mensal de agendamentos de castração atingido para este CPF.",
    "Neutering is only available from Monday to Friday": "A castração só está disponível de segunda a sexta-feira.",
    "Fridays are reserved for male animals only": "As sextas-feiras são reservadas apenas para animais machos.",
    "Friday morning is for cats only": "A sexta-feira de manhã é apenas para gatos.",
    "Friday afternoon is for dogs only": "A sexta-feira à tarde é apenas para cachorros.",
    "Only CATs can only be neutered in the MORNING": "Apenas gatos podem ser castrados no período da manhã.",
    "Only DOGs can only be neutered in the AFTERNOON": "Apenas podem ser castrados no período da tarde.",
    "No more slots available for this date and period": "Não há mais vagas disponíveis para esta data e período.",
    "Neutering appointment not found": "Agendamento de castração não encontrado.",
    "Appointment not found": "Agendamento de castração não encontrado.",
    "You can only cancel your own appointments": "Você só pode cancelar seus próprios agendamentos.",
    "Cannot cancel an appointment with status COMPLETED": "Não é possível cancelar um agendamento que está completo.",
    "Cannot cancel an appointment with status CONFIRMED": "Não é possível cancelar um agendamento confirmado. Contate a clínica caso deseje cancelar.",
    "Cannot cancel an appointment with status NO_SHOW": "Não é possível cancelar um agendamento finalizado.",
    "Cancellations must be made at least 48 hours in advance. If you still want to cancel contact the clinic": "Cancelamentos devem ser feitos com pelo menos 48 horas de antecedência. Se você ainda deseja cancelar, entre em contato com a clínica.",
    "Invalid query parameters": "Parâmetros de consulta inválidos.",
    "Validation Error": "Erro de validação.",
    "Invalid body": "Corpo da requisição inválido.",

    /* adoption route */
    "You can only give up your own pet": "Você só pode disponibilizar para adoção o seu próprio pet.",
    "Pet is already for adoption": "O pet já está disponível para adoção.",
    "There is already a pending request for this pet": "Já existe uma solicitação pendente para este pet.",
    "Give up request not found": "Solicitação de entrega não encontrada.",
    "You can only cancel your own requests": "Você só pode cancelar suas próprias solicitações.",
    "Cannot cancel a already completed, cancelled or rejected give up request": "Não é possível cancelar uma solicitação de entrega já concluída, cancelada ou rejeitada.",
    "This pet is not available for adoption": "Este pet não está disponível para adoção.",
    "Adoption Request not found": "Solicitação de adoção não encontrada.",

    /* emergency route */
    "User not found": "Usuário não encontrado.",
    "Result Pet ID does not exist": "O ID do pet informado não existe.",
    "You are not allowed to create an emergency appointment for this pet": "Você não tem permissão para criar um agendamento de emergência para este pet.",
    "Emergency appointment not found": "Agendamento de emergência não encontrado.",

    /* auth middleware */
    "Invalid or expired Session": "Sessão inválida ou expirada.",

    /* prisma */
    "A record with this unique field already exists": "Já existe um registro com este campo único.",
    "Foreign Key constraint failed, a related record was not found or cannot be deleted": "Falha na restrição de chave estrangeira, um registro relacionado não foi encontrado ou não pode ser excluído.",
    "The requested resource could not be found": "O recurso solicitado não pôde ser encontrado."
};

export const translateError = (text: string): string => {
    return errorTranslations[text]  || "Error desconhecido: " + text;
}