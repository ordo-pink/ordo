import { camel, pascal, title } from "case"

import { Binary, Curry, Ternary, Thunk, Unary, noop } from "@ordo-pink/tau"
import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { create_repository_file as create, create_progress, get_license, get_spdx_record } from "@ordo-pink/binutil"
import { dir_exists0, get_absolute_path } from "@ordo-pink/fs"
import type { TLicenseType } from "@ordo-pink/binutil"
import { isReservedJavaScriptKeyword } from "@ordo-pink/rkwjs"

// --- Public ---

export const mksrv = (name: string, license: TLicenseType) =>
	Oath.Resolve(isReservedJavaScriptKeyword(name) ? `${name}-srv` : name)
		.pipe(ops0.tap(init_progress))
		.pipe(
			ops0.chain(name =>
				Oath.Resolve(get_absolute_path(`./srv/${name}`)).pipe(ops0.chain(create_file_if_not_exists(name, license))),
			),
		)
		.invoke(
			invokers0.or_else(e => {
				progress.break(e)
				return false
			}),
		)

// --- Internal ---

const progress = create_progress()

const createFiles0: Ternary<string, string, TLicenseType, Thunk<Oath<void, Error>>> = (path, name, license) => () =>
	Oath.Merge([
		create(`${path}/license`, get_license(license)).pipe(ops0.tap(progress.inc)),
		create(`${path}/readme.md`, readme(name)).pipe(ops0.tap(progress.inc)),
		create(`${path}/index.ts`, index(name, license)).pipe(ops0.tap(progress.inc)),
		create(`${path}/src/${name}.impl.ts`, impl(name, license)).pipe(ops0.tap(progress.inc)),
		create(`${path}/src/${name}.impl.test.ts`, test(name, license)).pipe(ops0.tap(progress.inc)),
		create(`${path}/src/${name}.types.ts`, types(name, license)).pipe(ops0.tap(progress.inc)),
		create(`${path}/bin/run.ts`, run(name, license)).pipe(ops0.tap(progress.inc)),
		create(`${path}/bin/init.ts`, init(name, license)).pipe(ops0.tap(progress.inc)),
	]).pipe(ops0.map(progress.finish))

const reject_if_exists: Curry<Binary<string, boolean, Oath<void, string>>> = name => exists =>
	Oath.If(!exists, { T: noop, F: () => `"srv/${name}" already exists!` })

const create_file_if_not_exists: Binary<string, TLicenseType, Unary<string, Oath<void, string | Error>>> =
	(name, license) => path =>
		dir_exists0(path)
			.pipe(ops0.chain(reject_if_exists(name)))
			.pipe(ops0.chain(createFiles0(path, name, license)))

const init_progress: Unary<string, void> = name => progress.start(`Initializing new server application "${name}"`)

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
