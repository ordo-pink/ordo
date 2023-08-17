// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import * as util from "@ordo-pink/binutil"
import { isFile0, readFile0, readdir0, writeFile0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { Binary, Curry, Unary, noop } from "@ordo-pink/tau"

// --- Public ---

export const precommit = () =>
	Oath.empty()
		.chain(checkAndCreateMissingLicenses0)
		.chain(checkAndCreateMissingSPDXRecords0)
		.orElse(console.error)

// --- Internal ---

const spdxRecordsProgress = util.createProgress()

const startSPDXRecordProgress = () => spdxRecordsProgress.start("Creating missing SPDX records")

const checkAndCreateMissingSPDXRecords0 = () =>
	Oath.empty()
		.tap(startSPDXRecordProgress)
		.chain(() => createSPDXRecords0("lib"))
		.chain(() => createSPDXRecords0("srv"))
		.chain(() => createSPDXRecords0("boot/src"))
		.bimap(spdxRecordsProgress.break, spdxRecordsProgress.finish)

const createSPDXRecords0: Unary<string, Oath<void[], Error>> = (path: string) =>
	readdir0(path, { withFileTypes: true }).chain(dirents =>
		Oath.all(
			dirents.map(dirent =>
				dirent.isDirectory()
					? createSPDXRecords0(`${path}/${dirent.name}`).map(noop)
					: dirent.name.endsWith(".ts") || dirent.name.endsWith(".tsx")
					? createSPDXRecord0(`${path}/${dirent.name}`)
					: Oath.empty(),
			),
		),
	)

const createSPDXRecord0 = (path: string) =>
	Oath.of(path.trim().split("/").slice(0, 2).join("/")).chain(space =>
		isFile0(`${space}/license`).chain(exists =>
			exists
				? readFile0(`${space}/license`, "utf-8")
						.map(license => (license === mitLicense ? ("MIT" as const) : ("MPL-2.0" as const)))
						.map(license => util.getSPDXRecord(license))
						.chain(spdx =>
							// TODO: Replace invalid SPDX
							readFile0(path, "utf-8").chain(content =>
								(content as string).startsWith(spdx)
									? Oath.empty()
									: writeFile0(path, `${spdx}\n${content}`).map(spdxRecordsProgress.inc),
							),
						)
				: Oath.empty(),
		),
	)

const createLicensesProgress = util.createProgress()

const startLicenseGenerationProgress = () =>
	createLicensesProgress.start("Creating missing licenses")

const checkAndCreateMissingLicenses0 = () =>
	Oath.empty()
		.tap(startLicenseGenerationProgress)
		.chain(() => createLicenses0("lib"))
		.chain(() => createLicenses0("srv"))
		.chain(() => createLicenses0("boot/src"))
		.bimap(createLicensesProgress.break, createLicensesProgress.finish)

const createLicenses0 = (space: "lib" | "srv" | "boot/src") =>
	readdir0(space, { withFileTypes: true })
		.map(util.direntsToDirs)
		.map(util.getNames)
		.chain(collectMissingLicensePaths0(space))
		.chain(createLicenseFiles0)

const collectMissingLicensePaths0: Curry<Binary<string, string[], Oath<string[]>>> =
	space => dirs =>
		Oath.all(
			dirs.map(dir =>
				isFile0(`${space}/${dir}/license`).map(exists =>
					exists ? null : `${space}/${dir}/license`,
				),
			),
		).map(paths => paths.filter(Boolean) as string[])

const createLicenseFiles0: Unary<string[], Oath<void[], Error>> = paths =>
	Oath.all(
		paths.map(path => util.createRepositoryFile0(path, mitLicense).tap(createLicensesProgress.inc)),
	)

const mitLicense = util.getLicense("MIT")
