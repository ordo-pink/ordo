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

import type { Oath } from "@ordo-pink/oath"

import type { FSID, UserID } from "./data.types"
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
