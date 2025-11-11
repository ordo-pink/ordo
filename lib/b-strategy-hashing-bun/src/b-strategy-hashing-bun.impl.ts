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

import type * as HashingStrategyBun from "./b-strategy-hashing-bun.types"

export const create: HashingStrategyBun.Create = a => ({
	hash: c => oath.from_promise(() => Bun.password.hash(c, a)).pipe(oath.ops.rmap(reject)),
	verify: ordo.fns.curry((c, h) => oath.from_promise(() => Bun.password.verify(c, h, a.algorithm)).pipe(oath.ops.rmap(reject))),
})

// --- Internal ---

const reject = (e: any) => ordo.rrr.eio(ORDO.RRR.REASON.HASHING_ISSUE, e)

// const storage = new Map<Ordo.User.Email, AuthCode.Value[]>()

// const interval = setInterval(() => {
// 	const now = ordo.timestamp.create()

// 	for (const [email, values] of storage.entries()) {
// 		for (const value of values) {
// 			if (
// 				(value[2] === AuthCode.USAGE.AUTHENTICATION && now - value[0] < auth_code_lifetime) ||
// 				(value[2] === AuthCode.USAGE.EMAIL_CHANGE && now - value[0] < change_email_lifetime)
// 			) {
// 				storage.set(email, values.toSpliced(values.indexOf(value), 1))
// 				ordo.logger.debug(`Removed outdated code ${usage_to_string(value[2])} for`, ordo.user.obfuscate_email(email))
// 			}
// 		}
// 	}
// }, 5000).unref()

// const usage_to_string = (usage: AuthCode.USAGE) =>
// 	sweech
// 		.match(usage)
// 		.case(AuthCode.USAGE.AUTHENTICATION, () => "authentication")
// 		.case(AuthCode.USAGE.EMAIL_CHANGE, () => "email change")
// 		.default(() => "")
