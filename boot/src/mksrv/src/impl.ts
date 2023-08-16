// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { License } from "@ordo-pink/binutil"

import { createRepositoryFile0, getLicense, getSPDXRecord } from "@ordo-pink/binutil"
import { isReservedJavaScriptKeyword } from "@ordo-pink/rkwjs"
import { getAbsolutePath, isDirectory0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { noop } from "@ordo-pink/tau"
import Case from "case"

// --- Public ---

export const mksrv = (name: string, license: License) =>
	Oath.of(isReservedJavaScriptKeyword(name) ? `${name}-srv` : name).chain(name =>
		Oath.of(getAbsolutePath(`./srv/${name}`)).chain(path =>
			isDirectory0(path)
				.chain(exists => Oath.fromBoolean(() => !exists, noop, noop))
				.tap(console.log)
				.chain(() =>
					Oath.all([
						createRepositoryFile0(`${path}/license`, getLicense(license)),
						createRepositoryFile0(`${path}/readme.md`, readme(name)),
						createRepositoryFile0(`${path}/mod.ts`, mod(license)),
						createRepositoryFile0(`${path}/src/impl.ts`, impl(name, license)),
						createRepositoryFile0(`${path}/src/impl.test.ts`, test(name, license)),
						createRepositoryFile0(`${path}/src/types.ts`, types(name, license)),
					])
				)
				.map(noop)
		)
	)

// --- Internal ---

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
