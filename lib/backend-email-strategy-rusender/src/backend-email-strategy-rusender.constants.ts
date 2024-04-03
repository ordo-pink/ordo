import { EmailStrategy } from "@ordo-pink/backend-service-offline-notifications"

export const RS_TEMPLATE_URL = "https://api.beta.rusender.ru/api/v1/external-mails/send-by-template"

export const RS_SEND_URL = "https://api.beta.rusender.ru/api/v1/external-mails/send"

export const RS_SEND_HTTP_METHOD = "POST" as const

export const RS_HEADERS = { "Content-Type": "application/json" }

export const RS_APIKEY_HEADER = "X-Api-Key"

export const RusenderEmailSubject: Record<keyof Omit<EmailStrategy, "sendAsync">, string> = {
	sendChangeEmailEmail: "Подтверждение изменения адреса электронной почты в Ordo.pink",
	sendEmailChangeRequestedEmail: "Получен запрос на изменение вашей электронной почты в Ordo.pink",
	sendPasswordChangedEmail: "Пароль от вашей учётной записи в Ordo.pink изменён",
	sendRecoverPasswordEmail: "Ваша ссылка для восстановления пароля учётной записи в Ordo.pink",
	sendConfirmationEmail:
		"Ваша ссылка для подтверждения электронной почты от учётной записи в Ordo.pink",
	sendSignUpEmail: "Добро пожаловать в Ordo.pink!",
	sendSignInEmail: "Кто-то вошёл в ваш аккаунт Ordo.pink",
}

/**
 * TODO: Add missing template ids
 */
export const RusenderTemplateId: Record<keyof Omit<EmailStrategy, "sendAsync">, number> = {
	sendChangeEmailEmail: 17884,
	sendEmailChangeRequestedEmail: 17891,
	sendPasswordChangedEmail: 10525,
	sendRecoverPasswordEmail: 17893,
	sendConfirmationEmail: 17900,
	sendSignUpEmail: 9463,
	sendSignInEmail: 9661,
}
