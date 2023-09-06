// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { resolve } from "path"
import { createReadStream, createWriteStream } from "fs"
import { Readable } from "stream"
import { Oath } from "@ordo-pink/oath"
import { createParentDirectory0, removeFile0, stat0, writeFile0 } from "@ordo-pink/fs"
import { ContentRepository, UnexpectedError } from "@ordo-pink/data"
import { noop } from "@ordo-pink/tau"

type Params = { root: string }

const getPath = (root: string, uid: string, fsid: string) =>
	resolve(root, ...uid.split("-"), ...fsid.split("-"))

const of = ({ root }: Params): ContentRepository<Readable> => ({
	create: (uid, fsid) =>
		Oath.of(getPath(root, uid, fsid))
			.chain(path => createParentDirectory0(path).map(() => path))
			.chain(path => writeFile0(path, "", "utf8"))
			.map(() => "OK" as const)
			.rejectedMap(UnexpectedError),
	delete: (uid, fsid) =>
		Oath.of(getPath(root, uid, fsid))
			.chain(removeFile0)
			.fix(noop)
			.map(() => "OK"),
	read: (uid, fsid) =>
		Oath.of(getPath(root, uid, fsid)).chain(path => Oath.try(async () => createReadStream(path))),
	write: (uid, fsid, content) =>
		Oath.of(getPath(root, uid, fsid))
			.chain(path =>
				createParentDirectory0(path)
					.map(() => path)
					.rejectedMap(() => "Data not found" as const),
			)
			.chain(path =>
				Oath.try(() => createWriteStream(path))
					.rejectedMap(() => "Data not found" as const)
					.chain(file =>
						Oath.try(
							() =>
								new Promise((resolve, reject) => {
									content.pipe(file).on("error", reject).on("finish", resolve)
								}),
						)
							.rejectedMap(() => "Data not found" as const)
							.chain(() => stat0(path))
							.map(stat => Number(stat.size)),
					),
			),
})

export const FSContentRepository = { of }
