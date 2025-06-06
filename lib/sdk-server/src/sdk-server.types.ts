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

import type { Data as CoreData, User as CoreUser, Rrr } from "@ordo-pink/sdk-core"
import type { Oath } from "@ordo-pink/oath"

export namespace Server {
	export namespace Data {
		export type PersistenceStrategy = {
			exists: (user_id: CoreUser.ID, data_id: CoreData.ID) => Oath.Instance<boolean, Rrr.Instance<"EIO">>
			create: (
				user_id: CoreUser.ID,
				data_id: CoreData.ID,
				input: ReadableStream,
			) => Oath.Instance<number, Rrr.Instance<"EIO" | "EEXIST">>
			read: (user_id: CoreUser.ID, data_id: CoreData.ID) => Oath.Instance<ReadableStream, Rrr.Instance<"EIO" | "ENOENT">>
			update: (
				user_id: CoreUser.ID,
				data_id: CoreData.ID,
				input: ReadableStream,
			) => Oath.Instance<number, Rrr.Instance<"EIO" | "ENOENT">>
			delete: (user_id: CoreUser.ID, data_id: CoreData.ID) => Oath.Instance<void, Rrr.Instance<"EIO" | "ENOENT">>
			mtime: (user_id: CoreUser.ID, data_id: CoreData.ID) => Oath.Instance<number, Rrr.Instance<"EIO" | "ENOENT">>
		}
	}

	export namespace Notification {
		export type EmailStrategy = {
			send: (params: {
				bcc?: string[]
				cc?: string[]
				content: string
				from?: string
				headers?: Record<string, string>
				preview_title?: string
				subject: string
				to: string
			}) => void
		}
	}

	export namespace User {
		/**
		 * Reference mapping serves in-memory mapping of user emails and handles to their identifiers. The
		 * mapping values cannot be updated directly, but the `refresh` method can be used to update the info
		 * stored for a specific identifier.
		 */
		export type ReferenceMapping = {
			/**
			 * Lazily resolves with a boolean indicating whether a user exists with given handle.
			 *
			 * Rejects with EIO if the underlying persistence strategy cannot access mapping data.
			 */
			exists_by_handle: (handle: CoreUser.Handle) => Oath.Instance<boolean, Rrr.Instance<"EIO">>

			/**
			 * Resolves the {@link CoreUser.ID identifier} of the user by given {@link CoreUser.Handle handle}.
			 *
			 * Rejects with EIO if the underlying persistence strategy cannot access mapping data.
			 * Rejects with ENOENT if the user with given {@link CoreUser.Handle handle} does not exist.
			 */
			get_by_handle: (handle: CoreUser.Handle) => Oath.Instance<CoreUser.ID, Rrr.Instance<"EIO" | "ENOENT">>

			/**
			 * Lazily resolves with a boolean indicating whether a user exists with given {@link CoreUser.Email email}.
			 *
			 * Rejects with EIO if the underlying persistence strategy cannot access mapping data.
			 */
			exists_by_email: (email: CoreUser.Email) => Oath.Instance<boolean, Rrr.Instance<"EIO">>

			/**
			 * Resolves the {@link CoreUser.ID identifier} of the user by given {@link CoreUser.Email email}.
			 *
			 * Rejects with EIO if the underlying persistence strategy cannot access mapping data.
			 * Rejects with ENOENT if the user with given email does not exist.
			 */
			get_by_email: (email: CoreUser.Email) => Oath.Instance<CoreUser.ID, Rrr.Instance<"EIO" | "ENOENT">>

			/**
			 * Triggers refresh of user mappings for given {@link CoreUser.ID identifier}.
			 *
			 * - Creates a mapping if it did not exist.
			 * - Updates {@link CoreUser.Handle handle} and {@link CoreUser.Email email} if they changed.
			 * - Removes the user if it no longer exists.
			 *
			 * Resolves with void on success.
			 *
			 * Rejects with EIO if the underlying persistence strategy cannot access or persist mapping data.
			 */
			refresh: (id: CoreUser.ID) => Oath.Instance<void, Rrr.Instance<"EIO">>
		}

		export type PersistenceStrategy = {
			exists: (id: CoreUser.ID) => Oath.Instance<boolean, Rrr.Instance<"EIO">>
			create: (user: CoreUser.Me.Instance) => Oath.Instance<CoreUser.Me.Instance, Rrr.Instance<"EIO" | "EEXIST">>
			read: (id: CoreUser.ID) => Oath.Instance<CoreUser.Me.Instance, Rrr.Instance<"EIO" | "ENOENT">>
			update: (
				id: CoreUser.ID,
				user: CoreUser.Me.Instance,
			) => Oath.Instance<CoreUser.Me.Instance, Rrr.Instance<"EIO" | "ENOENT" | "EINVAL">>
			delete: (id: CoreUser.ID) => Oath.Instance<void, Rrr.Instance<"EIO" | "ENOENT">>
		}
	}
}
