import { getDenoPath, runCommand, runDenoCommand } from "#lib/binutil/mod.ts"
import { identity } from "#lib/tau/mod.ts"
import { Oath } from "#lib/oath/mod.ts"

await Oath.all([
	runDenoCommand(getDenoPath(), [
		"run",
		"--allow-net",
		"--allow-env",
		"--allow-read",
		"--allow-write",
		"--allow-run",
		"--unstable",
		"srv/web/dev.ts",
	]),
	runCommand("opt/tailwind", [
		"-i",
		"./lib/css/main.css",
		"-o",
		"./var/srv/web/main.css",
		"--watch",
		"-c",
		"./tailwind.config.cjs",
	]),
]).fork(identity, identity)
