// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { camel, pascal, title } from "case"

import { Binary, Curry, Ternary, Thunk, Unary, noop } from "@ordo-pink/tau"
import {
	License,
	createProgress,
	createRepositoryFile0,
	getLicense,
	getSPDXRecord,
} from "@ordo-pink/binutil"
import { Oath } from "@ordo-pink/oath"
import { dir_exists0 } from "@ordo-pink/fs"
import { isReservedJavaScriptKeyword } from "@ordo-pink/rkwjs"

// --- Public ---

export const mklib = (name: string, license: License) =>
	Oath.of(isReservedJavaScriptKeyword(name) ? `${name}-bin` : name)
		.tap(initProgress)
		.chain(name => Oath.of(`./lib/${name}`).chain(createFilesIfNotExists0(name, license)))
		.orElse(e => {
			progress.break(e)
			return false
		})

// --- Internal ---

const progress = createProgress()

const initProgress: Unary<string, void> = name =>
	progress.start(`Initializing new library "${name}"`)

const createFiles0: Ternary<string, string, License, Thunk<Oath<void, Error>>> =
	(path, name, license) => () =>
		Oath.all([
			createRepositoryFile0(`${path}/license`, getLicense(license)).tap(progress.inc),
			createRepositoryFile0(`${path}/readme.md`, readme(name)).tap(progress.inc),
			createRepositoryFile0(`${path}/index.ts`, index(name, license)).tap(progress.inc),
			createRepositoryFile0(`${path}/src/${name}.impl.ts`, impl(name, license)).tap(progress.inc),
			createRepositoryFile0(`${path}/src/${name}.test.ts`, test(name, license)).tap(progress.inc),
			createRepositoryFile0(`${path}/src/${name}.types.ts`, types(name, license)).tap(progress.inc),
		]).map(progress.finish)

const rejectIfExists0: Curry<Binary<string, boolean, Oath<void, string>>> = name => exists =>
	Oath.fromBoolean(
		() => !exists,
		noop,
		() => `"lib/${name}" already exists!`,
	)

const createFilesIfNotExists0: Binary<string, License, Unary<string, Oath<void, string | Error>>> =
	(name, license) => path =>
		dir_exists0(path)
			.chain(rejectIfExists0(name))
			.chain(createFiles0(path, name, license))

// --- Internal ---

const index = (name: string, license: License) => `${getSPDXRecord(license)}
export * from "./src/${name}.impl"
export * from "./src/${name}.types"
`

const impl = (name: string, license: License) => `${getSPDXRecord(license)}
import type { ${pascal(name)} } from "./${name}.types"

export const ${camel(name)}: ${pascal(name)} = "${name}"
`

const types = (name: string, license: License) => `${getSPDXRecord(license)}
export type ${pascal(name)} = "${name}"
`

const test = (name: string, license: License) => `${getSPDXRecord(license)}
import { test, expect } from "bun:test"
import { ${camel(name)} } from "./${name}.impl"

test("${name} should pass", () => {
	expect(${camel(name)}).toEqual("${name}")
})
`

const readme = (name: string) => `# ${title(name)}
`
