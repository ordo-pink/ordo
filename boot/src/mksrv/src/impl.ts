// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { camel, pascal, title } from "case"

import { Binary, Curry, Ternary, Thunk, Unary, noop } from "@ordo-pink/tau"
import {
	create_progress,
	create_repository_file,
	get_license,
	get_spdx_record,
} from "@ordo-pink/binutil"
import { dir_exists0, get_absolute_path } from "@ordo-pink/fs"
import type { TLicenseType } from "@ordo-pink/binutil"
import { Oath } from "@ordo-pink/oath"
import { isReservedJavaScriptKeyword } from "@ordo-pink/rkwjs"

// --- Public ---

export const mksrv = (name: string, license: TLicenseType) =>
	Oath.of(isReservedJavaScriptKeyword(name) ? `${name}-srv` : name)
		.tap(initProgress)
		.chain(name =>
			Oath.of(get_absolute_path(`./srv/${name}`)).chain(createFilesIfNotExists0(name, license)),
		)
		.orElse(e => {
			progress.break(e)
			return false
		})

// --- Internal ---

const progress = create_progress()

const createFiles0: Ternary<string, string, TLicenseType, Thunk<Oath<void, Error>>> =
	(path, name, license) => () =>
		Oath.all([
			create_repository_file(`${path}/license`, get_license(license)).tap(progress.inc),
			create_repository_file(`${path}/readme.md`, readme(name)).tap(progress.inc),
			create_repository_file(`${path}/index.ts`, index(name, license)).tap(progress.inc),
			create_repository_file(`${path}/src/${name}.impl.ts`, impl(name, license)).tap(progress.inc),
			create_repository_file(`${path}/src/${name}.impl.test.ts`, test(name, license)).tap(
				progress.inc,
			),
			create_repository_file(`${path}/src/${name}.types.ts`, types(name, license)).tap(
				progress.inc,
			),
			create_repository_file(`${path}/bin/run.ts`, run(name, license)).tap(progress.inc),
			create_repository_file(`${path}/bin/init.ts`, init(name, license)).tap(progress.inc),
		]).map(progress.finish)

const rejectIfExists0: Curry<Binary<string, boolean, Oath<void, string>>> = name => exists =>
	Oath.fromBoolean(
		() => !exists,
		noop,
		() => `"srv/${name}" already exists!`,
	)

const createFilesIfNotExists0: Binary<
	string,
	TLicenseType,
	Unary<string, Oath<void, string | Error>>
> = (name, license) => path =>
	dir_exists0(path)
		.chain(rejectIfExists0(name))
		.chain(createFiles0(path, name, license))

const initProgress: Unary<string, void> = name =>
	progress.start(`Initializing new server application "${name}"`)

const run = (name: string, license: TLicenseType) => `${get_spdx_record(license)}

// This file is run with bun when executing "bin/run".
// Configure starting the app here.

console.log("TODO: set up ${name}")
`

const init = (name: string, license: TLicenseType) => `${get_spdx_record(license)}

// This file is run with bun when executing "bin/init".
// If you need something to be done before running the app, this is the right place to start.
// If the app does not require any configuration, just remove this file.

console.log("TODO: set up ${name} initialization")
`

const index = (name: string, license: TLicenseType) => `${get_spdx_record(license)}
export * from "./src/${name}.impl"
export * from "./src/${name}.types"
`

const impl = (name: string, license: TLicenseType) => `${get_spdx_record(license)}
import type { ${pascal(name)} } from "./${name}.types"

export const ${camel(name)}: ${pascal(name)} = "${name}"
`

const types = (name: string, license: TLicenseType) => `${get_spdx_record(license)}
export type ${pascal(name)} = "${name}"
`

const test = (name: string, license: TLicenseType) => `${get_spdx_record(license)}
import { test, expect } from "bun:test"
import { ${camel(name)} } from "./${name}.impl"

test("${name} should pass", () => {
	expect(${camel(name)}).toEqual("${name}")
})
`

const readme = (name: string) => `# ${title(name)}
`
