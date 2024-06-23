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

import { ContentPersistenceStrategy, Data, UnexpectedError } from "@ordo-pink/data"
import { createParentIfNotExists0, removeFile0, stat0, writeFile0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { bimap0 } from "@ordo-pink/oath/operators/bimap"
import { chain0 } from "@ordo-pink/oath/operators/chain"
import { fromPromise0 } from "@ordo-pink/oath/constructors/from-promise"
import { map0 } from "@ordo-pink/oath/operators/map"
import { rejectedMap0 } from "@ordo-pink/oath/operators/rejected-map"
import { try0 } from "@ordo-pink/oath/constructors/try"

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
			Oath.resolve(getPath(root, uid, fsid))
				.pipe(chain0(createParentDirIfNotExists0))
				.pipe(chain0(createEmptyFileContent0))
				.pipe(map0(ok)),

		delete: (uid, fsid) =>
			Oath.resolve(getPath(root, uid, fsid))
				.pipe(chain0(removeFile0))
				.pipe(bimap0(() => Data.Errors.DataNotFound, ok)),

		read: (uid, fsid) => Oath.resolve(getPath(root, uid, fsid)).pipe(chain0(readFileContent0)),

		write: (uid, fsid, content) =>
			Oath.resolve(getPath(root, uid, fsid))
				.pipe(chain0(createParentDirIfNotExists0))
				.pipe(chain0(writeFileContent0(content)))
				.pipe(chain0(getFileSize0)),
	}),
}

// --- Internal ---

const ok = () => "OK" as const

const getPath = (root: string, uid: string, fsid: string): string =>
	resolve(root, ...uid.split("-"), ...fsid.split("-"))

const createParentDirIfNotExists0 = (path: string) =>
	createParentIfNotExists0(path).pipe(bimap0(UnexpectedError, () => path))

const getFileSize0 = (path: string) =>
	stat0(path).pipe(bimap0(UnexpectedError, stat => Number(stat.size)))

const createWriteStream0 = (path: string) =>
	try0(() => createWriteStream(path, { autoClose: true }))

const awaitStreamWriteCompleteP = (file: Writable, content: Readable) =>
	new Promise<void>((resolve, reject) => {
		file.on("finish", resolve)
		file.on("error", reject)
		content.on("error", reject)
		content.pipe(file)
	})

const readFileContent0 = (path: string) =>
	try0(() => createReadStream(path)).fix(() => {
		const stream = new Readable()
		stream.push("")
		stream.push(null)

		return stream
	})

const writeFileContent0 = (content: Readable) => (path: string) =>
	createWriteStream0(path)
		.pipe(chain0(file => fromPromise0<void, Error>(() => awaitStreamWriteCompleteP(file, content))))
		.pipe(bimap0(UnexpectedError, () => path))

const createEmptyFileContent0 = (path: string) =>
	writeFile0(path, "", "utf8").pipe(rejectedMap0(UnexpectedError))
