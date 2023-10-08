// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { createParentDirectory0, fileExists0, readFile0, writeFile0 } from "@ordo-pink/fs"
import { resolve } from "path"
import { Oath } from "@ordo-pink/oath"
import { DataRepository } from "@ordo-pink/data/src/data-repository.types"
import { Data, PlainData } from "@ordo-pink/data"
import { UnexpectedError } from "@ordo-pink/data/src/errors.impl"

const getPath = (root: string, uid: string) => resolve(root, `${uid}.json`)

const read0 = (root: string, uid: string) =>
	Oath.of(getPath(root, uid))
		.chain(path => createParentDirectory0(path).map(() => path))
		.chain(path =>
			fileExists0(path).chain(exists =>
				exists ? Oath.of(path) : writeFile0(path, "[]", "utf-8").map(() => path),
			),
		)
		.chain(path => readFile0(path, "utf8"))
		.chain(content => Oath.try(() => JSON.parse(content as string) as PlainData[]))

const write0 = (root: string, uid: string, content: PlainData[]) =>
	Oath.of(getPath(root, uid))
		.chain(path =>
			fileExists0(path).chain(exists =>
				exists ? Oath.of(path) : writeFile0(path, "[]", "utf-8").map(() => path),
			),
		)
		.chain(path => writeFile0(path, JSON.stringify(content, null, 2), "utf-8"))

const sorter = (a: PlainData, b: PlainData) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0)

type Params = { root: string }

const of = ({ root }: Params): DataRepository => ({
	count: uid =>
		read0(root, uid)
			.map(arr => arr.length)
			.rejectedMap(() => Data.Errors.DataNotFound),
	find: (uid, name, parent) =>
		read0(root, uid)
			.rejectedMap(UnexpectedError)
			.map(data => data.find(item => item.name === name && item.parent === parent))
			.chain(Oath.fromNullable)
			.rejectedMap(() => Data.Errors.DataNotFound),
	create: plain =>
		read0(root, plain.createdBy)
			.rejectedMap(UnexpectedError)
			.chain(data =>
				write0(root, plain.createdBy, [...data, plain].sort(sorter)).rejectedMap(UnexpectedError),
			)
			.map(() => plain),
	delete: (uid, fsid) =>
		read0(root, uid)
			.rejectedMap(UnexpectedError)
			.map(data => data.filter(item => item.fsid !== fsid))
			.chain(data => write0(root, uid, data).rejectedMap(UnexpectedError))
			.map(() => "OK"),
	exists: (uid, fsid) =>
		read0(root, uid)
			.map(data => data.some(item => item.fsid === fsid))
			.fix(() => false),
	get: (uid, fsid) =>
		read0(root, uid)
			.map(items => items.find(item => item.fsid === fsid))
			.chain(Oath.fromNullable)
			.rejectedMap(() => Data.Errors.DataNotFound),
	getAll: uid => read0(root, uid).rejectedMap(UnexpectedError),
	update: plain =>
		read0(root, plain.createdBy)
			.rejectedMap(UnexpectedError)
			.chain(data =>
				Oath.of(data.findIndex(item => item.fsid === plain.fsid))
					.chain(Oath.ifElse(x => x >= 0, { onFalse: () => Data.Errors.DataNotFound }))
					.map(index => {
						data.splice(index, 1, plain)
						return data
					})
					.chain(data => write0(root, plain.createdBy, data).rejectedMap(UnexpectedError))
					.map(() => "OK"),
			),
})

export const FSDataRepository = { of }
