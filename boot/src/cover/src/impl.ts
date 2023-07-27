// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { getDenoPath, runDenoCommand } from "#lib/binutil/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { rmdir } from "#lib/fs/mod.ts"

const collectCoverage = (path: string) =>
	runDenoCommand("./bin/test", ["--coverage"]).map(() => path)

const createLcovReport = (path: string) =>
	runDenoCommand(path, [
		"coverage",
		"./var/coverage",
		"--lcov",
		"--output=./var/coverage/profile.lcov",
	]).map(() => path)

export const main = (options: { lcov: boolean }) =>
	Oath.of("./var/coverage")
		.chain(coveragePath => rmdir(coveragePath, { recursive: true }))
		.map(() => getDenoPath())
		.chain(path => collectCoverage(path))
		.chain(path => (options.lcov ? createLcovReport(path) : Oath.of(path)))
