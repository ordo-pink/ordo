// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { License } from "@ordo-pink/binutil"

import {
	createProgress,
	createRepositoryFile0,
	getLicense,
	getSPDXRecord,
} from "@ordo-pink/binutil"
import { isReservedJavaScriptKeyword } from "@ordo-pink/rkwjs"
import { directoryExists0, getAbsolutePath, isDirectory0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { Binary, Curry, Ternary, Thunk, Unary, noop } from "@ordo-pink/tau"
import Case from "case"

// --- Public ---

export const mksrv = (name: string, license: License) =>
	Oath.of(isReservedJavaScriptKeyword(name) ? `${name}-srv` : name)
		.tap(initProgress)
		.chain(name =>
			Oath.of(getAbsolutePath(`./srv/${name}`)).chain(createFilesIfNotExists0(name, license))
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
			createRepositoryFile0(`${path}/mod.ts`, mod(license)).tap(progress.inc),
			createRepositoryFile0(`${path}/src/impl.ts`, impl(name, license)).tap(progress.inc),
			createRepositoryFile0(`${path}/src/impl.test.ts`, test(name, license)).tap(progress.inc),
			createRepositoryFile0(`${path}/src/types.ts`, types(name, license)).tap(progress.inc),
		]).map(progress.finish)

const rejectIfExists0: Curry<Binary<string, boolean, Oath<void, string>>> = name => exists =>
	Oath.fromBoolean(
		() => !exists,
		noop,
		() => `"bin/${name}" already exists!`
	)

const createFilesIfNotExists0: Binary<string, License, Unary<string, Oath<void, string | Error>>> =
	(name, license) => path =>
		directoryExists0(path).chain(rejectIfExists0(name)).chain(createFiles0(path, name, license))

const initProgress: Unary<string, void> = name =>
	progress.start(`Initializing new application "${name}"`)

const mod = (license: License) => `${getSPDXRecord(license)}
export * from "./src/impl.ts"
export * from "./src/types.ts"
`

const impl = (name: string, license: License) => `${getSPDXRecord(license)}
import type { ${Case.pascal(name)} } from "./types.ts"

export const ${Case.camel(name)}: ${Case.pascal(name)} = "${name}"
`

const types = (name: string, license: License) => `${getSPDXRecord(license)}
export type ${Case.pascal(name)} = "${name}"
`

const test = (name: string, license: License) => `${getSPDXRecord(license)}
import { assertEquals } from "#std/testing/asserts.ts"
import { ${Case.camel(name)} } from "./impl.ts"

Deno.test("${name}", () => assertEquals(${Case.camel(name)}, "${name}"))
`

const readme = (name: string) => `# ${Case.title(name)}
`
