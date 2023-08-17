// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { License } from "@ordo-pink/binutil"

import {
	createProgress,
	createRepositoryFile0,
	getLicense,
	getSPDXRecord,
} from "@ordo-pink/binutil"
import { directoryExists0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { noop } from "@ordo-pink/tau"
import { camel } from "case"

// --- Public ---

export const mkbin = (name: string, license: License) =>
	Oath.of(`./boot/src/${name}`)
		.tap(() => progress.start("Initializing new binary"))
		.chain(path =>
			directoryExists0(path)
				.chain(exists =>
					Oath.fromBoolean(
						() => !exists,
						noop,
						() => `"bin/${name}" already exists!`
					)
				)
				.chain(() =>
					Oath.all([
						createRepositoryFile0(`${path}/license`, getLicense(license)).tap(progress.inc),
						createRepositoryFile0(`${path}/mod.ts`, mod(name, license)).tap(progress.inc),
						createRepositoryFile0(`${path}/src/impl.ts`, impl(name, license)).tap(progress.inc),
						createRepositoryFile0(`${path}/src/impl.test.ts`, test(name, license)).tap(
							progress.inc
						),
					])
				)
		)
		.map(progress.finish)
		.orElse(e => {
			progress.break(e)
			return false
		})

// --- Internal ---

const progress = createProgress()

const impl = (name: string, license: License) => `${getSPDXRecord(license)}
export const ${camel(name)} = () => {
	const message = "Hello from ${name} bin!"

	console.log(message)

	return message
}`

const mod = (name: string, license: License) => `${getSPDXRecord(license)}
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
