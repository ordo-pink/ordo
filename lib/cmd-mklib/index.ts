import { promises } from "node:fs"

import { camel, pascal, title } from "case"

import { type TLicenseType, create_progress, get_license, get_spdx_record } from "@ordo-pink/binutil"
import { is_reserved_javascript_keyword } from "@ordo-pink/rkwjs"

const progress = create_progress()

// TODO Organise arguments, -shortoptions and --long-options into separate groups
// TODO Extract licence option
export const mklib_command = {
	mklib: {
		help: "Create a new library in 'lib' with given name. Example: './bin mklib hello-world'",
		handler: async (args: string[]) => {
			progress.start("Creating new library")

			const lib_name = args[1]
			const license = "AGPL-3.0-only"

			if (!lib_name) {
				progress.break({ message: "Invalid usage: lib name not provided." })
				process.exit(1)
			}

			if (is_reserved_javascript_keyword(lib_name)) {
				progress.break({ message: `Invalid usage: lib name '${lib_name}' is a reserved JavaScript keyword.` })
				process.exit(1)
			}

			try {
				await promises.mkdir(`lib/${lib_name}`)
				await promises.mkdir(`lib/${lib_name}/src`)

				await Promise.all([
					promises.writeFile(`lib/${lib_name}/license`, get_license(license)).then(() => progress.inc()),
					promises.writeFile(`lib/${lib_name}/readme.md`, readme(lib_name)).then(() => progress.inc()),
					promises.writeFile(`lib/${lib_name}/index.ts`, index(lib_name, license)).then(() => progress.inc()),
					promises.writeFile(`lib/${lib_name}/src/${lib_name}.impl.ts`, impl(lib_name, license)).then(() => progress.inc()),
					promises.writeFile(`lib/${lib_name}/src/${lib_name}.types.ts`, types(lib_name, license)).then(() => progress.inc()),
					promises.writeFile(`lib/${lib_name}/src/${lib_name}.test.ts`, test(lib_name, license)).then(() => progress.inc()),
				])

				progress.finish()
			} catch (e) {
				try {
					await promises.rm(`lib/${lib_name}`, { recursive: true, force: true })
					progress.break(e)
				} catch (e) {
					progress.break(e)
				}

				process.exit(1)
			}
		},
	},
}

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
import { expect, test } from "bun:test"
import { ${camel(name)} } from "./${name}.impl"

test("${name} should pass", () => {
	expect(${camel(name)}).toEqual("${name}")
})
`

const readme = (name: string) => `# ${title(name)}
`
