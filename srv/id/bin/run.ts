import { getDenoPath, runDenoCommand } from "#lib/binutil/mod.ts"
import { identity } from "#lib/tau/mod.ts"

await runDenoCommand(getDenoPath(), [
	"run",
	"--allow-net",
	"--allow-env",
	"--allow-read",
	"--allow-write",
	"--allow-run",
	"--unstable",
	"--watch",
	"srv/id/mod.ts",
]).fork(identity, identity)
