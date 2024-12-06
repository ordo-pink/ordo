/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { TEmailStrategy } from "@ordo-pink/backend-service-offline-notifications"

export const RS_TEMPLATE_URL = "https://api.beta.rusender.ru/api/v1/external-mails/send-by-template"

export const RS_SEND_URL = "https://api.beta.rusender.ru/api/v1/external-mails/send"

export const RS_SEND_HTTP_METHOD = "POST" as const

export const RS_HEADERS = { "Content-Type": "application/json" }

export const RS_APIKEY_HEADER = "X-Api-Key"

export const RusenderEmailSubject: Record<keyof Omit<TEmailStrategy, "sendAsync">, string> = {
	sendChangeEmailEmail: "Подтверждение изменения адреса электронной почты в Ordo.pink",
	sendEmailChangeRequestedEmail: "Получен запрос на изменение вашей электронной почты в Ordo.pink",
	sendPasswordChangedEmail: "Пароль от вашей учётной записи в Ordo.pink изменён",
	sendRecoverPasswordEmail: "Ваша ссылка для восстановления пароля учётной записи в Ordo.pink",
	sendConfirmationEmail: "Ваша ссылка для подтверждения электронной почты от учётной записи в Ordo.pink",
	sendSignUpEmail: "Добро пожаловать в Ordo.pink!",
	sendSignInEmail: "Кто-то вошёл в ваш аккаунт Ordo.pink",
}

/**
 * TODO: Add missing template ids
 */
export const RusenderTemplateId: Record<keyof Omit<TEmailStrategy, "sendAsync">, number> = {
	sendChangeEmailEmail: 17884,
	sendEmailChangeRequestedEmail: 17891,
	sendPasswordChangedEmail: 10525,
	sendRecoverPasswordEmail: 17893,
	sendConfirmationEmail: 17900,
	sendSignUpEmail: 9463,
	sendSignInEmail: 9661,
}
