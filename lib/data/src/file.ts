// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Nullable, isObject } from "@ordo-pink/tau"
import {
	FSEntity,
	FSID,
	endsWithSlash,
	isFSEntity,
	isFSLabels,
	isFSLinks,
	isFSProperties,
	isPath,
} from "./common"
import { DirectoryPath } from "./directory"
import { SUB } from "@ordo-pink/wjwt"

/**
 * A list of abbreviated file sizes (bytes, kilobytes, megabytes, etc.).
 */
const SIZE_ABBREVIATIONS = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"]

/**
 * Readable size of a file that has body size equal to 0.
 */
const EMPTY_READABLE_SIZE = `0${SIZE_ABBREVIATIONS[0]}`

/**
 * Files might or might not have a file extension. These are the two possible
 * options.
 *
 * @example
 * ".png"
 * ".gitignore"
 * ""
 */
export type FileExtension = `.${string}` | ""

/**
 * Valid structure of a File path.
 *
 * @example
 * "/asdf/fdsa/test.md"
 * "/hello.txt"
 * "/.gitignore"
 */
export type FilePath = `/${string}`

/**
 * File object.
 */
export interface File extends FSEntity {
	path: FilePath
	size: number | bigint
	encryption: Nullable<string>
}

/**
 * Initialisation params for creating a File.
 */
export type CreateFileParams = {
	path: File["path"]
	links?: File["links"]
	labels?: File["labels"]
	properties?: File["properties"]
}

export type UpdateFileParams = {
	size?: number
	path?: File["path"]
	links?: File["links"]
	labels?: File["labels"]
	properties: File["properties"]
}

export const FileUtils = {
	/**
	 * A TypeScript guard to check if given x is a DirectoryPath.
	 *
	 * @example
	 * FileUtils.isValidPath("/")         // false
	 * FileUtils.isValidPath("/asdf/")    // false
	 * FileUtils.isValidPath("")          // false
	 * FileUtils.isValidPath("/asdf")     // true
	 * FileUtils.isValidPath("/asdf.md")  // true
	 */
	isValidPath: (path: unknown): path is FilePath => {
		return typeof path === "string" && isPath(path) && !endsWithSlash(path)
	},

	/**
	 * A TypeScript guard to check if given x is a Directory.
	 */
	isFile: (x: unknown): x is File => {
		const file = x as File
		return isFSEntity(file) && FileUtils.isValidPath(file.path)
	},

	/**
	 * A TypeScript guard to check if given x is CreateFileParams.
	 * Path cannot be "/".
	 *
	 * @example
	 * FileUtils.isCreateParams(null)                                 // false
	 * FileUtils.isCreateParams({})                                   // false
	 * FileUtils.isCreateParams({ path: "adsf" })                     // false
	 * FileUtils.isCreateParams({ labels: "hello" })                  // false
	 * FileUtils.isCreateParams({ path: "/" })                        // false
	 * FileUtils.isCreateParams({ path: "/asdf/", })                  // true
	 * FileUtils.isCreateParams({ path: "/asdf/", labels: ["hello"]}) // true
	 */
	isCreateParams: (x: unknown): x is CreateFileParams => {
		const y = x as CreateFileParams
		return (
			isObject(y) &&
			FileUtils.isValidPath(y.path) &&
			y.path !== "/" &&
			(!y.links || isFSLinks(y.links)) &&
			(!y.labels || isFSLabels(y.labels)) &&
			(!y.properties || isFSProperties(y.properties))
		)
	},

	/**
	 * Get a readable value of given size in bytes.
	 * Returns null if given value is not a number, an infinite number, or a negative number.
	 *
	 * @example
	 * FileUtils.getReadableSize(1024)    // 1KB
	 * FileUtils.getReadableSize(1048576) // 1MB
	 */
	getReadableSize: (size: number): Nullable<string> => {
		if (typeof size !== "number" || Number.isNaN(size) || !Number.isFinite(size) || size < 0)
			return null

		const d = Math.floor(Math.log(size) / Math.log(1024))
		const num = parseFloat((size / Math.pow(1024, d)).toFixed(Math.max(0, 2)))

		return size === 0 ? EMPTY_READABLE_SIZE : `${num}${SIZE_ABBREVIATIONS[d]}`
	},

	/**
	 * Get name of the file.
	 *
	 * @example
	 * FileUtils.getName("/.gitignore")   // ".gitignore"
	 * FileUtils.getName("/asdf/fdsa.md") // "fdsa.md"
	 * FileUtils.getName("/asdf/fdsa")    // "fdsa"
	 */
	getName: (path: FilePath): string => {
		return path.split("/").reverse()[0] as string
	},

	/**
	 * Get FileExtension.
	 *
	 * @example
	 * FileUtils.getFileExtension("/.gitignore")   // ".gitignore"
	 * FileUtils.getFileExtension("/asdf/fdsa.md") // ".md"
	 * FileUtils.getFileExtension("/asdf/fdsa")    // ""
	 */
	getExtension: (path: FilePath): FileExtension => {
		const fileName = FileUtils.getName(path)

		const lastDotPosition = fileName.lastIndexOf(".")

		if (!~lastDotPosition) {
			return ""
		}

		return fileName.substring(lastDotPosition) as FileExtension
	},

	/**
	 * Get file name without extension.
	 *
	 * @example
	 * FileUtils.getReadableName("/.gitignore")   // ""
	 * FileUtils.getReadableName("/asdf/fdsa.md") // "fdsa"
	 * FileUtils.getReadableName("/asdf/fdsa")    // "fdsa"
	 */
	getReadableName: (path: FilePath): string => {
		const name = FileUtils.getName(path)
		const extension = FileUtils.getExtension(path)
		return name.replace(extension, "")
	},

	/**
	 * Get path of parent directory.
	 *
	 * @example
	 * FileUtils.getParentPath("/asdf/fdsa")      // "/asdf/"
	 * FileUtils.getParentPath("/asdf/fdsa/dsaf") // "/asdf/fdsa/"
	 * FileUtils.getParentPath("/adsf.md")        // "/"
	 */
	getParentPath(path: FilePath): DirectoryPath {
		const lastSeparatorPosition = path.lastIndexOf("/") + 1

		return path.slice(0, lastSeparatorPosition) as DirectoryPath
	},

	/**
	 * A TypeScript guard to check if given x is UpdateFileParams.
	 * Path cannot be "/".
	 *
	 * @example
	 * FileUtils.isUpdateParams(null)                                 // false
	 * FileUtils.isUpdateParams({})                                   // false
	 * FileUtils.isUpdateParams({ path: "adsf" })                     // false
	 * FileUtils.isUpdateParams({ labels: "hello" })                  // false
	 * FileUtils.isUpdateParams({ path: "/" })                        // false
	 * FileUtils.isUpdateParams({ path: "/asdf/", })                  // true
	 * FileUtils.isUpdateParams({ path: "/asdf/", labels: ["hello"]}) // true
	 */
	isUpdateParams: (x: unknown): x is UpdateFileParams => {
		const y = x as UpdateFileParams
		return (
			isObject(y) &&
			Object.keys(y).length > 0 &&
			(!y.path || (FileUtils.isValidPath(y.path) && y.path !== "/")) &&
			(!y.links || isFSLinks(y.links)) &&
			(!y.labels || isFSLabels(y.labels)) &&
			(!y.properties || isFSProperties(y.properties))
		)
	},

	/**
	 * Create File from given inputs.
	 * It does not validate provided inputs.
	 */
	create: (args: { params: CreateFileParams; sub: SUB; fsid: FSID }): File => ({
		path: args.params.path,
		fsid: args.fsid,
		createdAt: new Date(Date.now()),
		createdBy: args.sub,
		updatedAt: new Date(Date.now()),
		updatedBy: args.sub,
		size: 0,
		encryption: null,
		labels: args.params.labels ?? [],
		links: args.params.links ?? [],
		properties: args.params.properties ?? {},
	}),

	/**
	 * Update given directory with given inputs.
	 * It does not validate provided inputs.
	 */
	update: (args: { file: File; params: UpdateFileParams; sub: SUB }): File => ({
		path:
			FileUtils.isValidPath(args.params.path) && args.params.path !== args.file.path
				? args.params.path
				: args.file.path,
		fsid: args.file.fsid,
		createdAt: args.file.createdAt,
		createdBy: args.file.createdBy,
		updatedAt: new Date(Date.now()),
		updatedBy: args.sub,
		size: args.params.size ?? args.file.size,
		encryption: args.file.encryption,
		labels: isFSLabels(args.params.labels)
			? Array.from(new Set(args.params.labels))
			: args.file.labels,
		links: isFSLinks(args.params.links) ? Array.from(new Set(args.params.links)) : args.file.links,
		properties: isFSProperties(args.params.properties)
			? args.params.properties
			: args.file.properties,
	}),
}
