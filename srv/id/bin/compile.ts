import { die, runBunCommand0 } from "@ordo-pink/binutil"
import { createDirectoryIfNotExists0, mv0 } from "@ordo-pink/fs"
import { getc } from "@ordo-pink/getc"
import { Oath } from "@ordo-pink/oath"
import { keysOf } from "@ordo-pink/tau"

const env = getc()

const defineEnv = (env: Record<string, string>) =>
	keysOf(env).reduce((acc, key) => acc.concat(`--define Bun.env.${key}='${env[key]}' `), "")
const createOutDirectoryIfNotExists0 = () => createDirectoryIfNotExists0("var/out")
const moveCompiledFileToOutDirectory0 = () => mv0("id", "var/out/id")

const command = `build srv/id/index.ts --outfile=id --compile `
const envDefinitions = defineEnv(env)

Oath.of(command.concat(envDefinitions))
	.chain(runBunCommand0)
	.chain(createOutDirectoryIfNotExists0)
	.chain(moveCompiledFileToOutDirectory0)
	.orElse(die())
