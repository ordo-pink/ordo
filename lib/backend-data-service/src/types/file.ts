// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { SUB } from "@ordo-pink/backend-token-service"
import type { NoForbiddenSymbols, NonSlash, NonTrailingSlash, StartsWithSlash } from "./common"

/**
 * Unique identifier of a file body.
 */
export type FSID = `${string}-${string}-${string}-${string}-${string}`

/**
 * Files might or might not have a file extension. These are the two possible
 * options.
 *
 * @example `.png`
 * @example `.gitignore`
 * @example ``
 */
export type FileExtension = `.${string}` | ""

/**
 * Valid structure of a valid OrdoFile and OrdoFile path.
 */
export type FilePath = `/${string}`

/**
 * Plain File data transfer object to be exchanged between the client and the
 * server.
 */
export type File<CustomMetadata extends Record<string, unknown> = Record<string, unknown>> =
	CustomMetadata & {
		fsid: FSID
		path: FilePath
		size: number | bigint
		createdAt: Date
		updatedAt: Date
		createdBy: SUB
		updatedBy: SUB
		encryption: string | false
		links: FSID[]
		labels: string[]
	}

/**
 * Initialisation params for creating a File.
 */
export type FileCreateParams<
	CustomMetadata extends Record<string, unknown> = Record<string, unknown>,
> = Partial<File<CustomMetadata>> & {
	path: FilePath
}

/**
 * Proper OrdoFilePath or never.
 */
export type ValidatedFilePath<T extends FilePath> = StartsWithSlash<T> &
	NonTrailingSlash<T> &
	NonSlash<T> &
	NoForbiddenSymbols<T>
