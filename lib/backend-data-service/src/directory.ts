// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { SUB } from "@ordo-pink/backend-token-service/mod.ts"
import { isValidPath, endsWithSlash } from "./common.ts"
import { Directory, DirectoryPath } from "@ordo-pink/backend-data-service/mod.ts"
import { Nullable } from "@ordo-pink/tau/mod.ts"

/**
 * OrdoDirectory represents a directory in Ordo. It contains the "head" of the
 * directory, also referred to as directory `metadata`. Apart from the default
 * metadata, custom values can be provided as well. Custom metadata is used by
 * extensions to do whatever they need to do with directories. Metadata is
 * persistent. OrdoDirectory is an immutable object. It is not intended to be
 * changed directly. All the changes to the directory metadata need to be made
 * with `DirectoryModel` that returns a new OrdoDirectory with all the changes
 * applied.
 */
export class DirectoryModel<
	CustomMetadata extends Record<string, unknown> = Record<string, unknown>,
> {
	/**
	 * Creates an OrdoDirectory from a list of required fields. You would not
	 * need this method usually. Use `OrdoDirectory.from` to create an
	 * OrdoDirectory from an `DirectoryDTO`.
	 *
	 * @throws if provided path is not a valid `DirectoryPath`.
	 * @throws if any of the required fields is missing.
	 *
	 * @param {DirectoryPath} path - path to the directory.
	 * @param {SUB} createdBy - id of the user that created the directory.
	 * @param {SUB} updatedBy - id of the user that made the latest change to the directory.
	 * @param {Date} createdAt - creation time.
	 * @param {Date} updatedAt - last update time.
	 * @param {CustomMetadata} metadata - custom directory metadata provided by Ordo extensions.
	 *
	 * @returns {DirectoryModel<CustomMetadata>} - Ordo directory.
	 */
	public static of<CustomMetadata extends Record<string, unknown> = Record<string, unknown>>(
		path: DirectoryPath,
		createdBy: SUB,
		updatedBy: SUB,
		createdAt = new Date(Date.now()),
		updatedAt = new Date(Date.now()),
		metadata: CustomMetadata = {} as CustomMetadata,
	) {
		if (!DirectoryModel.isValidPath(path)) throw new Error("Invalid file path")
		if (!createdBy) throw new Error("Unknown createdBy")
		if (!updatedBy) throw new Error("Unknown updatedBy")

		return new DirectoryModel(path, createdAt, updatedAt, createdBy, updatedBy, metadata)
	}

	public static getParentPath(path: DirectoryPath): Nullable<DirectoryPath> {
		const sliceablePath = path.slice(0, -1)

		if (!sliceablePath) return null

		const lastSeparatorPosition = sliceablePath.lastIndexOf("/") + 1

		return sliceablePath.slice(0, lastSeparatorPosition) as DirectoryPath
	}

	/**
	 * Creates an OrdoDirectory from an DirectoryDTO.
	 *
	 * @param {Directory} - DirectoryDTO to create an OrdoDirectory from.
	 *
	 * @returns {DirectoryModel} - a valid OrdoDirectory.
	 */
	public static from<CustomMetadata extends Record<string, unknown> = Record<string, unknown>>({
		path,
		createdAt,
		updatedAt,
		createdBy,
		updatedBy,
		...metadata
	}: Directory<CustomMetadata>): DirectoryModel<CustomMetadata> {
		return DirectoryModel.of(
			path,
			createdBy,
			updatedBy,
			createdAt,
			updatedAt,
			metadata as unknown as CustomMetadata,
		)
	}

	/**
	 * Check if provided path is a valid directory path.
	 *
	 * @param path - path to be validated.
	 *
	 * @returns {boolean} - whether the path is a valid directory path or not.
	 */
	public static isValidPath(path: string): path is DirectoryPath {
		return typeof path === "string" && isValidPath(path) && endsWithSlash(path)
	}

	/**
	 * A guard method to check whether provided file is an DirectoryDTO.
	 *
	 * @param x - object to be validated.
	 *
	 * @returns {x is Directory} - whether provided object is an DirectoryDTO.
	 */
	public static isOrdoDirectory(x: unknown): x is Directory {
		const directory = x as Directory

		return (
			Boolean(directory) &&
			typeof directory.path === "string" &&
			typeof directory.createdBy === "string" &&
			typeof directory.updatedBy === "string" &&
			directory.createdAt instanceof Date &&
			directory.updatedAt instanceof Date &&
			DirectoryModel.isValidPath(directory.path)
		)
	}

	#path: DirectoryPath
	#createdAt: Date
	#updatedAt: Date
	#createdBy: SUB
	#updatedBy: SUB
	#metadata: CustomMetadata

	/**
	 * @constructor
	 *
	 * @param {DirectoryPath} path - path to the directory.
	 * @param {Date} createdAt - creation time.
	 * @param {Date} updatedAt - last update time.
	 * @param {SUB} createdBy - id of the user that created the directory.
	 * @param {SUB} updatedBy - id of the user that made the latest change to the directory.
	 * @param {CustomMetadata} metadata - custom directory metadata provided by Ordo extensions.
	 *
	 * @returns {DirectoryModel<CustomMetadata>} - Ordo directory.
	 */
	protected constructor(
		path: DirectoryPath,
		createdAt: Date,
		updatedAt: Date,
		createdBy: SUB,
		updatedBy: SUB,
		metadata: CustomMetadata,
	) {
		this.#path = path
		this.#createdAt = createdAt
		this.#updatedAt = updatedAt
		this.#createdBy = createdBy
		this.#updatedBy = updatedBy
		this.#metadata = metadata
	}

	/**
	 * Path to the directory. The path is unique across Ordo directories.
	 */
	public get path(): DirectoryPath {
		return this.#path
	}

	/**
	 * The date of directory creation. THis value must not be changed.
	 *
	 * @default {new Date(Date.now())}
	 */
	public get createdAt(): Date {
		return this.#createdAt
	}

	/**
	 * The date when the directory was updated the last time.
	 *
	 * @default {new Date(Date.now())}
	 */
	public get updatedAt(): Date {
		return this.#updatedAt
	}

	/**
	 * ID of the user that created the directory. This value must not be changed.
	 */
	public get createdBy(): SUB {
		return this.#createdBy
	}

	/**
	 * ID of the user that made the last update to the directory.
	 */
	public get updatedBy(): SUB {
		return this.#updatedBy
	}

	/**
	 * Readable name of the directory (without parent path).
	 *
	 * @example `/dir1/dir2/ -> dir2`
	 */
	public get readableName(): string {
		const lastSeparatorPosition = this.#path.slice(0, -1).lastIndexOf("/") + 1

		return this.#path.slice(lastSeparatorPosition, -1)
	}

	/**
	 * Path of the parent directory.
	 *
	 * @example `/dir1/dir2/dir3/ -> /dir1/dir2/`
	 */
	public get parentPath(): Nullable<DirectoryPath> {
		const sliceablePath = this.#path.slice(0, -1)

		if (!sliceablePath) return null

		const lastSeparatorPosition = sliceablePath.lastIndexOf("/") + 1

		return sliceablePath.slice(0, lastSeparatorPosition) as DirectoryPath
	}

	/**
	 * Custom metadata used by Ordo extensions. Don't override values created by
	 * other extensions. Be a good citizen.
	 *
	 * @default {{}}
	 */
	public getMetadata<Key extends keyof CustomMetadata>(key: Key): CustomMetadata[Key] {
		return this.#metadata[key]
	}

	/**
	 * Converts OrdoDirectory to a plain object that can be used for transferring
	 * between the client and the server. Use `OrdoDirectory.from` to wrap the
	 * plain DirectoryDTO object back to OrdoDirectory.
	 *
	 * @returns {Directory<CustomMetadata>} - plain Ordo directory object.
	 */
	public get toDTO(): Directory<CustomMetadata> {
		return {
			...this.#metadata,
			path: this.#path,
			createdAt: this.#createdAt,
			updatedAt: this.#updatedAt,
			createdBy: this.#createdBy,
			updatedBy: this.#updatedBy,
		}
	}
}
