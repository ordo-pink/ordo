// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { License } from "@ordo-pink/binutil"
import { camel, pascal, title } from "case"
import {
	createProgress,
	createRepositoryFile0,
	getLicense,
	getSPDXRecord,
} from "@ordo-pink/binutil"
import { Binary, Curry, Ternary, Thunk, Unary, noop } from "@ordo-pink/tau"
import { directoryExists0, getAbsolutePath } from "@ordo-pink/fs"
import { isReservedJavaScriptKeyword } from "@ordo-pink/rkwjs"
import { Oath } from "@ordo-pink/oath"

// --- Public ---

export const mksrv = (name: string, license: License) =>
	Oath.of(isReservedJavaScriptKeyword(name) ? `${name}-srv` : name)
		.tap(initProgress)
		.chain(name =>
			Oath.of(getAbsolutePath(`./srv/${name}`)).chain(createFilesIfNotExists0(name, license)),
		)
		.orElse(e => {
			progress.break(e)
			return false
		})

// --- Internal ---

const progress = createProgress()

const createFiles0: Ternary<string, string, License, Thunk<Oath<void, Error>>> =
	(path, name, license) => () =>
		Oath.all([
			createRepositoryFile0(`${path}/license`, getLicense(license)).tap(progress.inc),
			createRepositoryFile0(`${path}/readme.md`, readme(name)).tap(progress.inc),
			createRepositoryFile0(`${path}/index.ts`, index(name, license)).tap(progress.inc),
			createRepositoryFile0(`${path}/src/${name}.impl.ts`, impl(name, license)).tap(progress.inc),
			createRepositoryFile0(`${path}/src/${name}.impl.test.ts`, test(name, license)).tap(
				progress.inc,
			),
			createRepositoryFile0(`${path}/src/${name}.types.ts`, types(name, license)).tap(progress.inc),
			createRepositoryFile0(`${path}/bin/run.ts`, run(name, license)).tap(progress.inc),
			createRepositoryFile0(`${path}/bin/init.ts`, init(name, license)).tap(progress.inc),
		]).map(progress.finish)

const rejectIfExists0: Curry<Binary<string, boolean, Oath<void, string>>> = name => exists =>
	Oath.fromBoolean(
		() => !exists,
		noop,
		() => `"srv/${name}" already exists!`,
	)

const createFilesIfNotExists0: Binary<string, License, Unary<string, Oath<void, string | Error>>> =
	(name, license) => path =>
		directoryExists0(path).chain(rejectIfExists0(name)).chain(createFiles0(path, name, license))

const initProgress: Unary<string, void> = name =>
	progress.start(`Initializing new server application "${name}"`)

const run = (name: string, license: License) => `${getSPDXRecord(license)}

// This file is run with bun when executing "bin/run".
// Configure starting the app here.

console.log("TODO: set up ${name}")
`

const init = (name: string, license: License) => `${getSPDXRecord(license)}

// This file is run with bun when executing "bin/init".
// If you need something to be done before running the app, this is the right place to start.
// If the app does not require any configuration, just remove this file.

console.log("TODO: set up ${name} initialization")
`

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
