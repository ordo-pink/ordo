import { getDenoPath, runCommand, runDenoCommand } from "#lib/binutil/mod.ts"
import { isFile, readdir } from "#lib/fs/mod.ts"
import { Oath } from "#lib/oath/mod.ts"

// PUBLIC -----------------------------------------------------------------------------------------

export const init = () =>
	Oath.of(getDenoPath()).chain(path =>
		compileBin(path)
			.chain(() => initSrv(path))
			.chain(createSymlinks)
	)

// INTERNAL ---------------------------------------------------------------------------------------

const initSrv = (denoPath: string) =>
	readdir("./srv")
		.map(entries => entries.filter(entry => entry.isDirectory))
		.map(entries =>
			entries.map(entry =>
				isFile(`./srv/${entry.name}/bin/init.ts`).map(x =>
					x ? `./srv/${entry.name}/bin/init.ts` : null
				)
			)
		)
		.chain(entries => Oath.all(entries))
		.map(entries => entries.filter(Boolean) as string[])
		.chain(entries =>
			Oath.all(
				entries.map(path =>
					runDenoCommand(denoPath, [
						"run",
						"--allow-read",
						"--allow-write",
						"--allow-run",
						"--allow-env",
						path,
					])
				)
			)
		)

const createSymlinks = () =>
	readdir("./etc/init")
		.map(entries => entries.filter(entry => entry.isFile))
		.chain(entries =>
			Oath.all(
				entries.map(entry => runCommand("ln", ["-snfv", `./etc/init/${entry.name}`, entry.name]))
			)
		)

const compileBin = (denoPath: string) =>
	readdir("./boot/src")
		.map(entries => entries.filter(entry => entry.isDirectory && entry.name !== "init"))
		.chain(entries =>
			Oath.all(
				entries.map(entry =>
					runDenoCommand(denoPath, [
						"compile",
						"--allow-read",
						"--allow-write",
						"--allow-run",
						`--output=bin/${entry.name}`,
						`./boot/src/${entry.name}/mod.ts`,
					])
				)
			)
		)
