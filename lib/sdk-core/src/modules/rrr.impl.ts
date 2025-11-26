/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { impl as fns } from "./fns.impl"

export namespace CONSTANTS {
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

		EMAIL_STRATEGY_FAILED,

		INVALID_TOKEN,

		SESSION_MISSING_OR_EXPIRED,

		REPOSITORY_ISSUE,

		DATA_NOT_FOUND,

		DATA_ALREADY_EXISTS,

		DATA_DESCENDENT_CANNOT_BE_PARENT,

		DATA_UPDATE_PERMISSION_DENIED,

		DATA_DELETE_PERMISSION_DENIED,

		RESERVED_F_NAME,
	}
}

export namespace impl {
	const create: Ordo.Rrr.Create = t => fns.curry((message, debug) => ({ type: CONSTANTS.TYPE[t], message, debug }))

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

	export const to_readable: Ordo.Rrr.ToReadable = t => CONSTANTS.TYPE[t] as Ordo.Rrr.ReadableType

	export const to_http_status_code: Ordo.Rrr.ToHttpStatusCode = t => {
		switch (t) {
			case CONSTANTS.TYPE.EAGAIN:
				return 425
			case CONSTANTS.TYPE.ENXIO:
				return 408
			case CONSTANTS.TYPE.ENOSPC:
				return 402
			case CONSTANTS.TYPE.EFBIG:
				return 413
			case CONSTANTS.TYPE.EINVAL:
				return 400
			case CONSTANTS.TYPE.EACCES:
				return 401
			case CONSTANTS.TYPE.EPERM:
				return 403
			case CONSTANTS.TYPE.ENOENT:
				return 404
			case CONSTANTS.TYPE.EEXIST:
				return 409
			default:
				return 500
		}
	}
}

declare global {
	namespace Ordo.Rrr {
		export type Type = CONSTANTS.TYPE

		export type ReadableType = Exclude<keyof typeof CONSTANTS.TYPE, "length">

		export type Instance<$Type extends ReadableType = ReadableType> = {
			type: (typeof CONSTANTS.TYPE)[$Type]
			message: string | number
			debug: any[]
		}

		export type Create = <$Type extends ReadableType>(
			type: $Type,
		) => Ordo.Fns.Curried<(message: string | number, info: any) => Instance<$Type>>

		export type ToHttpStatusCode = (type: Type) => number

		export type ToReadable = (type: Type) => ReadableType
	}
}
