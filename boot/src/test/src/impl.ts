import { getDenoPath, runDenoCommand } from "#lib/binutil/mod.ts"
import { Oath } from "#lib/oath/mod.ts"

export const test = (coverage?: boolean) =>
	Oath.of(getDenoPath()).chain(path =>
		Oath.of(["test", "--allow-run", "--allow-read", "--allow-write", "--parallel"])
			.map(args => (coverage ? args.concat(["--coverage=./var/coverage"]) : args))
			.map(args => args.concat(Deno.cwd()))
			.chain(args => runDenoCommand(path, args))
	)
