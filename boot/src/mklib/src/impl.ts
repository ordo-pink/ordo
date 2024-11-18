// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { camel, pascal, title } from "case"

import { Binary, Curry, Ternary, Thunk, Unary, noop } from "@ordo-pink/tau"
import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import {
	TLicenseType,
	create_progress,
	create_repository_file as echo,
	get_license,
	get_spdx_record,
} from "@ordo-pink/binutil"
import { dir_exists0 } from "@ordo-pink/fs"
import { isReservedJavaScriptKeyword } from "@ordo-pink/rkwjs"

// --- Public ---

export const mklib = (name: string, license: TLicenseType) =>
	Oath.Resolve(isReservedJavaScriptKeyword(name) ? `${name}-bin` : name)
		.pipe(ops0.tap(init_progress))
		.and(name => Oath.Resolve(`./lib/${name}`).and(createFilesIfNotExists0(name, license)))
		.invoke(
			invokers0.or_else(e => {
				progress.break(e)
				return false
			}),
		)

// --- Internal ---

const progress = create_progress()

const init_progress: Unary<string, void> = name =>
	progress.start(`Initializing new library "${name}"`)

const create_files: Ternary<string, string, TLicenseType, Thunk<Oath<void, Error>>> =
	(path, name, license) => () =>
		Oath.Merge([
			echo(`${path}/license`, get_license(license)).pipe(ops0.tap(progress.inc)),
			echo(`${path}/readme.md`, readme(name)).pipe(ops0.tap(progress.inc)),
			echo(`${path}/index.ts`, index(name, license)).pipe(ops0.tap(progress.inc)),
			echo(`${path}/src/${name}.impl.ts`, impl(name, license)).pipe(ops0.tap(progress.inc)),
			echo(`${path}/src/${name}.test.ts`, test(name, license)).pipe(ops0.tap(progress.inc)),
			echo(`${path}/src/${name}.types.ts`, types(name, license)).pipe(ops0.tap(progress.inc)),
		]).and(progress.finish)

const reject_if_exists: Curry<Binary<string, boolean, Oath<void, string>>> = name => exists =>
	Oath.If(!exists, { T: noop, F: () => `"lib/${name}" already exists!` })

const createFilesIfNotExists0: Binary<
	string,
	TLicenseType,
	Unary<string, Oath<void, string | Error>>
> = (name, license) => path =>
	dir_exists0(path)
		.and(reject_if_exists(name))
		.and(create_files(path, name, license))

// --- Internal ---

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
