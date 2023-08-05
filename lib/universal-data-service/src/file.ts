// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { SUB } from "#lib/backend-token-service/mod.ts"
import { FilePath, FSID, FileExtension, File } from "./types/file.ts"
import { DirectoryPath } from "./types/directory.ts"
import { isValidPath, endsWithSlash } from "./common.ts"

/**
 * A list of abbreviated file sizes (bytes, kilobytes, megabytes, etc.).
 */
const SIZE_ABBREVIATIONS = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

/**
 * Readable size of a file that has body size equal to 0.
 */
const EMPTY_READABLE_SIZE = `0${SIZE_ABBREVIATIONS[0]}`

/**
 * OrdoFile represents a file in Ordo. It contains the "head" of the file, also
 * referred to as file `metadata`. Apart from default Ordo metadata, custom
 * values can be provided as well. Custom metadata is used by extensions to do
 * whatever they need to do with files. Metadata is persistent which means that
 * the assigned values last between sessions. OrdoFile is an immutable object.
 * It is not intended to be changed directly. All the changes to the file need
 * to be made with `OrdoFileModel` that returns a new OrdoFile with all the
 * changes applied.
 */
export class OrdoFile<CustomMetadata extends Record<string, unknown> = Record<string, unknown>> {
	/**
	 * Creates an OrdoFile from a list of required fields. You would not need
	 * this method usually. Use `OrdoFile.from` to create an OrdoFile from an
	 * `IOrdoFile`.
	 *
	 * @throws if provided path is not a valid `OrdoFilePath`.
	 * @throws if any of the required fields is missing.
	 * @throws if provided size is less than 0.
	 *
	 * @param {FilePath} path - path to the file.
	 * @param {FSID} fsid - FSID of the file body.
	 * @param {SUB} createdBy - id of the user that created the file.
	 * @param {SUB} updatedBy - id of the user that made the latest change to the file.
	 * @param {number} size - file size.
	 * @param {Date} createdAt - creation time.
	 * @param {Date} updatedAt - last update time.
	 * @param {CustomMetadata} metadata - custom file metadata provided by Ordo extensions.
	 * @param {string | false} encryption - file body encryption type.
	 *
	 * @returns {OrdoFile<CustomMetadata>} - Ordo file.
	 */
	public static of<CustomMetadata extends Record<string, unknown> = Record<string, unknown>>(
		path: FilePath,
		fsid: FSID,
		createdBy: SUB,
		updatedBy: SUB,
		size = 0,
		createdAt = new Date(Date.now()),
		updatedAt = new Date(Date.now()),
		metadata: CustomMetadata = {} as CustomMetadata,
		encryption: string | false = false
	) {
		if (!OrdoFile.isValidPath(path)) throw new Error("Invalid file path")
		if (size < 0) throw new Error("Invalid file size")
		if (!fsid) throw new Error("FSID not provided")
		if (!createdBy) throw new Error("Unknown createdBy")
		if (!updatedBy) throw new Error("Unknown updatedBy")

		return new OrdoFile(
			path,
			fsid,
			size,
			createdAt,
			updatedAt,
			createdBy,
			updatedBy,
			metadata,
			encryption
		)
	}

	/**
	 * Creates an OrdoFile from an IOrdoFile.
	 *
	 * @param {File} - IOrdoFile to create an OrdoFile from.
	 *
	 * @returns {OrdoFile} - a valid OrdoFile.
	 */
	public static from<CustomMetadata extends Record<string, unknown> = Record<string, unknown>>({
		path,
		fsid,
		size,
		createdAt,
		updatedAt,
		createdBy,
		updatedBy,
		encryption,
		...metadata
	}: File<CustomMetadata>): OrdoFile<CustomMetadata> {
		return OrdoFile.of(
			path,
			fsid,
			createdBy,
			updatedBy,
			size,
			createdAt,
			updatedAt,
			metadata as unknown as CustomMetadata,
			encryption
		)
	}

	/**
	 * Check if provided path is a valid file path.
	 *
	 * @param path - path to be validated.
	 *
	 * @returns {boolean} - whether the path is a valid file path or not.
	 */
	public static isValidPath(path: string): path is FilePath {
		return typeof path === "string" && isValidPath(path) && !endsWithSlash(path)
	}

	/**
	 * A guard method to check whether provided file is an IOrdoFile.
	 *
	 * @param x - object to be validated.
	 *
	 * @returns {x is File} - whether provided object is an IOrdoFile.
	 */
	public static isOrdoFile(x: unknown): x is File {
		const file = x as File

		return (
			Boolean(file) &&
			typeof file.path === "string" &&
			typeof file.fsid === "string" &&
			typeof file.size === "number" &&
			typeof file.createdBy === "string" &&
			typeof file.updatedBy === "string" &&
			(typeof file.encryption === "string" || file.encryption === false) &&
			file.createdAt instanceof Date &&
			file.updatedAt instanceof Date &&
			file.size >= 0 &&
			OrdoFile.isValidPath(file.path)
		)
	}

	/**
	 * Transform given file size to readable size.
	 *
	 * @throws if provided size in less than 0.
	 *
	 * @param {number} size - size to be transformed to a readable size.
	 *
	 * @returns {string} - readable size.
	 */
	public static toReadableSize(size: number): string {
		if (size < 0) {
			throw new Error("Invalid file size")
		}

		const d = Math.floor(Math.log(size) / Math.log(1024))
		const num = parseFloat((size / Math.pow(1024, d)).toFixed(Math.max(0, 2)))

		return size === 0 ? EMPTY_READABLE_SIZE : `${num}${SIZE_ABBREVIATIONS[d]}`
	}

	/**
	 * Extract file extension from the given path.
	 *
	 * @throws if provided path is not a valid file path.
	 *
	 * @param path - path to extract file extension from.
	 *
	 * @returns {FileExtension} - extension of the file under given path.
	 */
	public static extractFileExtension(path: FilePath): FileExtension {
		if (!OrdoFile.isValidPath(path)) {
			throw new Error("Invalid file path")
		}

		const fileName = path.split("/").reverse()[0] as string

		const lastDotPosition = fileName.lastIndexOf(".")

		if (!~lastDotPosition) {
			return ""
		}

		return fileName.substring(lastDotPosition) as FileExtension
	}

	#path: FilePath
	#fsid: FSID
	#size: number
	#createdAt: Date
	#updatedAt: Date
	#createdBy: SUB
	#updatedBy: SUB
	#metadata: CustomMetadata
	#encryption: string | false

	/**
	 * @constructor
	 */
	protected constructor(
		path: FilePath,
		fsid: FSID,
		size: number,
		createdAt: Date,
		updatedAt: Date,
		createdBy: SUB,
		updatedBy: SUB,
		metadata: CustomMetadata,
		encryption: string | false
	) {
		this.#path = path
		this.#fsid = fsid
		this.#size = size
		this.#createdAt = createdAt
		this.#updatedAt = updatedAt
		this.#createdBy = createdBy
		this.#updatedBy = updatedBy
		this.#metadata = metadata
		this.#encryption = encryption
	}

	/**
	 * Path to the file. The path is unique across Ordo files.
	 */
	public get path(): FilePath {
		return this.#path
	}

	/**
	 * File system identifier of the file body. The FSID is unique across Ordo
	 * files. This value must not be changed.
	 */
	public get fsid(): FSID {
		return this.#fsid
	}

	/**
	 * Size of the file body. Must be greater than or equal to 0.
	 *
	 * @default {0}
	 */
	public get size(): number {
		return this.#size
	}

	/**
	 * The date of file creation. THis value must not be changed.
	 *
	 * @default {new Date(Date.now())}
	 */
	public get createdAt(): Date {
		return this.#createdAt
	}

	/**
	 * The date when the file was updated the last time. This considers both file
	 * body and file metadata.
	 *
	 * @default {new Date(Date.now())}
	 */
	public get updatedAt(): Date {
		return this.#updatedAt
	}

	/**
	 * ID of the user that created the file. This value must not be changed.
	 */
	public get createdBy(): SUB {
		return this.#createdBy
	}

	/**
	 * ID of the user that made the last update to the file. This considers both
	 * file body and file metadata.
	 */
	public get updatedBy(): SUB {
		return this.#updatedBy
	}

	/**
	 * Type of encryption applied to the file body.
	 *
	 * @default {false}
	 */
	public get encryption(): string | false {
		return this.#encryption
	}

	/**
	 * Readable name of the file (without parent path and file extension).
	 *
	 * @example `/dir/My file.txt -> My file`
	 */
	public get readableName(): string {
		const lastSeparatorPosition = this.#path.lastIndexOf("/") + 1
		const readableName = this.#path.slice(lastSeparatorPosition)

		return readableName.replace(this.extension, "")
	}

	/**
	 * File extension with a dot at the beginning.
	 *
	 * @example `/dir/My file.txt -> .txt`
	 */
	public get extension(): FileExtension {
		return OrdoFile.extractFileExtension(this.#path)
	}

	/**
	 * Readable size of the file.
	 *
	 * @example `0 -> 0B`
	 * @example `1202 -> 1KB`
	 */
	public get readableSize(): string {
		return OrdoFile.toReadableSize(this.#size)
	}

	/**
	 * Path of the parent directory.
	 *
	 * @example `/dir1/dir2/My file.txt -> /dir1/dir2/`
	 */
	public get parentPath(): DirectoryPath {
		const lastSeparatorPosition = this.#path.lastIndexOf("/") + 1

		return this.#path.slice(0, lastSeparatorPosition) as DirectoryPath
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
	 * Converts OrdoFile to a plain object that can be used for transferring
	 * between the client and the server. Use `OrdoFile.from` to wrap the plain
	 * IOrdoFile object back to OrdoFile.
	 *
	 * @returns {File<CustomMetadata>} - plain OrdoFile object.
	 */
	public get toDTO(): File<CustomMetadata> {
		return {
			...this.#metadata,
			path: this.#path,
			fsid: this.#fsid,
			size: this.#size,
			createdAt: this.#createdAt,
			updatedAt: this.#updatedAt,
			createdBy: this.#createdBy,
			updatedBy: this.#updatedBy,
			encryption: this.#encryption,
		}
	}
}
