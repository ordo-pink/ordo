// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { License } from "#lib/binutil/mod.ts"

import { titleCase, camelCase } from "#x/case@2.1.1/mod.ts"
import pascalCase from "#x/case@2.1.1/pascalCase.ts"
import { createRepositoryFile, getLicense, getSPDXRecord } from "#lib/binutil/mod.ts"
import { isReservedJavaScriptKeyword } from "#lib/rkwjs/mod.ts"
import { getAbsolutePath, isDirectory } from "#lib/fs/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { noop } from "#lib/tau/mod.ts"

// PUBLIC -----------------------------------------------------------------------------------------

export const main = (name: string, license: License) =>
	Oath.of(isReservedJavaScriptKeyword(name) ? `${name}-srv` : name).chain(name =>
		Oath.of(getAbsolutePath(`./srv/${name}`)).chain(path =>
			isDirectory(path)
				.chain(exists => Oath.fromBoolean(() => !exists, noop, noop))
				.chain(() =>
					Oath.all([
						createRepositoryFile(`${path}/license`, getLicense(license)),
						createRepositoryFile(`${path}/readme.md`, readme(name)),
						createRepositoryFile(`${path}/mod.ts`, mod(license)),
						createRepositoryFile(`${path}/src/impl.ts`, impl(name, license)),
						createRepositoryFile(`${path}/src/impl.test.ts`, test(name, license)),
						createRepositoryFile(`${path}/src/types.ts`, types(name, license)),
					])
				)
				.map(noop)
		)
	)

// INTERNAL ---------------------------------------------------------------------------------------

const mod = (license: License) => `${getSPDXRecord(license)}
export * from "./src/impl.ts"
export * from "./src/types.ts"
`

const impl = (name: string, license: License) => `${getSPDXRecord(license)}
import type { ${pascalCase(name)} } from "./types.ts"

export const ${camelCase(name)}: ${pascalCase(name)} = "${name}"
`

const types = (name: string, license: License) => `${getSPDXRecord(license)}
export type ${pascalCase(name)} = "${name}"
`

const test = (name: string, license: License) => `${getSPDXRecord(license)}
import { assertEquals } from "#std/testing/asserts.ts"
import { ${camelCase(name)} } from "./impl.ts"

Deno.test("${name}", () => assertEquals(${camelCase(name)}, "${name}"))
`

const readme = (name: string) => `# ${titleCase(name)}
`
