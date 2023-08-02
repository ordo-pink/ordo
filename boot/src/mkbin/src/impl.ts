// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { License } from "#lib/binutil/mod.ts"

import { camelCase } from "#x/case@2.1.1/mod.ts"
import { createRepositoryFile, getLicense, getSPDXRecord } from "#lib/binutil/mod.ts"
import { directoryExists, getAbsolutePath } from "#lib/fs/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { noop } from "#lib/tau/mod.ts"

// PUBLIC -----------------------------------------------------------------------------------------

export const main = (name: string, license: License) =>
	Oath.of(getAbsolutePath(`boot/src/${name}`)).chain(path =>
		directoryExists(path)
			.chain(exists => Oath.fromBoolean(() => !exists, noop, noop))
			.chain(() =>
				Oath.all([
					createRepositoryFile(`${path}/license`, getLicense(license)),
					createRepositoryFile(`${path}/mod.ts`, mod(name, license)),
					createRepositoryFile(`${path}/src/impl.ts`, impl(name, license)),
					createRepositoryFile(`${path}/src/impl.test.ts`, test(name, license)),
				])
			)
			.map(noop)
	)

// INTERNAL ---------------------------------------------------------------------------------------

const impl = (name: string, license: License) => `${getSPDXRecord(license)}
export const ${camelCase(name)} = () => {
	console.log("Hello, ${name} bin")
}`

const mod = (name: string, license: License) => `${getSPDXRecord(license)}
import { Command } from "#x/cliffy@v1.0.0-rc.2/command/mod.ts"
import { ${camelCase(name)} } from "./src/impl.ts"

const opts = await new Command()
	.name("${name}")
	.description("${name} description.")
	.version("0.1.0")
	.parse(Deno.args)

${camelCase(name)}()
`

const test = (name: string, license: License) => `${getSPDXRecord(license)}
import { assertEquals } from "#std/testing/asserts.ts"

Deno.test("${name} should pass", () => assertEquals(true, true))
`
