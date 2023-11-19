// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Oath } from "@ordo-pink/oath"
import type { UserID, FSID } from "./data.types"
import type { Errors } from "./errors.impl"

export type ContentNotFound = (typeof Errors)["DataNotFound"]
export type ContentUnexpectedError = (typeof Errors)["UnexpectedError"]
export type ContentReadErrors = ContentNotFound | ContentUnexpectedError
export type ContentCreateErrors = ContentUnexpectedError
export type ContentWriteErrors = ContentUnexpectedError
export type ContentDeleteErrors = ContentNotFound | ContentUnexpectedError

/**
 * `ContentPersistenceStrategy` provides a set of methods used by the `DataService` to persist user
 * content. The generic type specifies the type of content to be provided. These methods are never
 * called if the current user does not have access to the file, or all files of the owner with the
 * given `UserID` in general. Owners themselves always have access to the content they own.
 */
export type ContentPersistenceStrategy<Content> = {
	/**
	 * Get content of a file with given `FSID` that is owned by the user with given `UserID`.
	 *
	 * @rejects with `ContentNotFound` if the owner does not exist or they do not own a file with given `FSID`.
	 * @rejects with `ContentUnexpectedError` if an error occurs while reading the file.
	 * @param uid `UserID` of the user who stores the file.
	 * @param fsid `FSID` of the file.
	 * @returns Oath of the file content or content read error.
	 */
	read: (uid: UserID, fsid: FSID) => Oath<Content, ContentReadErrors>

	/**
	 * Create content of a file with given `FSID` under ownership of the user with given `UserID`.
	 *
	 * @rejects with `ContentUnexpectedError` if an error occurs while creating the file.
	 * @param uid `UserID` of the user who will own the file.
	 * @param fsid `FSID` of the file to be created.
	 * @returns Oath of "OK" or content create error.
	 */
	create: (uid: UserID, fsid: FSID) => Oath<"OK", ContentCreateErrors>

	/**
	 * Write content to the file with given `FSID` under ownership of the user with given `UserID`.
	 *
	 * @rejects with `ContentUnexpectedError` if an error occurs while writing to the file.
	 * @param uid `UserID` of the user who owns the file.
	 * @param fsid `FSID` of the file to be updated.
	 * @param content Content to be written to the file.
	 * @param contentLength Expected length of provided content.
	 * @returns Oath of the new file size in bytes or content write error.
	 */
	write: (
		uid: UserID,
		fsid: FSID,
		content: Content,
		contentLength: number,
	) => Oath<number, ContentWriteErrors>

	/**
	 * Delete content of the file with given `FSID` under ownership of the user with given `UserID`.
	 *
	 * @rejects with `ContentNotFound` if the owner does not exist or they do not own a file with given `FSID`.
	 * @rejects with `ContentUnexpectedError` if an error occurs while deleting the file.
	 * @param uid `UserID` of the user who owns the file.
	 * @param fsid `FSID` of the file to be deleted.
	 * @returns Oath of "OK" or content delete error.
	 */
	delete: (uid: UserID, fsid: FSID) => Oath<"OK", ContentDeleteErrors>
}
