/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

export type EmailGuy = { name?: Ordo.User.Name; email: Ordo.User.Email }
export type IdempotencyKey = string
export type BlindCarbonCopies = Ordo.User.Email[]
export type Content = string
export type CarbonCopies = Ordo.User.Email[]
export type From = EmailGuy
export type Headers = Record<string, string>
export type PreviewTitle = string
export type Subject = string
export type To = EmailGuy

export type EmailArgs = [
	idemotency_key: IdempotencyKey,
	subject: Subject,
	content: Content,
	to: To,
	from?: From,
	preview_title?: PreviewTitle,
	headers?: Headers,
	cc?: CarbonCopies,
	bcc?: BlindCarbonCopies,
]

export type Send = (...args: EmailArgs) => Promise<void>

export type Strategy = {
	send: Send
}
