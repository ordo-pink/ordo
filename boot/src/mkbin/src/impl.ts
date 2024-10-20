// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { camel } from "case"

import { Binary, Curry, Ternary, Thunk, Unary, noop } from "@ordo-pink/tau"
import {
	create_progress,
	create_repository_file,
	get_license,
	get_spdx_record,
} from "@ordo-pink/binutil"
import type { TLicenseType } from "@ordo-pink/binutil"
import { Oath } from "@ordo-pink/oath"
import { dir_exists0 } from "@ordo-pink/fs"
import { isReservedJavaScriptKeyword } from "@ordo-pink/rkwjs"

// --- Public ---

export const mkbin = (name: string, license: TLicenseType) =>
	Oath.of(isReservedJavaScriptKeyword(name) ? `${name}-bin` : name)
		.tap(initProgress)
		.chain(name => Oath.of(`./boot/src/${name}`).chain(createFilesIfNotExists0(name, license)))
		.orElse(e => {
			progress.break(e)
			return false
		})

// --- Internal ---

const progress = create_progress()

const initProgress: Unary<string, void> = name =>
	progress.start(`Initializing new binary "${name}"`)

const createFiles0: Ternary<string, string, TLicenseType, Thunk<Oath<void, Error>>> =
	(path, name, license) => () =>
		Oath.all([
			create_repository_file(`${path}/license`, get_license(license)).tap(progress.inc),
			create_repository_file(`${path}/index.ts`, index(name, license)).tap(progress.inc),
			create_repository_file(`${path}/src/${name}.impl.ts`, impl(name, license)).tap(progress.inc),
			create_repository_file(`${path}/src/${name}.test.ts`, test(name, license)).tap(progress.inc),
		]).map(progress.finish)

const rejectIfExists0: Curry<Binary<string, boolean, Oath<void, string>>> = name => exists =>
	Oath.fromBoolean(
		() => !exists,
		noop,
		() => `"bin/${name}" already exists!`,
	)

const createFilesIfNotExists0: Binary<
	string,
	TLicenseType,
	Unary<string, Oath<void, string | Error>>
> = (name, license) => path =>
	dir_exists0(path)
		.chain(rejectIfExists0(name))
		.chain(createFiles0(path, name, license))

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
