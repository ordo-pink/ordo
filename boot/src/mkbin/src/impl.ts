import { camel } from "case"

import { Binary, Curry, Ternary, Thunk, Unary, noop } from "@ordo-pink/tau"
import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { create_repository_file as create, create_progress, get_license, get_spdx_record } from "@ordo-pink/binutil"
import type { TLicenseType } from "@ordo-pink/binutil"
import { dir_exists0 } from "@ordo-pink/fs"
import { isReservedJavaScriptKeyword } from "@ordo-pink/rkwjs"

// --- Public ---

export const mkbin = (name: string, license: TLicenseType) =>
	Oath.Resolve(isReservedJavaScriptKeyword(name) ? `${name}-bin` : name)
		.pipe(ops0.tap(initProgress))
		.pipe(ops0.chain(name => Oath.Resolve(`./boot/src/${name}`).pipe(ops0.chain(create_files_if_not_exists(name, license)))))
		.invoke(
			invokers0.or_else(e => {
				progress.break(e)
				return false
			}),
		)

// --- Internal ---

const progress = create_progress()

const initProgress: Unary<string, void> = name => progress.start(`Initializing new binary "${name}"`)

const createFiles0: Ternary<string, string, TLicenseType, Thunk<Oath<void, Error>>> = (path, name, license) => () =>
	Oath.Merge([
		create(`${path}/license`, get_license(license)).pipe(ops0.tap(progress.inc)),
		create(`${path}/index.ts`, index(name, license)).pipe(ops0.tap(progress.inc)),
		create(`${path}/src/${name}.impl.ts`, impl(name, license)).pipe(ops0.tap(progress.inc)),
		create(`${path}/src/${name}.test.ts`, test(name, license)).pipe(ops0.tap(progress.inc)),
	]).pipe(ops0.map(progress.finish))

const reject_if_exists: Curry<Binary<string, boolean, Oath<void, string>>> = name => exists =>
	Oath.If(!exists, { T: noop, F: () => `"bin/${name}" already exists!` })

const create_files_if_not_exists: Binary<string, TLicenseType, Unary<string, Oath<void, string | Error>>> =
	(name, license) => path =>
		dir_exists0(path)
			.pipe(ops0.chain(reject_if_exists(name)))
			.pipe(ops0.chain(createFiles0(path, name, license)))

const impl = (name: string, license: TLicenseType) => `${get_spdx_record(license)}
export const ${camel(name)} = () => {
	const message = "Hello from ${name} bin!"

	console.log(message)

	return message
}`

const index = (name: string, license: TLicenseType) => `${get_spdx_record(license)}
import { Command } from "commander"
import { ${camel(name)} } from "./src/${name}.impl"

const program = new Command()

program
	.name("${name}")
	.version("0.1.0")
	.description("${name} description.")
	.action(() => {
		${camel(name)}()
	})

program.parse()
`

const test = (name: string, license: TLicenseType) => `${get_spdx_record(license)}
import { test, expect } from "bun:test"
import { ${camel(name)} } from "./${name}.impl"

test("${name} should pass", () => {
	expect(${camel(name)}).toEqual("Hello from ${name} bin!")
})
`
