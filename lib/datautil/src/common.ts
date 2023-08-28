// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { SUB } from "@ordo-pink/backend-token-service"
import { Switch } from "@ordo-pink/switch"
import { isArray, isDate, isObject, isString } from "@ordo-pink/tau"
import { FilePath } from "./file"
import { DirectoryPath } from "./directory"

/**
 * Characters that cannot be used in FS path.
 */
export const FORBIDDEN_PATH_SYMBOLS = [
	"<",
	">",
	":",
	'"',
	"\\",
	"|",
	"?",
	"*",
	"..",
	"./",
	"//",
] as const

/**
 * Unique identifier of an FS entity.
 */
export type FSID = `${string}-${string}-${string}-${string}-${string}`

export const isFSID = (x: unknown): x is FSID => {
	if (!x || typeof x !== "string" || isEmpty(x) || startsWithSlash(x) || endsWithSlash(x))
		return false
	const chunks = x.split("-")
	return chunks.length === 5 && chunks.every(chunk => chunk.length > 0 && !hasForbiddenChars(chunk))
}

export const isSUB = (x: unknown): x is SUB => isFSID(x)

/**
 * Shared properties of File and Directory.
 */
export interface FSEntity {
	/**
	 * Path of the FSEntity.
	 */
	path: FilePath | DirectoryPath

	/**
	 * Unique FS identifier.
	 * This value never changes.
	 */
	fsid: FSID

	/**
	 * Create timestamp.
	 * This value never changes.
	 */
	createdAt: Date

	/**
	 * Last update timestamp.
	 */
	updatedAt: Date

	/**
	 * Initial author.
	 * This value never changes.
	 */
	createdBy: SUB

	/**
	 * Last update author.
	 */
	updatedBy: SUB

	/**
	 * Links from the FS entity.
	 */
	links: FSLink[]

	/**
	 * Labels (a.k.a. tags) applied to the FS entity.
	 */
	labels: FSLabel[]

	/**
	 * Custom properties of the FS entity.
	 * @todo
	 */
	properties: FSProperties
}

export const isFSEntity = (x: unknown): x is FSEntity => {
	const directory = x as FSEntity

	return (
		isObject(directory) &&
		isFSID(directory.fsid) &&
		isSUB(directory.createdBy) &&
		isSUB(directory.updatedBy) &&
		isDate(directory.createdAt) &&
		isDate(directory.updatedAt) &&
		isFSLinks(directory.links) &&
		isFSLabels(directory.labels) &&
		isFSProperties(directory.properties)
	)
}

export type FSProperties = Record<string, never>

export const isFSProperties = (x: unknown): x is FSProperties => isObject(x)

export type FSLabel = string

export const isFSLabel = (x: unknown): x is FSLabel => isString(x)

export const isFSLabels = (x: unknown): x is FSLabel[] => isArray(x) && x.every(isFSLabel)

export type FSLink = {
	type: "include" | "reference"
	fsid: FSID
}

export const isFSLink = (x: unknown): x is FSLink => {
	if (!x || typeof x !== "object") return false
	const y = x as FSLink
	return (
		isFSID(y.fsid) &&
		Switch.of(y.type)
			.case("include", () => true)
			.case("reference", () => true)
			.default(() => false)
	)
}

export const isFSLinks = (x: unknown): x is FSLink[] => isArray(x) && x.every(isFSLink)

export type ForbiddenPathSymbol = (typeof FORBIDDEN_PATH_SYMBOLS)[number]

export const hasForbiddenChars = (path: string) =>
	FORBIDDEN_PATH_SYMBOLS.some(disallowed => path.includes(disallowed))

export const isEmpty = (path: string) => path.trim() === ""

export const startsWithSlash = (path: string) => path.startsWith("/")

export const endsWithSlash = (path: string) => path.endsWith("/")

export const isPath = (path: string) =>
	!isEmpty(path) && !hasForbiddenChars(path) && startsWithSlash(path)
