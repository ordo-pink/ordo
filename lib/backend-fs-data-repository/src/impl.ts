// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { resolve } from "path"
import { createReadStream, createWriteStream } from "fs"
import { Readable } from "stream"
import { Unary } from "@ordo-pink/tau"
import { DataRepository } from "@ordo-pink/backend-data-service"
import { Oath } from "@ordo-pink/oath"
import { createFile0, createParentDirectory0, removeFile0, fileExists0, stat0 } from "@ordo-pink/fs"
import { FSID } from "@ordo-pink/datautil/src/common"

type Params = { root: string }
type Fn = Unary<Params, DataRepository<Readable>>

const of: Fn = ({ root }) => ({
	create: ({ sub, fsid }) =>
		Oath.of(fsid ? fsid : crypto.randomUUID()).chain(fsid =>
			Oath.of(resolve(root, ...sub.split("-"), ...fsid.split("-"))).chain(path =>
				createParentDirectory0(path)
					.chain(() => createFile0(path, "", "utf-8"))
					.map(() => fsid as FSID),
			),
		),
	delete: ({ fsid, sub }) =>
		Oath.of(resolve(root, ...sub.split("-"), ...fsid.split("-")))
			.chain(removeFile0)
			.map(() => fsid as FSID),
	exists: ({ sub, fsid }) =>
		Oath.of(resolve(root, ...sub.split("-"), ...fsid.split("-"))).chain(fileExists0),
	read: ({ sub, fsid }) =>
		Oath.of(resolve(root, ...sub.split("-"), ...fsid.split("-"))).chain(path =>
			Oath.try(async () => createReadStream(path)),
		),
	update: ({ content, fsid, sub, upsert = false }) =>
		Oath.of(resolve(root, ...sub.split("-"), ...fsid.split("-")))
			.chain(path =>
				of({ root })
					.exists({ sub, fsid })
					.chain(exists =>
						exists
							? Oath.of(path)
							: upsert
							? of({ root })
									.create({ sub, fsid })
									.map(() => path)
							: Oath.reject(new Error("file not found")),
					),
			)
			.chain(path =>
				Oath.try(() => createWriteStream(path)).chain(file =>
					Oath.try(() => content.pipe(file))
						.chain(() => stat0(path))
						.map(stat => stat.size),
				),
			),
})

export const FSDataRepository = { of }
