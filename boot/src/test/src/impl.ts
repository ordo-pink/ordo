import { identity } from "ramda"

import { Oath, invokers0 } from "@ordo-pink/oath"
import { type Thunk, type Unary } from "@ordo-pink/tau"
import { run_command } from "@ordo-pink/binutil"

type _P = { coverage: boolean }
export const test: Unary<_P, void> = ({ coverage: cov }) =>
	void Oath.Resolve("opt/bun test .")
		.and(cmd => Oath.If(isCovOn(cov), { T: enableCov(cmd), F: disableCov(cmd) }))
		.fix(identity)
		.and(cmd => run_command(cmd, { stdout: "inherit", stderr: "inherit" }))
		.invoke(invokers0.or_nothing)

const enableCov: Unary<string, Thunk<string>> = cmd => () => `${cmd} --coverage`
const disableCov: Unary<string, Thunk<string>> = cmd => () => cmd
const isCovOn: Unary<boolean | void, boolean> = x => Boolean(x)
