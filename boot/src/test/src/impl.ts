import { Subprocess } from "bun"
import { runCommand } from "@ordo-pink/binutil"
import { Binary, Curry, Thunk, Unary } from "@ordo-pink/tau"
import { Oath } from "@ordo-pink/oath"
import { identity } from "ramda"

type _P = { coverage?: boolean }
export const test: Unary<_P, void> = async options => {
	await Oath.of("bun test .")
		.chain(setTestCommand(options.coverage))
		.fix(identity)
		.map(run)
		.orNothing()
}

const run: Unary<string, Subprocess> = command => runCommand({ command })
const enableCov: Unary<string, Thunk<string>> = cmd => () => `${cmd} --coverage`
const disableCov: Unary<string, Thunk<string>> = cmd => () => cmd
const isCovOn: Unary<boolean | void, Thunk<boolean>> = x => () => Boolean(x)
const setTestCommand: Curry<Binary<boolean | void, string, Oath<string, string>>> = cov => cmd =>
	Oath.fromBoolean(isCovOn(cov), enableCov(cmd), disableCov(cmd))
