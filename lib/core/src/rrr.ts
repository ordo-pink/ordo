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

import { is_finite_non_negative_int, is_object, lt } from "@ordo-pink/tau"
import { ERROR_TYPE } from "@ordo-pink/core"

const eperm = (message: string, ...debug: any[]) => compose_rrr(message)("EPERM", ...debug)
const enoent = (message: string, ...debug: any[]) => compose_rrr(message)("ENOENT", ...debug)
const eintr = (message: string, ...debug: any[]) => compose_rrr(message)("EINTR", ...debug)
const eio = (message: string, ...debug: any[]) => compose_rrr(message)("EIO", ...debug)
const enxio = (message: string, ...debug: any[]) => compose_rrr(message)("ENXIO", ...debug)
const eagain = (message: string, ...debug: any[]) => compose_rrr(message)("EAGAIN", ...debug)
const eacces = (message: string, ...debug: any[]) => compose_rrr(message)("EACCES", ...debug)
const eexist = (message: string, ...debug: any[]) => compose_rrr(message)("EEXIST", ...debug)
const einval = (message: string, ...debug: any[]) => compose_rrr(message)("EINVAL", ...debug)
const enotrecoverable = (message: string, ...debug: any[]) => compose_rrr(message)("ENOTRECOVERABLE", ...debug)
const efbig = (message: string, ...debug: any[]) => compose_rrr(message)("EFBIG", ...debug)
const enospc = (message: string, ...debug: any[]) => compose_rrr(message)("ENOSPC", ...debug)

const compose_rrr =
	(message: string) =>
	<$TKey extends keyof typeof ERROR_TYPE>(key: $TKey, ...debug: any[]): Ordo.Rrr<$TKey> => ({
		code: ERROR_TYPE[key] as const,
		debug,
		key,
		message,
	})

export const rrr = {
	type: ERROR_TYPE,
	is_rrr: (e: unknown): e is Ordo.Rrr => {
		const x = e as Ordo.Rrr
		return is_object(x) && is_finite_non_negative_int(x.code) && lt(rrr.type.length)(x.code)
	},
	codes: {
		eperm,
		enoent,
		eintr,
		eio,
		enxio,
		eagain,
		eacces,
		eexist,
		einval,
		enotrecoverable,
		efbig,
		enospc,
	},
}
