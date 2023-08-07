// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import {
	FileModel,
	type Directory,
	type DirectoryWithChildren,
	type File,
	type MetadataRepository,
} from "#lib/universal-data-service/mod.ts"
import type { SUB } from "#lib/backend-token-service/mod.ts"
import type { Binary, Unary } from "#lib/tau/mod.ts"

import { getParentPath, readFile, writeFile } from "#lib/fs/mod.ts"
import { resolve } from "#std/path/mod.ts"
import { Oath } from "#lib/oath/mod.ts"

// --- Public ---

const of: Fn = ({ root }) => ({
	directory: {
		create: ({ directory, path, sub }) =>
			getUserMetadata0({ root, sub })
				.map(metadata => metadata.concat([{ ...directory, path }]))
				.chain(content => setUserMetadata0({ root, sub, content }))
				.map(() => ({ ...directory, path })),
		read: ({ path, sub }) =>
			getUserMetadata0({ root, sub }).map(
				metadata => metadata.find(item => item.path === path) as Directory
			),
		update: ({ directory, path, sub }) =>
			getUserMetadata0({ root, sub })
				.chain(metadata =>
					Oath.of(metadata.findIndex(item => item.path === path)).map(itemToUpdate => {
						metadata.splice(itemToUpdate, 1, directory)
						return metadata
					})
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
						: Oath.of(null)
				)
			),
		exists: ({ path, sub }) =>
			getUserMetadata0({ root, sub })
				.map(metadata => metadata.some(item => item.path === path))
				.fix(() => false),
		readWithChildren: ({ path, sub }) =>
			getUserMetadata0({ root, sub }).chain(items =>
				Oath.of(items.find(item => item.path === path)).map(directory =>
					createDirectoryTree(items, directory as Directory)
				)
			),
	},
	file: {
		create: ({ file, path, sub }) =>
			getUserMetadata0({ root, sub })
				.map(metadata => metadata.concat([{ ...file, path }]))
				.chain(content => setUserMetadata0({ root, sub, content }))
				.map(() => ({ ...file, path })),
		read: ({ path, sub }) =>
			getUserMetadata0({ root, sub }).map(
				metadata => metadata.find(item => item.path === path) as File
			),
		update: ({ file, path, sub }) =>
			getUserMetadata0({ root, sub })
				.chain(metadata =>
					Oath.of(metadata.findIndex(item => item.path === path)).map(itemToUpdate => {
						metadata.splice(itemToUpdate, 1, file)
						return metadata
					})
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
						: Oath.of(null)
				)
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
	readFile(resolve(root, sub))
		.map(content => new TextDecoder().decode(content))
		.map(JSON.parse)

// ---

type SetUserMetadataParams = { root: string; sub: SUB; content: Array<Directory | File> }
type SetUserMetadataFn = Unary<SetUserMetadataParams, Oath<void, Error>>
const setUserMetadata0: SetUserMetadataFn = ({ root, sub, content }) =>
	Oath.of(JSON.stringify(content))
		.map(str => new TextEncoder().encode(str))
		.chain(arr => writeFile(resolve(root, sub), arr))

// ---

type CreateDirectoryTreeFn = Binary<Array<File | Directory>, Directory, DirectoryWithChildren>
const createDirectoryTree: CreateDirectoryTreeFn = (items, directory) => {
	const neededItems = items.filter(item => item.path.startsWith(directory.path))
	const directoryWithChildren: DirectoryWithChildren = { ...directory, children: [] }

	for (const item of neededItems) {
		if (getParentPath(item.path) === directory.path) {
			if (FileModel.isValidPath(item.path)) {
				directoryWithChildren.children.push(item as File)
			} else {
				directoryWithChildren.children.push(createDirectoryTree(neededItems, item as Directory))
			}
		}
	}

	return directoryWithChildren
}
