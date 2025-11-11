/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

declare global {
	namespace Ordo.Content {
		/**
		 * Data repository implements CRUD access for a specific data storage, e.g.
		 * file system, S3, PostgreSQL, etc.
		 */
		type Repository = {
			/**
			 * Create data with given id under the ownership of given user. MUST reject
			 * with EEXIST if such combination of an owner and data id already exists.
			 * MAY reject with EIO if any other error occurs.
			 */
			create: (
				/** Id of the owner the data belongs to. */
				owner: Ordo.Data.OwnerUserId,
				/** Id to be assigned for the data. */
				data_id: Ordo.Data.Id,
				/** Actual content. */
				input: ReadableStream,
			) => Oath.Instance<number, Ordo.Rrr.Instance<"EIO" | "EEXIST">>

			/**
			 * Read contents of data with given dd owned by given owner. MUST reject
			 * with ENOENT if such combination of an owner and data id does not exist.
			 * MAY reject with EIO if any other error occurs.
			 */
			read: (
				/** Id of the owner the data belongs to. */
				owner: Ordo.Data.OwnerUserId,
				/** Id of the data. */
				data_id: Ordo.Data.Id,
			) => Oath.Instance<ReadableStream, Ordo.Rrr.Instance<"EIO" | "ENOENT">>

			/**
			 * Update contents of data with given id and owned by given owner with given
			 * data. The method implies a full rewrite. MUST reject with ENOENT if such
			 * combination of an owner and data id does not exist. MAY reject with EIO
			 * if any other error occurs.
			 */
			update: (
				/** Id of the owner the data belongs to. */
				owner: Ordo.Data.OwnerUserId,
				/** Id of the data. */
				data_id: Ordo.Data.Id,
				/** New content. */
				input: ReadableStream,
			) => Oath.Instance<number, Ordo.Rrr.Instance<"EIO" | "ENOENT">>

			/**
			 * Remove content with given id and owned by given owner. If data_id is not
			 * provided, this method implies removing the whole owner space. MUST reject
			 * with ENOENT if such combination of owner and data id (or just such owner
			 * when the data_id is not provided) does not exist. MAY reject with EIO if
			 * any other error occurs.
			 */
			delete: (
				/** Id of the owner the data belongs to. */
				owner: Ordo.Data.OwnerUserId,
				/** @optional Id of the data. */
				data_id: Ordo.Data.Id,
			) => Oath.Instance<void, Ordo.Rrr.Instance<"EIO" | "ENOENT">>
		}
	}
}

export {}
