/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
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

import type { Core } from "@ordo-pink/sdk-core"
import type { Oath } from "@ordo-pink/oss-oath"

/**
 * Data repository implements CRUD access for a specific data storage, e.g.
 * file system, S3, PostgreSQL, etc.
 */
export type Repository = {
	/**
	 * Create data with given id under the ownership of given user. MUST reject
	 * with EEXIST if such combination of an owner and data id already exists.
	 * MAY reject with EIO if any other error occurs.
	 */
	create: (
		/** Id of the owner the data belongs to. */
		owner: Core.Data.OwnerUserId,
		/** Id to be assigned for the data. */
		data_id: Core.Data.Id,
		/** Actual content. */
		input: ReadableStream,
	) => Oath.Instance<number, Core.Rrr.Instance<"EIO" | "EEXIST">>

	/**
	 * Read contents of data with given dd owned by given owner. MUST reject
	 * with ENOENT if such combination of an owner and data id does not exist.
	 * MAY reject with EIO if any other error occurs.
	 */
	read: (
		/** Id of the owner the data belongs to. */
		owner: Core.Data.OwnerUserId,
		/** Id of the data. */
		data_id: Core.Data.Id,
	) => Oath.Instance<ReadableStream, Core.Rrr.Instance<"EIO" | "ENOENT">>

	/**
	 * Update contents of data with given id and owned by given owner with given
	 * data. The method implies a full rewrite. MUST reject with ENOENT if such
	 * combination of an owner and data id does not exist. MAY reject with EIO
	 * if any other error occurs.
	 */
	update: (
		/** Id of the owner the data belongs to. */
		owner: Core.Data.OwnerUserId,
		/** Id of the data. */
		data_id: Core.Data.Id,
		/** New content. */
		input: ReadableStream,
	) => Oath.Instance<number, Core.Rrr.Instance<"EIO" | "ENOENT">>

	/**
	 * Remove content with given id and owned by given owner. If data_id is not
	 * provided, this method implies removing the whole owner space. MUST reject
	 * with ENOENT if such combination of owner and data id (or just such owner
	 * when the data_id is not provided) does not exist. MAY reject with EIO if
	 * any other error occurs.
	 */
	delete: (
		/** Id of the owner the data belongs to. */
		owner: Core.Data.OwnerUserId,
		/** @optional Id of the data. */
		data_id?: Core.Data.Id,
	) => Oath.Instance<void, Core.Rrr.Instance<"EIO" | "ENOENT">>
}
