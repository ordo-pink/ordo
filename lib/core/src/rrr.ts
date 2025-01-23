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

import { ErrorType } from "@ordo-pink/core"

export const eperm = (message: string, ...debug: any[]) => compose_rrr(message)("EPERM", debug)
export const enoent = (message: string, ...debug: any[]) => compose_rrr(message)("ENOENT", debug)
export const eintr = (message: string, ...debug: any[]) => compose_rrr(message)("EINTR", debug)
export const eio = (message: string, ...debug: any[]) => compose_rrr(message)("EIO", debug)
export const enxio = (message: string, ...debug: any[]) => compose_rrr(message)("ENXIO", debug)
export const eagain = (message: string, ...debug: any[]) => compose_rrr(message)("EAGAIN", debug)
export const eacces = (message: string, ...debug: any[]) => compose_rrr(message)("EACCES", debug)
export const eexist = (message: string, ...debug: any[]) => compose_rrr(message)("EEXIST", debug)
export const einval = (message: string, ...debug: any[]) => compose_rrr(message)("EINVAL", debug)
export const emfile = (message: string, ...debug: any[]) => compose_rrr(message)("EMFILE", debug)
export const efbig = (message: string, ...debug: any[]) => compose_rrr(message)("EFBIG", debug)
export const enospc = (message: string, ...debug: any[]) => compose_rrr(message)("ENOSPC", debug)

export const compose_rrr =
	(message: string) =>
	<$TKey extends keyof typeof ErrorType>(key: $TKey, ...debug: any[]): Ordo.Rrr<$TKey> => ({
		key,
		code: ErrorType[key] as const,
		debug,
		message,
	})

export const compose_rrr_thunk =
	(message: string) =>
	<$TKey extends keyof typeof ErrorType>(key: $TKey, ...debug: any[]) =>
	(): Ordo.Rrr<$TKey> => ({
		key,
		code: ErrorType[key] as const,
		debug,
		message,
	})

export const RRR = {
	enum: ErrorType,
	compose: compose_rrr,
	compose_thunk: compose_rrr_thunk,
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
		emfile,
		efbig,
		enospc,
	},
}
