// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { SUB } from "@ordo-pink/backend-token-service"
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

/**
 * Valid structure of a Directory path.
 *
 * @example
 * "/asdf/fdsa/"
 * "/asdf/"
 * "/"
 */
export type DirectoryPath = `/${string}/` | "/"

/**
 * Directory object.
 */
export interface Directory extends FSEntity {
	/**
	 * Path of the directory. Must start and end with /. Must not contain forbidden chars.
	 * @see FORBIDDEN_PATH_SYMBOLS
	 */
	path: DirectoryPath
}

/**
 * Params for creating a Directory.
 */
export type CreateDirectoryParams = {
	path: Directory["path"]
	links?: Directory["links"]
	labels?: Directory["labels"]
	properties?: Directory["properties"]
}

/**
 * Params for updating a Directory.
 */
export type UpdateDirectoryParams = {
	path?: Directory["path"]
	links?: Directory["links"]
	labels?: Directory["labels"]
	properties?: Directory["properties"]
}

/**
 * A set of helper tools to work with Directory.
 */
export const DirectoryUtils = {
	/**
	 * Get path of parent directory.
	 * Returns null if given path is root path ("/").
	 *
	 * @example
	 * DirectoryUtils.getParentPath("/asdf/fdsa/") // "/asdf/"
	 * DirectoryUtils.getParentPath("/adsf/")      // "/"
	 * DirectoryUtils.getParentPath("/")           // null
	 */
	getParentPath: (path: DirectoryPath): Nullable<DirectoryPath> => {
		const sliceablePath = path.slice(0, -1)
		if (!sliceablePath) return null
		const lastSeparatorPosition = sliceablePath.lastIndexOf("/") + 1
		return sliceablePath.slice(0, lastSeparatorPosition) as DirectoryPath
	},

	/**
	 * Get readable name of the directory.
	 * Returns null if given path is root path ("/").
	 *
	 * @example
	 * DirectoryUtils.getReadableName("/asdf/fdsa/") // "fdsa"
	 * DirectoryUtils.getReadableName("/")           // null
	 */
	getReadableName: (path: DirectoryPath): Nullable<string> => {
		if (path === "/") return ""
		const lastSeparatorPosition = path.slice(0, -1).lastIndexOf("/") + 1
		return path.slice(lastSeparatorPosition, -1)
	},

	/**
	 * A TypeScript guard to check if given x is a Directory.
	 */
	isDirectory: (x: unknown): x is Directory => {
		const directory = x as Directory
		return isFSEntity(directory) && DirectoryUtils.isValidPath(directory.path)
	},

	/**
	 * A TypeScript guard to check if given x is a DirectoryPath.
	 *
	 * @example
	 * DirectoryUtils.isValidPath("/")      // true
	 * DirectoryUtils.isValidPath("/asdf/") // true
	 * DirectoryUtils.isValidPath("")       // false
	 * DirectoryUtils.isValidPath("/asdf")  // false
	 * DirectoryUtils.isValidPath("asdf/")  // false
	 */
	isValidPath: (path: unknown): path is DirectoryPath => {
		return typeof path === "string" && isPath(path) && endsWithSlash(path)
	},

	/**
	 * A TypeScript guard to check if given x is CreateDirectoryParams.
	 * Path cannot be "/".
	 *
	 * @example
	 * DirectoryUtils.isCreateParams(null)                                 // false
	 * DirectoryUtils.isCreateParams({})                                   // false
	 * DirectoryUtils.isCreateParams({ path: "adsf" })                     // false
	 * DirectoryUtils.isCreateParams({ labels: "hello" })                  // false
	 * DirectoryUtils.isCreateParams({ path: "/" })                        // false
	 * DirectoryUtils.isCreateParams({ path: "/asdf/", })                  // true
	 * DirectoryUtils.isCreateParams({ path: "/asdf/", labels: ["hello"]}) // true
	 */
	isCreateParams: (x: unknown): x is CreateDirectoryParams => {
		const y = x as CreateDirectoryParams
		return (
			isObject(y) &&
			DirectoryUtils.isValidPath(y.path) &&
			y.path !== "/" &&
			(!y.links || isFSLinks(y.links)) &&
			(!y.labels || isFSLabels(y.labels)) &&
			(!y.properties || isFSProperties(y.properties))
		)
	},

	/**
	 * A TypeScript guard to check if given x is UpdateDirectoryParams.
	 * Path cannot be "/".
	 *
	 * @example
	 * DirectoryUtils.isUpdateParams(null)                                 // false
	 * DirectoryUtils.isUpdateParams({})                                   // false
	 * DirectoryUtils.isUpdateParams({ path: "adsf" })                     // false
	 * DirectoryUtils.isUpdateParams({ labels: "hello" })                  // false
	 * DirectoryUtils.isUpdateParams({ path: "/" })                        // false
	 * DirectoryUtils.isUpdateParams({ path: "/asdf/", })                  // true
	 * DirectoryUtils.isUpdateParams({ path: "/asdf/", labels: ["hello"]}) // true
	 */
	isUpdateParams: (x: unknown): x is UpdateDirectoryParams => {
		const y = x as UpdateDirectoryParams
		return (
			isObject(y) &&
			Object.keys(y).length > 0 &&
			(!y.path || (DirectoryUtils.isValidPath(y.path) && y.path !== "/")) &&
			(!y.links || isFSLinks(y.links)) &&
			(!y.labels || isFSLabels(y.labels)) &&
			(!y.properties || isFSProperties(y.properties))
		)
	},

	/**
	 * Create Directory from given inputs.
	 * It does not validate provided inputs.
	 */
	create: (args: { params: CreateDirectoryParams; sub: SUB; fsid: FSID }): Directory => ({
		path: args.params.path,
		fsid: args.fsid,
		createdAt: new Date(Date.now()),
		createdBy: args.sub,
		updatedAt: new Date(Date.now()),
		updatedBy: args.sub,
		labels: args.params.labels ?? [],
		links: args.params.links ?? [],
		properties: args.params.properties ?? {},
	}),

	/**
	 * Update given directory with given inputs.
	 * It does not validate provided inputs.
	 */
	update: (args: { directory: Directory; params: UpdateDirectoryParams; sub: SUB }): Directory => ({
		path:
			DirectoryUtils.isValidPath(args.params.path) && args.params.path !== args.directory.path
				? args.params.path
				: args.directory.path,
		fsid: args.directory.fsid,
		createdAt: args.directory.createdAt,
		createdBy: args.directory.createdBy,
		updatedAt: new Date(Date.now()),
		updatedBy: args.sub,
		labels: isFSLabels(args.params.labels)
			? Array.from(new Set(args.params.labels))
			: args.directory.labels,
		links: isFSLinks(args.params.links)
			? Array.from(new Set(args.params.links))
			: args.directory.links,
		properties: isFSProperties(args.params.properties)
			? args.params.properties
			: args.directory.properties,
	}),
}
