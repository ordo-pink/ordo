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
} from "@ordo-pink/backend-data-service"
import type { SUB } from "@ordo-pink/backend-token-service"
import type { Binary, Unary } from "@ordo-pink/tau"

import { getParentPath, readFile0, writeFile0 } from "@ordo-pink/fs"
import { resolve } from "path"
import { Oath } from "@ordo-pink/oath"

// --- Public ---

const of: Fn = ({ root }) => ({
	_internal: {
		createUserSpace: sub =>
			Oath.of(resolve(root, sub)).chain(path =>
				Oath.of(path)
					.map(() => new TextEncoder())
					.map(encoder =>
						encoder.encode(
							JSON.stringify([
								{
									path: "/",
									createdAt: new Date(Date.now()),
									updatedAt: new Date(Date.now()),
									createdBy: sub,
									updatedBy: sub,
								},
							])
						)
					)
					.chain(data => writeFile0(resolve(path), data))
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
				metadata => metadata.find(item => item.path === path) as Directory
			),
		getRoot: sub => getUserMetadata0({ root, sub }),
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
	Oath.of(resolve(root, sub))
		.chain(path => readFile0(path, "utf-8"))
		.map(text => JSON.parse(text as string) as Array<Directory | File>)

// ---

type SetUserMetadataParams = { root: string; sub: SUB; content: Array<Directory | File> }
type SetUserMetadataFn = Unary<SetUserMetadataParams, Oath<void, Error>>
const setUserMetadata0: SetUserMetadataFn = ({ root, sub, content }) =>
	Oath.of(JSON.stringify(content))
		.map(str => new TextEncoder().encode(str))
		.chain(arr => writeFile0(resolve(root, sub), arr, "utf-8"))

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
