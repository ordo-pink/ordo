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

import type { PlainData, UserID } from "./data.types"
import { Errors } from "./errors.impl"
import type { FSID } from "./data.types"

export type DataNotFound = (typeof Errors)["DataNotFound"]
export type DataUnexpectedError = (typeof Errors)["UnexpectedError"]
export type DataAlreadyExists = (typeof Errors)["DataAlreadyExists"]
export type DataFindErrors = DataNotFound | DataUnexpectedError
export type DataCreateErrors = DataAlreadyExists | DataUnexpectedError
export type DataGetErrors = DataNotFound | DataUnexpectedError
export type DataGetAllErrors = DataNotFound | DataUnexpectedError
export type DataCountErrors = DataNotFound | DataUnexpectedError
export type DataUpdateErrors = DataAlreadyExists | DataNotFound | DataUnexpectedError
export type DataDeleteErrors = DataNotFound | DataUnexpectedError

/**
 * `DataPersistenceStrategy` provides a set of methods used by the `DataService` to persist user
 * data. These methods are never called if the current user does not have access to the file, or
 * all files of the owner with the given `UserID` in general. Owners themselves always have access
 * to the data they own.
 */
export type DataPersistenceStrategy = {
	/**
	 * Check if there is a file with given `FSID` owned by the user with given `UserID`. This method
	 * never rejects.
	 *
	 * @param uid `UserID` of the user who stores the file.
	 * @param fsid `FSID` of the file.
	 * @returns Oath of boolean that never rejects.
	 */
	exists: (uid: UserID, fsid: FSID) => Oath<boolean, never>

	/**
	 * Find data with given `name` and `parent` that is owned by the user with given `UserID`.
	 *
	 * @rejects with `DataNotFound` if the owner does not exist or they do not own a file that matches the search criteria.
	 * @rejects with `DataUnexpectedError` if an error occurs while searching for a file.
	 * @param uid `UserID` of the user who stores the file.
	 * @param name `name` of the file.
	 * @param parent `parent` of the file.
	 * @returns Oath of plain data or data find error.
	 */
	find: (uid: UserID, name: string, parent: FSID | null) => Oath<PlainData, DataFindErrors>

	/**
	 * Create given `PlainData` owned by the user with given `UserID`.
	 *
	 * TODO: Add `UserID` to specify data owner.
	 *
	 * @rejects with `DataAlreadyExists` if data with given `FSID` or `name`+`parent` pair already exists.
	 * @rejects with `DataUnexpectedError` if an error occurs while creating a file.
	 * @param plain `PlainData` object of the data to be created.
	 * @returns Oath of plain data or data create error.
	 */
	create: (plain: PlainData) => Oath<PlainData, DataCreateErrors>

	/**
	 * Get data with given `fsid` that is owned by the user with given `UserID`.
	 *
	 * @rejects with `DataNotFound` if the owner does not exist or they do not own a file with given `fsid`.
	 * @rejects with `DataUnexpectedError` if an error occurs while getting the file.
	 * @param uid `UserID` of the user who stores the file.
	 * @param fsid `FSID` of the file.
	 * @returns Oath of plain data or data get error.
	 */
	get: (uid: UserID, fsid: FSID) => Oath<PlainData, DataGetErrors>

	/**
	 * Get all data owned by the user with given `UserID`.
	 *
	 * @rejects with `DataNotFound` if the owner does not exist.
	 * @rejects with `DataUnexpectedError` if an error occurs while getting user data.
	 * @param uid `UserID` of the user who stores the file.
	 * @returns Oath of plain data array or data get all error.
	 */
	getAll: (uid: UserID) => Oath<PlainData[], DataGetAllErrors>

	/**
	 * Count all data owned by the user with given `UserID`.
	 *
	 * @rejects with `DataNotFound` if the owner does not exist.
	 * @rejects with `DataUnexpectedError` if an error occurs while counting user data.
	 * @param uid `UserID` of the user who stores the file.
	 * @returns Oath of number or data count error.
	 */
	count: (uid: UserID) => Oath<number, DataCountErrors>

	/**
	 * Update data with given `fsid` that is owned by the user with given `UserID`.
	 *
	 * TODO: Add `UserID` to specify data owner.
	 *
	 * @rejects with `DataAlreadyExists` if data with given `name` already exists under given `parent`.
	 * @rejects with `DataNotFound` if the owner does not exist or they do not own a file with given `fsid`.
	 * @rejects with `DataUnexpectedError` if an error occurs while updating the file.
	 * @param plain `PlainData` object of the update data.
	 * @returns Oath of "OK" or data update error.
	 */
	update: (plain: PlainData) => Oath<"OK", DataUpdateErrors>

	/**
	 * Create given `PlainData` owned by the user with given `UserID`.
	 *
	 * TODO: Add `UserID` to specify data owner.
	 *
	 * @rejects with `DataNotFound` if the owner does not exist or they do not own a file with given `fsid`.
	 * @rejects with `DataUnexpectedError` if an error occurs while deleting the file.
	 * @param uid `UserID` of the user who stores the file.
	 * @param fsid `FSID` of the file.
	 * @returns Oath of plain data or data create error.
	 */
	delete: (uid: UserID, fsid: FSID) => Oath<"OK", DataDeleteErrors>
}
