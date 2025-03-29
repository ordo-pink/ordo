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
				exists: (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) => Oath<boolean, Ordo.Rrr<"EIO">>
				create: (
					uid: Ordo.User.UID,
					fsid: Ordo.Metadata.FSID,
					input: ReadableStream,
				) => Oath<number, Ordo.Rrr<"EIO" | "EEXIST">>
				read: (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) => Oath<ReadableStream, Ordo.Rrr<"EIO" | "ENOENT">>
				update: (
					uid: Ordo.User.UID,
					fsid: Ordo.Metadata.FSID,
					input: ReadableStream,
				) => Oath<number, Ordo.Rrr<"EIO" | "ENOENT">>
				delete: (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) => Oath<void, Ordo.Rrr<"EIO" | "ENOENT">>
				mtime: (uid: Ordo.User.UID, fsid: Ordo.Metadata.FSID) => Oath<number, Ordo.Rrr<"EIO" | "ENOENT">>
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
					headers?: Record<string, string>
				}) => void
			}
		}

		namespace User {
			type MappingStrategy = {
				exists_by_handle: (handle: Ordo.User.Handle) => Oath<boolean, Ordo.Rrr<"EIO">>
				exists_by_email: (email: Ordo.User.Email) => Oath<boolean, Ordo.Rrr<"EIO">>
				get_by_email: (email: Ordo.User.Email) => Oath<Ordo.User.UID, Ordo.Rrr<"EIO" | "ENOENT">>
				get_by_handle: (handle: Ordo.User.Handle) => Oath<Ordo.User.UID, Ordo.Rrr<"EIO" | "ENOENT">>
			}

			type PersistenceStrategy = {
				exists: (id: Ordo.User.UID) => Oath<boolean, Ordo.Rrr<"EIO">>
				create: (user: Ordo.User.Current.Instance) => Oath<Ordo.User.Current.Instance, Ordo.Rrr<"EIO" | "EEXIST">>
				read: (id: Ordo.User.UID) => Oath<Ordo.User.Current.Instance, Ordo.Rrr<"EIO" | "ENOENT">>
				update: (
					id: Ordo.User.UID,
					user: Ordo.User.Current.Instance,
				) => Oath<Ordo.User.Current.Instance, Ordo.Rrr<"EIO" | "ENOENT" | "EINVAL">>
				delete: (id: Ordo.User.UID) => Oath<void, Ordo.Rrr<"EIO" | "ENOENT">>
			}
		}
	}
}
