// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { ErrorType } from "@ordo-pink/core"

export const eperm =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("EPERM", debug)
export const enoent =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("ENOENT", debug)
export const eintr =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("EINTR", debug)
export const eio =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("EIO", debug)
export const enxio =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("ENXIO", debug)
export const eagain =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("EAGAIN", debug)
export const eacces =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("EACCES", debug)
export const eexist =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("EEXIST", debug)
export const einval =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("EINVAL", debug)
export const emfile =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("EMFILE", debug)
export const efbig =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("EFBIG", debug)
export const enospc =
	(location: string) =>
	(...debug: any[]) =>
		compose_rrr(location)("ENOSPC", debug)

export const compose_rrr =
	(location: string) =>
	<$TKey extends keyof typeof ErrorType>(key: $TKey, ...debug: any[]): Ordo.Rrr<$TKey> => ({
		key,
		code: ErrorType[key] as const,
		debug,
		location,
	})

export const compose_rrr_thunk =
	(location: string) =>
	<$TKey extends keyof typeof ErrorType>(key: $TKey, ...debug: any[]) =>
	(): Ordo.Rrr<$TKey> => ({
		key,
		code: ErrorType[key] as const,
		debug,
		location,
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
