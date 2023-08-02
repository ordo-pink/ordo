// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Unary } from "#ramda"

import { getDenoPath, runDenoCommand } from "#lib/binutil/mod.ts"
import { Oath } from "#lib/oath/mod.ts"
import { rmdir } from "#lib/fs/mod.ts"

// PUBLIC -----------------------------------------------------------------------------------------

export const cover: CoverFn = options =>
	Oath.of("./var/coverage")
		.chain(coveragePath => rmdir(coveragePath, { recursive: true }))
		.map(() => getDenoPath())
		.chain(path => collectCoverage(path))
		.chain(path => (options.lcov ? createLcovReport(path) : Oath.of(path)))

// INTERNAL	---------------------------------------------------------------------------------------

type Fn = Unary<string, Oath<string, Error>>
type CoverFn = Unary<{ lcov: boolean }, Oath<string, Error>>

const collectCoverage: Fn = path => runDenoCommand("./bin/test", ["--coverage"]).map(() => path)
const createLcovReport: Fn = path =>
	runDenoCommand(path, [
		"coverage",
		"./var/coverage",
		"--lcov",
		"--output=./var/coverage/profile.lcov",
	]).map(() => path)
