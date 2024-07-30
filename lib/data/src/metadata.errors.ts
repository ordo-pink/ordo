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

// TODO: Put all RRRs here
// TODO: Reduce the amount of rrrs, reuse across apps
export enum RrrEnum {
	EPERM = 1, // Permission denied
	ENOENT, // Not found
	EINTR, // Interrupted
	EIO, // I/O error
	ENXIO, // Invalid address
	EAGAIN, // Loading
	EACCES, // Access denied
	EEXIST, // Already exists
	EINVAL, // Invalid
	EMFILE, // Too many open files
	EFBIG, // File too big
	ENOSPC, // Out of memory
}

export const eperm = (location: string) => (debug?: string) => composeRrr(location)("EPERM", debug)
export const enoent = (location: string) => (debug?: string) =>
	composeRrr(location)("ENOENT", debug)
export const eintr = (location: string) => (debug?: string) => composeRrr(location)("EINTR", debug)
export const eio = (location: string) => (debug?: string) => composeRrr(location)("EIO", debug)
export const enxio = (location: string) => (debug?: string) => composeRrr(location)("ENXIO", debug)
export const eagain = (location: string) => (debug?: string) =>
	composeRrr(location)("EAGAIN", debug)
export const eacces = (location: string) => (debug?: string) =>
	composeRrr(location)("EACCES", debug)
export const eexist = (location: string) => (debug?: string) =>
	composeRrr(location)("EEXIST", debug)
export const einval = (location: string) => (debug?: string) =>
	composeRrr(location)("EINVAL", debug)
export const emfile = (location: string) => (debug?: string) =>
	composeRrr(location)("EMFILE", debug)
export const efbig = (location: string) => (debug?: string) => composeRrr(location)("EFBIG", debug)
export const enospc = (location: string) => (debug?: string) =>
	composeRrr(location)("ENOSPC", debug)

export type TRrr<_TKey extends keyof typeof RrrEnum = keyof typeof RrrEnum> = {
	key: _TKey
	code: (typeof RrrEnum)[_TKey]
	location: string
	debug?: string
}

export const composeRrr =
	(location: string) =>
	<_TKey extends keyof typeof RrrEnum>(key: _TKey, debug?: string): TRrr<_TKey> => ({
		key,
		code: RrrEnum[key] as const,
		debug,
		location,
	})

export const composeRrrThunk =
	(location: string) =>
	<_TKey extends keyof typeof RrrEnum>(key: _TKey, debug?: string) =>
	(): TRrr<_TKey> => ({
		key,
		code: RrrEnum[key] as const,
		debug,
		location,
	})

export const RRR = {
	enum: RrrEnum,
	compose: composeRrr,
	composeT: composeRrrThunk,
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
