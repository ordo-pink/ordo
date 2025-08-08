/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

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

export enum REASON {
	/** Error type is self-explanatory. */
	OBVIOUS,
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
}
