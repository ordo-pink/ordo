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

import type { Oath } from "@ordo-pink/oath"

declare global {
	namespace OrdoBackend {
		namespace Data {
			type PersistenceStrategy = {
				exists: (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) => Oath.Instance<boolean, Ordo.Rrr<"EIO">>
				create: (
					uid: Ordo.User.UID,
					fsid: Ordo.Metadata.FSID,
					input: ReadableStream,
				) => Oath.Instance<number, Ordo.Rrr<"EIO" | "EEXIST">>
				read: (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) => Oath.Instance<ReadableStream, Ordo.Rrr<"EIO" | "ENOENT">>
				update: (
					uid: Ordo.User.UID,
					fsid: Ordo.Metadata.FSID,
					input: ReadableStream,
				) => Oath.Instance<number, Ordo.Rrr<"EIO" | "ENOENT">>
				delete: (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) => Oath.Instance<void, Ordo.Rrr<"EIO" | "ENOENT">>
				mtime: (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) => Oath.Instance<number, Ordo.Rrr<"EIO" | "ENOENT">>
			}
		}

		namespace Notification {
			type EmailStrategy = {
				send: (params: {
					from?: string
					to: string
					subject: string
					content: string
					cc?: string[]
					bcc?: string[]
					preview_title?: string
					headers?: Record<string, string>
				}) => void
			}
		}

		namespace User {
			/**
			 * Reference mapping serves in-memory mapping of user emails and handles to their identifiers. The
			 * mapping values cannot be updated directly, but the `refresh` method can be used to update the info
			 * stored for a specific identifier.
			 */
			type ReferenceMapping = {
				/**
				 * Lazily resolves with a boolean indicating whether a user exists with given handle.
				 *
				 * Rejects with EIO if the underlying persistence strategy cannot access mapping data.
				 */
				exists_by_handle: (handle: Ordo.User.Handle) => Oath.Instance<boolean, Ordo.Rrr<"EIO">>

				/**
				 * Resolves the {@link Ordo.User.UID identifier} of the user by given {@link Ordo.User.Handle handle}.
				 *
				 * Rejects with EIO if the underlying persistence strategy cannot access mapping data.
				 * Rejects with ENOENT if the user with given {@link Ordo.User.Handle handle} does not exist.
				 */
				get_by_handle: (handle: Ordo.User.Handle) => Oath.Instance<Ordo.User.UID, Ordo.Rrr<"EIO" | "ENOENT">>

				/**
				 * Lazily resolves with a boolean indicating whether a user exists with given {@link Ordo.User.Email email}.
				 *
				 * Rejects with EIO if the underlying persistence strategy cannot access mapping data.
				 */
				exists_by_email: (email: Ordo.User.Email) => Oath.Instance<boolean, Ordo.Rrr<"EIO">>

				/**
				 * Resolves the {@link Ordo.User.UID identifier} of the user by given {@link Ordo.User.Email email}.
				 *
				 * Rejects with EIO if the underlying persistence strategy cannot access mapping data.
				 * Rejects with ENOENT if the user with given email does not exist.
				 */
				get_by_email: (email: Ordo.User.Email) => Oath.Instance<Ordo.User.UID, Ordo.Rrr<"EIO" | "ENOENT">>

				/**
				 * Triggers refresh of user mappings for given {@link Ordo.User.UID identifier}.
				 *
				 * - Creates a mapping if it did not exist.
				 * - Updates {@link Ordo.User.Handle handle} and {@link Ordo.User.Email email} if they changed.
				 * - Removes the user if it no longer exists.
				 *
				 * Resolves with void on success.
				 *
				 * Rejects with EIO if the underlying persistence strategy cannot access or persist mapping data.
				 */
				refresh: (id: Ordo.User.UID) => Oath.Instance<void, Ordo.Rrr<"EIO">>
			}

			type PersistenceStrategy = {
				exists: (id: Ordo.User.UID) => Oath.Instance<boolean, Ordo.Rrr<"EIO">>
				create: (user: Ordo.User.Current.Instance) => Oath.Instance<Ordo.User.Current.Instance, Ordo.Rrr<"EIO" | "EEXIST">>
				read: (id: Ordo.User.UID) => Oath.Instance<Ordo.User.Current.Instance, Ordo.Rrr<"EIO" | "ENOENT">>
				update: (
					id: Ordo.User.UID,
					user: Ordo.User.Current.Instance,
				) => Oath.Instance<Ordo.User.Current.Instance, Ordo.Rrr<"EIO" | "ENOENT" | "EINVAL">>
				delete: (id: Ordo.User.UID) => Oath.Instance<void, Ordo.Rrr<"EIO" | "ENOENT">>
			}
		}
	}
}
