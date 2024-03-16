// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Binary, Curry, Ternary, Thunk, Unary } from "@ordo-pink/tau"
import { camel } from "case"
import { join } from "path"

import * as util from "@ordo-pink/binutil"
import { isDirectory0, isFile0, readFile0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { Switch } from "@ordo-pink/switch"
import { isReservedJavaScriptKeyword } from "@ordo-pink/rkwjs"

// --- Public ---

const mpl = util.getLicense("AGPL-3.0-only")

type _P = { space: string; path: string; createTest: boolean; fileExtension: "ts" | "tsx" }
export const mkf = ({ space, path: initialPath, createTest, fileExtension }: _P) =>
	Oath.empty()
		.tap(() => initCreateFileProgress(join(space, `${initialPath}.${fileExtension}`)))
		.map(normalizeProvidedSpace(space))
		.chain(verifyProvidedSpaceIsValid0)
		.chain(checkIfSpaceExists0)
		.chain(space =>
			Oath.fromNullable(getFileName(initialPath)).chain(unverifiedName =>
				Oath.of(normalizeFileName(unverifiedName)).chain(name =>
					Oath.of(getParentPathForCreatedFile(space, initialPath, unverifiedName))
						.map(trimTrailingSlashIfExists)
						.chain(parentPath =>
							isFile0(`${space}/license`)
								.chain(getSpaceLicenseType0(space))
								.chain(createFiles0({ parentPath, fileExtension, createTest, name })),
						),
				),
			),
		)
		.map(progress.finish)
		.orElse(e => {
			progress.break(e)
			return false
		})

// --- Internal ---

const progress = util.createProgress()

const rejectIfSpaceDoesNotExist0: Curry<Binary<string, boolean, Oath<string, string>>> =
	space => exists => (exists ? Oath.of(space) : Oath.reject(`"${space}" does not exist`))
const normalizeProvidedSpace: Unary<string, Thunk<string>> = space => () =>
	space.startsWith("./") ? space : `./${space}`
const normalizeFileName: Unary<string, string> = unverifiedName =>
	isReservedJavaScriptKeyword(unverifiedName) ? `${unverifiedName}-mod` : unverifiedName

const initCreateFileProgress: Unary<string, void> = path =>
	progress.start(`Creating new file "${path}"`)
const getFileName: Unary<string, string> = path => path.split("/").reverse()[0]
const getParentPathForCreatedFile: Ternary<string, string, string, string> = (
	space,
	initialPath,
	unverifiedName,
) => join(space, `${initialPath.replace(unverifiedName, "")}`)
const trimTrailingSlashIfExists: Unary<string, string> = path =>
	path.endsWith("/") ? path.slice(0, -1) : path

const verifyProvidedSpaceIsValid0: Unary<string, Oath<string, string>> = unverifiedSpace =>
	Oath.fromBoolean(
		() =>
			unverifiedSpace.startsWith("./lib") ||
			unverifiedSpace.startsWith("./srv") ||
			unverifiedSpace.startsWith("./boot/src"),
		() => unverifiedSpace,
		() => "Invalid space",
	)

const checkIfSpaceExists0: Unary<string, Oath<string, string>> = space =>
	isDirectory0(space).chain(rejectIfSpaceDoesNotExist0(space))

type _CF0P = { parentPath: string; fileExtension: "ts" | "tsx"; createTest: boolean; name: string }
const createFiles0: Curry<Binary<_CF0P, string, Oath<void[], Error>>> =
	({ parentPath, fileExtension, createTest, name }) =>
	license =>
		Oath.all([
			util.createRepositoryFile0(
				`${parentPath}/${name}.${fileExtension}`,
				index(name, license as util.License),
			),
			createTest
				? util.createRepositoryFile0(
						`${parentPath}/${name}.test.${fileExtension}`,
						test(name, license as util.License),
					)
				: Oath.empty(),
		])

const getSpaceLicenseType0: Curry<Binary<string, boolean, Oath<string, Error>>> =
	space => exists =>
		exists
			? readFile0(`${space}/license`, "utf-8").map(content =>
					Switch.of(content)
						.case(mpl, () => "MPL-2.0")
						.default(() => "MIT"),
				)
			: Oath.of("")

const index = (name: string, license: util.License | "") =>
	`${license ? util.getSPDXRecord(license).concat("\n") : ""}export const ${camel(
		name,
	)} = "${name}"`
const test = (name: string, license: util.License | "") =>
	`${license ? util.getSPDXRecord(license).concat("\n") : ""}import { test, expect } from "bun:test"
import { ${camel(name)} } from "./${name}"

test("${name} should pass", () => {
	expect(${camel(name)}).toEqual("${name}")
})
`
