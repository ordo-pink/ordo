// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { type MetadataRepository } from "@ordo-pink/backend-data-service"
import type { SUB } from "@ordo-pink/backend-token-service"
import type { Unary } from "@ordo-pink/tau"

import { readFile0, writeFile0 } from "@ordo-pink/fs"
import { resolve } from "path"
import { Oath } from "@ordo-pink/oath"
import { Directory, File } from "@ordo-pink/datautil"

// --- Public ---

const of: Fn = ({ root }) => ({
	_internal: {
		createUserSpace: sub =>
			Oath.of(resolve(root, sub)).chain(path =>
				Oath.of(
					JSON.stringify([
						{
							path: "/",
							createdAt: new Date(Date.now()),
							updatedAt: new Date(Date.now()),
							createdBy: sub,
							updatedBy: sub,
						},
					]),
				).chain(data => writeFile0(resolve(path), data)),
			),
	},
	directory: {
		create: ({ directory, path, sub }) =>
			getUserMetadata0({ root, sub })
				.map(metadata => metadata.concat([{ ...directory, path }]))
				.chain(content => setUserMetadata0({ root, sub, content }))
				.map(() => ({ ...directory, path })),
		read: ({ path, sub }) =>
			getUserMetadata0({ root, sub }).map(
				metadata => metadata.find(item => item.path === path) as Directory,
			),
		getRoot: sub => getUserMetadata0({ root, sub }),
		update: ({ directory, path, sub }) =>
			getUserMetadata0({ root, sub })
				.chain(metadata =>
					Oath.of(metadata.findIndex(item => item.path === path)).map(itemToUpdate => {
						metadata.splice(itemToUpdate, 1, directory)
						return metadata
					}),
				)
				.chain(content => setUserMetadata0({ root, sub, content }))
				.map(() => directory),
		delete: ({ path, sub }) =>
			getUserMetadata0({ root, sub }).chain(metadata =>
				Oath.of(metadata.find(item => item.path === path)).chain(item =>
					item
						? Oath.of(metadata.filter(x => x.path !== item.path))
								.chain(content => setUserMetadata0({ root, sub, content }))
								.map(() => item as Directory)
						: Oath.of(null),
				),
			),
		exists: ({ path, sub }) =>
			getUserMetadata0({ root, sub })
				.map(metadata => metadata.some(item => item.path === path))
				.fix(() => false),
	},
	file: {
		create: ({ file, path, sub }) =>
			getUserMetadata0({ root, sub })
				.map(metadata => metadata.concat([{ ...file, path }]))
				.chain(content => setUserMetadata0({ root, sub, content }))
				.map(() => ({ ...file, path })),
		read: ({ path, sub }) =>
			getUserMetadata0({ root, sub }).map(
				metadata => metadata.find(item => item.path === path) as File,
			),
		update: ({ file, path, sub }) =>
			getUserMetadata0({ root, sub })
				.chain(metadata =>
					Oath.of(metadata.findIndex(item => item.path === path)).map(itemToUpdate => {
						metadata.splice(itemToUpdate, 1, file)
						return metadata
					}),
				)
				.chain(content => setUserMetadata0({ root, sub, content }))
				.map(() => file),
		delete: ({ path, sub }) =>
			getUserMetadata0({ root, sub }).chain(metadata =>
				Oath.of(metadata.find(item => item.path === path)).chain(item =>
					item
						? Oath.of(metadata.filter(x => x.path !== item.path))
								.chain(content => setUserMetadata0({ root, sub, content }))
								.map(() => item as File)
						: Oath.of(null),
				),
			),
		exists: ({ path, sub }) =>
			getUserMetadata0({ root, sub })
				.map(metadata => metadata.some(item => item.path === path))
				.fix(() => false),
	},
})

export const FSMetadataRepository = { of }

// --- Internal ---

type Params = { root: string }
type Fn = Unary<Params, MetadataRepository>

// ---

type GetUserMetadataParams = { root: string; sub: SUB }
type GetUserMetadataFn = Unary<GetUserMetadataParams, Oath<Array<Directory | File>, Error>>
const getUserMetadata0: GetUserMetadataFn = ({ root, sub }) =>
	Oath.of(resolve(root, sub))
		.chain(path => readFile0(path, "utf-8"))
		.map(text => JSON.parse(text as string) as Array<Directory | File>)

// ---

type SetUserMetadataParams = { root: string; sub: SUB; content: Array<Directory | File> }
type SetUserMetadataFn = Unary<SetUserMetadataParams, Oath<void, Error>>
const setUserMetadata0: SetUserMetadataFn = ({ root, sub, content }) =>
	Oath.of(JSON.stringify(content)).chain(arr => writeFile0(resolve(root, sub), arr, "utf-8"))
