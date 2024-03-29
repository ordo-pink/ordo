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

import {
	ContentPersistenceStrategy,
	Data,
	DataNotFound,
	DataUnexpectedError,
	UnexpectedError,
} from "@ordo-pink/data"
import { createParentIfNotExists0, removeFile0, stat0, writeFile0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"

type Params = { root: string }

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
	of: ({ root }: Params): ContentPersistenceStrategy<Readable> => ({
		create: (uid, fsid) =>
			Oath.of(getPath(root, uid, fsid))
				.chain(createParentDirIfNotExists0)
				.chain(createEmptyFileContent0)
				.map(() => "OK"),

		delete: (uid, fsid) =>
			Oath.of(getPath(root, uid, fsid))
				.chain(removeFile0)
				.bimap(
					() => Data.Errors.DataNotFound,
					() => "OK",
				),

		read: (uid, fsid) => Oath.of(getPath(root, uid, fsid)).chain(readFileContent0),

		write: (uid, fsid, content) =>
			Oath.of(getPath(root, uid, fsid))
				.chain(createParentDirIfNotExists0)
				.chain(writeFileContent0(content))
				.chain(getFileSize0),
	}),
}

// --- Internal ---

const getPath = (root: string, uid: string, fsid: string): string =>
	resolve(root, ...uid.split("-"), ...fsid.split("-"))

const createParentDirIfNotExists0 = (path: string): Oath<string, DataUnexpectedError> =>
	createParentIfNotExists0(path).bimap(UnexpectedError, () => path)

const getFileSize0 = (path: string): Oath<number> => stat0(path).map(stat => Number(stat.size))

const createWriteStream0 = (path: string): Oath<Writable, DataUnexpectedError> =>
	Oath.try(() => createWriteStream(path, { autoClose: true })).rejectedMap(UnexpectedError)

const awaitStreamWriteComplete = (file: Writable, content: Readable): Promise<void> =>
	new Promise<void>((resolve, reject) => {
		file.on("finish", resolve)
		file.on("error", reject)
		content.on("error", reject)
		content.pipe(file)
	})

const readFileContent0 = (path: string): Oath<Readable, DataNotFound> =>
	Oath.try(() => createReadStream(path)).rejectedMap(() => Data.Errors.DataNotFound)

const writeFileContent0 =
	(content: Readable) =>
	(path: string): Oath<string, DataUnexpectedError> =>
		createWriteStream0(path)
			.chain(file => Oath.from(() => awaitStreamWriteComplete(file, content)))
			.map(() => path)

const createEmptyFileContent0 = (path: string): Oath<void, DataUnexpectedError> =>
	writeFile0(path, "", "utf8").rejectedMap(UnexpectedError)
