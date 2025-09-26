/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import * as fns from "./fns.impl"

// --- Constants ---

/** Non-human-readable representation of the error type. */
export enum TYPE {
	/** Unknown error. You broke your comp IDK. */
	EUNKNOWN,
	/** Permission denied. */
	EPERM,
	/** Not found. */
	ENOENT,
	/** Interrupted. */
	EINTR,
	/** I/O error. */
	EIO,
	/** Invalid address. */
	ENXIO,
	/** Loading. */
	EAGAIN,
	/** Access denied. */
	EACCES,
	/** Already exists. */
	EEXIST,
	/** Invalid. */
	EINVAL,
	/** File too big. */
	EFBIG,
	/** Out of memory. */
	ENOSPC,
	/** ENUM length. */
	length,
}

export enum REASON {
	/** Error type is self-explanatory. */
	NO,
	/** The service is initialized incorrectly. FIX ASAP! */
	INVALID_SERVICE_INITIALIZATION,
	/** Provided input could not be parsed. */
	JSON_PARSE_FAILED,
	/** Provided input could not be initialized. */
	JSON_STRINGIFY_FAILED,
	/** Could not write a file. */
	FILE_WRITE_FAILED,
	/** Could not read a file. */
	FILE_READ_FAILED,
	/** Could not delete a file. */
	FILE_UNLINK_FAILED,
	/** Email was not provided. */
	EMAIL_MISSING,
	/** Provided email was not valid. */
	EMAIL_INVALID,
	/** Ref was not provided. */
	REF_MISSING,
	/** Provided ref was not valid. */
	REF_INVALID,
	/** Id was not provided. */
	USER_ID_MISSING,
	/** Provided id was not valid. */
	USER_ID_INVALID,
	/** Captain Cookie. */
	MISSING_REQUIRED_COOKIE,

	MISSING_X_DEVICE_HEADER,
	/** User attempted to request authentication having an authentication cookie. */
	ALREADY_AUTHENTICATED,
	/** Something went wrong with hashing or verifying hashes. */
	HASHING_ISSUE,

	USER_NOT_FOUND,

	MALFORMED_REQUEST_BODY,

	CODE_INVALID,
}

// --- Impl ---

const create: Ordo.Rrr.Create = t => fns.curry((m, d) => ({ type: TYPE[t], message: m, debug: d }))

export const eacces = create("EACCES")
export const eagain = create("EAGAIN")
export const eexist = create("EEXIST")
export const efbig = create("EFBIG")
export const eintr = create("EINTR")
export const einval = create("EINVAL")
export const eio = create("EIO")
export const enoent = create("ENOENT")
export const enospc = create("ENOSPC")
export const enxio = create("ENXIO")
export const eperm = create("EPERM")
export const eunknown = create("EUNKNOWN")

export const to_readable: Ordo.Rrr.ToReadable = t => TYPE[t] as Ordo.Rrr.Type

export const to_http_status_code: Ordo.Rrr.ToHttpStatusCode = t => {
	switch (t) {
		case TYPE.EAGAIN:
			return 425
		case TYPE.ENXIO:
			return 408
		case TYPE.ENOSPC:
			return 402
		case TYPE.EFBIG:
			return 413
		case TYPE.EINVAL:
			return 400
		case TYPE.EACCES:
			return 401
		case TYPE.EPERM:
			return 403
		case TYPE.ENOENT:
			return 404
		case TYPE.EEXIST:
			return 409
		default:
			return 500
	}
}

// --- Types ---

declare global {
	namespace Ordo.Rrr {
		export type Type = Exclude<keyof typeof TYPE, "length">

		export type Instance<$Type extends Type = Type> = { type: (typeof TYPE)[$Type]; message: string | number; debug: any[] }

		export type Create = <$Type extends Type>(
			type: $Type,
		) => Ordo.Fns.Curry<[message: string | number, info: any], Instance<$Type>>

		export type ToHttpStatusCode = (type: TYPE) => number

		export type ToReadable = (type: TYPE) => Type
	}
}
