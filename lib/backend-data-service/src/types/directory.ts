// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { SUB } from "@ordo-pink/backend-token-service"
import type { NonEmpty, StartsWithSlash, EndsWithSlash, NoForbiddenSymbols } from "./common"
import type { File } from "./file"

/**
 * Valid structure of a Directory path.
 */
export type DirectoryPath = `/${string}/` | "/"

/**
 * Initialisation params for creating a Directory.
 */
export type DirectoryCreateParams<
	CustomMetadata extends Record<string, unknown> = Record<string, unknown>
> = Partial<Directory<CustomMetadata>> & {
	path: DirectoryPath
}

/**
 * Valid DirectoryPath or never.
 */
export type ValidatedDirectoryPath<T extends DirectoryPath> =
	| (NonEmpty<T> & StartsWithSlash<T> & EndsWithSlash<T> & NoForbiddenSymbols<T>)
	| "/"

/**
 * Plain Directory data transfe r object to be exchanged between the client and
 * the server.
 */
export type Directory<T extends Record<string, unknown> = Record<string, unknown>> = T & {
	path: DirectoryPath
	createdAt: Date
	updatedAt: Date
	createdBy: SUB
	updatedBy: SUB
}

export type DirectoryWithChildren<T extends Record<string, unknown> = Record<string, unknown>> =
	Directory<T> & {
		children: Array<DirectoryWithChildren | File>
	}
