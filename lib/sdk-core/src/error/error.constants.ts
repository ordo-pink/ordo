/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace RRR {
	/**
	 * Non-human-readable representation of the error type.
	 */
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
}
