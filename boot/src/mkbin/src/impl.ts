// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { License } from "@ordo-pink/binutil"
import { camel } from "case"
import {
	createProgress,
	createRepositoryFile0,
	getLicense,
	getSPDXRecord,
} from "@ordo-pink/binutil"
import { Binary, Curry, Ternary, Thunk, Unary, noop } from "@ordo-pink/tau"
import { isReservedJavaScriptKeyword } from "@ordo-pink/rkwjs"
import { directoryExists0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"

// --- Public ---

export const mkbin = (name: string, license: License) =>
	Oath.of(isReservedJavaScriptKeyword(name) ? `${name}-bin` : name)
		.tap(initProgress)
		.chain(name => Oath.of(`./boot/src/${name}`).chain(createFilesIfNotExists0(name, license)))
		.orElse(e => {
			progress.break(e)
			return false
		})

// --- Internal ---

const progress = createProgress()

const initProgress: Unary<string, void> = name =>
	progress.start(`Initializing new binary "${name}"`)

const createFiles0: Ternary<string, string, License, Thunk<Oath<void, Error>>> =
	(path, name, license) => () =>
		Oath.all([
			createRepositoryFile0(`${path}/license`, getLicense(license)).tap(progress.inc),
			createRepositoryFile0(`${path}/index.ts`, index(name, license)).tap(progress.inc),
			createRepositoryFile0(`${path}/src/impl.ts`, impl(name, license)).tap(progress.inc),
			createRepositoryFile0(`${path}/src/impl.test.ts`, test(name, license)).tap(progress.inc),
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

const impl = (name: string, license: License) => `${getSPDXRecord(license)}
export const ${camel(name)} = () => {
	const message = "Hello from ${name} bin!"

	console.log(message)

	return message
}`

const index = (name: string, license: License) => `${getSPDXRecord(license)}
import { Command } from "commander"
import { ${camel(name)} } from "./src/impl"

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

const test = (name: string, license: License) => `${getSPDXRecord(license)}
import { test, expect } from "bun:test"
import { ${camel(name)} } from "./impl"

test("${name} should pass", () => {
	expect(${camel(name)}).toEqual("Hello from ${name} bin!")
})
`
