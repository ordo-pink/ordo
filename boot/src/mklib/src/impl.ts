// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import {
	License,
	createProgress,
	createRepositoryFile0,
	getLicense,
	getSPDXRecord,
} from "@ordo-pink/binutil"
import { directoryExists0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { isReservedJavaScriptKeyword } from "@ordo-pink/rkwjs"
import { Binary, Curry, Ternary, Thunk, Unary, noop } from "@ordo-pink/tau"
import { camel, pascal, title } from "case"

// --- Public ---

export const mklib = (name: string, license: License) =>
	Oath.of(isReservedJavaScriptKeyword(name) ? `${name}-bin` : name)
		.chain(name =>
			Oath.of(`./lib/${name}`)
				.tap(initProgress)
				.chain(createFilesIfNotExists0(name, license))
				.map(progress.finish)
		)
		.orElse(e => {
			progress.break(e)
			return false
		})

// --- Internal ---

const progress = createProgress()

const initProgress = () => progress.start("Initializing new binary")

const createFiles0: Ternary<string, string, License, Thunk<Oath<void, Error>>> =
	(path, name, license) => () =>
		Oath.all([
			createRepositoryFile0(`${path}/license`, getLicense(license)).tap(progress.inc),
			createRepositoryFile0(`${path}/readme.md`, readme(name)).tap(progress.inc),
			createRepositoryFile0(`${path}/mod.ts`, mod(license)).tap(progress.inc),
			createRepositoryFile0(`${path}/src/impl.ts`, impl(name, license)).tap(progress.inc),
			createRepositoryFile0(`${path}/src/impl.test.ts`, test(name, license)).tap(progress.inc),
			createRepositoryFile0(`${path}/src/types.ts`, types(name, license)).tap(progress.inc),
		]).map(noop)

const rejectIfExists0: Curry<Binary<string, boolean, Oath<void, string>>> = name => exists =>
	Oath.fromBoolean(
		() => !exists,
		noop,
		() => `"bin/${name}" already exists!`
	)

const createFilesIfNotExists0: Binary<string, License, Unary<string, Oath<void, string | Error>>> =
	(name, license) => path =>
		directoryExists0(path).chain(rejectIfExists0(name)).chain(createFiles0(path, name, license))

// --- Internal ---

const mod = (license: License) => `${getSPDXRecord(license)}
export * from "./src/impl"
export * from "./src/types"
`

const impl = (name: string, license: License) => `${getSPDXRecord(license)}
import type { ${pascal(name)} } from "./types"

export const ${camel(name)}: ${pascal(name)} = "${name}"
`

const types = (name: string, license: License) => `${getSPDXRecord(license)}
export type ${pascal(name)} = "${name}"
`

const test = (name: string, license: License) => `${getSPDXRecord(license)}
import { test, expect } from "bun:test"
import { ${camel(name)} } from "./impl"

test("${name} should pass", () => {
	expect(${camel(name)}).toEqual("${name}")
})
`

const readme = (name: string) => `# ${title(name)}
`
