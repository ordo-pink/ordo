import type { Thunk, Unary } from "@ordo-pink/tau"
import { identity } from "ramda"
import { runCommand0 } from "@ordo-pink/binutil"
import { Oath } from "@ordo-pink/oath"

type _P = { coverage: boolean }
export const test: Unary<_P, void> = async ({ coverage: cov }) => {
	await Oath.of("bun test .")
		.chain(cmd => Oath.fromBoolean(isCovOn(cov), enableCov(cmd), disableCov(cmd)))
		.fix(identity)
		.chain(cmd => runCommand0(cmd, { stdout: "inherit", stderr: "inherit" }))
		.orNothing()
}

const enableCov: Unary<string, Thunk<string>> = cmd => () => `${cmd} --coverage`
const disableCov: Unary<string, Thunk<string>> = cmd => () => cmd
const isCovOn: Unary<boolean | void, Thunk<boolean>> = x => () => Boolean(x)
