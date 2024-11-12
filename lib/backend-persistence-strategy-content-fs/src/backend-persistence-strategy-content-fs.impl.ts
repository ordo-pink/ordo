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

import { Readable, Writable } from "stream"
import { createReadStream, createWriteStream } from "fs"
import { resolve } from "path"

import { create_parent_if_not_exists0, removeFile0, stat0, write_file0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"

import { TPersistenceStrategyContentFSParams } from "./backend-persistence-strategy-content-fs.types"

/**
 * `ContentPersistenceStrategyFS` implements `ContentPersistenceStrategy` for storing content using
 * file system. To create a `ContentPersistenceStrategyFS`, you need to provide the root directory
 * where all the content will be stored. This strategy will automatically create the root directory
 * if it does not exist.
 *
 * @warning This strategy is not intended to be used in production.
 *
 * @example
 * const contentPersistenceStrategy = ContentPersistenceStrategyFS.of({
 *   root: "/var/ordo/content",
 * })
 */
export const ContentPersistenceStrategyFS = {
	/**
	 * `ContentPersistenceStrategyFS` factory.
	 */
	of: ({ root }: TPersistenceStrategyContentFSParams): ContentPersistenceStrategy<Readable> => ({
		create: (uid, fsid) =>
			Oath.Resolve(getPath(root, uid, fsid))
				.pipe(chain_oath(createParentDirIfNotExists0))
				.pipe(chain_oath(createEmptyFileContent0))
				.pipe(map_oath(ok)),

		delete: (uid, fsid) =>
			Oath.Resolve(getPath(root, uid, fsid))
				.pipe(chain_oath(removeFile0))
				.pipe(bimap_oath(() => Data.Errors.DataNotFound, ok)),

		read: (uid, fsid) => Oath.Resolve(getPath(root, uid, fsid)).pipe(chain_oath(readFileContent0)),

		write: (uid, fsid, content) =>
			Oath.Resolve(getPath(root, uid, fsid))
				.pipe(chain_oath(createParentDirIfNotExists0))
				.pipe(chain_oath(writeFileContent0(content)))
				.pipe(chain_oath(getFileSize0)),
	}),
}

// --- Internal ---

const ok = () => "OK" as const

const getPath = (root: string, uid: string, fsid: string): string =>
	resolve(root, ...uid.split("-"), ...fsid.split("-"))

const createParentDirIfNotExists0 = (path: string) =>
	create_parent_if_not_exists0(path).pipe(bimap_oath(UnexpectedError, () => path))

const getFileSize0 = (path: string) =>
	stat0(path).pipe(bimap_oath(UnexpectedError, stat => Number(stat.size)))

const createWriteStream0 = (path: string) =>
	try_oath(() => createWriteStream(path, { autoClose: true }))

const awaitStreamWriteCompleteP = (file: Writable, content: Readable) =>
	new Promise<void>((resolve, reject) => {
		file.on("finish", resolve)
		file.on("error", reject)
		content.on("error", reject)
		content.pipe(file)
	})

const readFileContent0 = (path: string) =>
	try_oath(() => createReadStream(path)).fix(() => {
		const stream = new Readable()
		stream.push("")
		stream.push(null)

		return stream
	})

const writeFileContent0 = (content: Readable) => (path: string) =>
	createWriteStream0(path)
		.pipe(
			chain_oath(file =>
				from_promise_oath<void, Error>(() => awaitStreamWriteCompleteP(file, content)),
			),
		)
		.pipe(bimap_oath(UnexpectedError, () => path))

const createEmptyFileContent0 = (path: string) =>
	write_file0(path, "", "utf8").pipe(rejected_map_oath(UnexpectedError))
