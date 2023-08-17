// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import * as util from "@ordo-pink/binutil"
import { isFile0, readdir0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { Binary, Curry, Unary } from "@ordo-pink/tau"

export const precommit = () =>
	Oath.empty().chain(checkAndCreateMissingLicenses0).orElse(console.error)

const createLicensesProgress = util.createProgress()

const startLicenseGenerationProgress = () =>
	createLicensesProgress.start("Creating missing licenses")
const mitLicense = util.getLicense("MIT")

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
					exists ? null : `${space}/${dir}/license`
				)
			)
		).map(paths => paths.filter(Boolean) as string[])

const createLicenseFiles0: Unary<string[], Oath<void[], Error>> = paths =>
	Oath.all(
		paths.map(path => util.createRepositoryFile0(path, mitLicense).tap(createLicensesProgress.inc))
	)
