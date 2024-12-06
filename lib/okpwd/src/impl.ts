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

import type * as T from "./types"

import { Either } from "@ordo-pink/either"
import { identity } from "ramda"

export const okpwd: T.Fn = options => password => {
	const o = (options ? options : {}) as Required<T.Options>

	if (o.min == null) o.min = 8
	if (o.max == null) o.max = 50
	if (o.skipCheckForAlphaCharacters == null) o.skipCheckForAlphaCharacters = false
	if (o.skipCheckForNumbers == null) o.skipCheckForNumbers = false
	if (o.skipCheckForSpecialCharacters == null) o.skipCheckForSpecialCharacters = false

	return Either.fromNullable(password)
		.leftMap(() => "No password provided.")
		.chain(password =>
			Either.fromBoolean(
				() => password.length >= o.min,
				() => password,
				() => `Password must be at least ${o.min} characters long.`,
			),
		)
		.chain(password =>
			Either.fromBoolean(
				() => password.length <= o.max,
				() => password,
				() => `Password must be under ${o.max} characters long.`,
			),
		)
		.chain(password =>
			Either.fromBoolean(
				() => (o.skipCheckForAlphaCharacters ? true : /\p{L}/u.test(password)),
				() => password,
				() => "Password must contain contain letters.",
			),
		)
		.chain(password =>
			Either.fromBoolean(
				() => (o.skipCheckForNumbers ? true : /\d/u.test(password)),
				() => password,
				() => "Password must contain contain numbers.",
			),
		)
		.chain(password =>
			Either.fromBoolean(
				() =>
					o.skipCheckForSpecialCharacters
						? true
						: // eslint-disable-next-line no-useless-escape
							/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/.test(password),
				() => password,
				() =>
					// eslint-disable-next-line no-useless-escape
					"Password must contain contain special characters ([`!@#$%^&*()_+-=[]{};':\"\\|,.<>/?~]).",
			),
		)
		.fold(identity, () => null)
}
