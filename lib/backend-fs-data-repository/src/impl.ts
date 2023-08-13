// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Unary } from "#lib/tau/mod.ts"
import { DataRepository, FSID } from "#lib/backend-data-service/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { resolve } from "#std/path/mod.ts"
import { createFile, createParentDirectoryFor, removeFile, stat } from "#lib/fs/mod.ts"
import { readableStreamFromReader } from "#std/streams/readable_stream_from_reader.ts"

type Params = { root: string }
type Fn = Unary<Params, DataRepository<ReadableStream>>

const of: Fn = ({ root }) => ({
	create: ({ sub, fsid }) =>
		Oath.of(fsid ? fsid : crypto.randomUUID()).chain(fsid =>
			Oath.of(resolve(root, ...sub.split("-"), ...fsid.split("-"))).chain(path =>
				createParentDirectoryFor(path)
					.chain(() => createFile(path).map(f => f.close()))
					.map(() => fsid as FSID)
			)
		),
	delete: ({ fsid, sub }) =>
		Oath.of(resolve(root, ...sub.split("-"), ...fsid.split("-")))
			.chain(removeFile)
			.map(() => fsid as FSID),
	exists: ({ sub, fsid }) =>
		Oath.of(resolve(root, ...sub.split("-"), ...fsid.split("-"))).chain(path =>
			stat(path)
				.map(() => true)
				.fix(() => false)
		),
	read: ({ sub, fsid }) =>
		Oath.of(resolve(root, ...sub.split("-"), ...fsid.split("-"))).chain(path =>
			Oath.try(async () => readableStreamFromReader(await Deno.open(path)))
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
							: Oath.reject(new Error("file not found"))
					)
			)
			.chain(path =>
				Oath.try(() => Deno.open(path, { write: true })).chain(file =>
					Oath.try(() => content.pipeTo(file.writable))
						.chain(() => stat(path))
						.map(stat => stat.size)
				)
			),
})

export const FSDataRepository = { of }
