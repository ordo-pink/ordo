// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { identity } from "ramda"

import { type Thunk, type Unary } from "@ordo-pink/tau"
import { Oath } from "@ordo-pink/oath"
import { runCommand0 } from "@ordo-pink/binutil"

type _P = { coverage: boolean }
export const test: Unary<_P, void> = ({ coverage: cov }) =>
	void Oath.of("opt/bun test .")
		.chain(cmd => Oath.fromBoolean(isCovOn(cov), enableCov(cmd), disableCov(cmd)))
		.fix(identity)
		.chain(cmd => runCommand0(cmd, { stdout: "inherit", stderr: "inherit" }))
		.orNothing()

const enableCov: Unary<string, Thunk<string>> = cmd => () => `${cmd} --coverage`
const disableCov: Unary<string, Thunk<string>> = cmd => () => cmd
const isCovOn: Unary<boolean | void, Thunk<boolean>> = x => () => Boolean(x)
