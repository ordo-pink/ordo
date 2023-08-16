// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { isFile0, readdir0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"
import { runCommand0, runBunCommand0, createProgress } from "@ordo-pink/binutil"
import { noop } from "@ordo-pink/tau"

// --- Public ---

export const init = () =>
	Oath.empty()
		.tap(() => progress.start("Initializing server applications"))
		.chain(() => initSrv())
		.tap(() => progress.finish())
		.tap(() => progress.start("Creating symbolic links"))
		.chain(() => createSymlinks())
		.tap(() => progress.finish())
		.tap(() => progress.start("Compiling binaries"))
		.chain(() => compileBin())
		.tap(() => progress.finish())
		.map(noop)
		.toPromise()

// Internal

const progress = createProgress()

const initSrv = () =>
	readdir0("./srv", { withFileTypes: true })
		.map(dirents => dirents.filter(dirent => dirent.isDirectory()))
		.map(dirs => dirs.map(dir => `./srv/${dir.name}/bin/asdf.ts`))
		.chain(paths =>
			Oath.all(paths.map(path => isFile0(path).map(exists => (exists ? path : (false as const)))))
		)
		.map(paths => paths.filter(Boolean) as string[])
		.chain(paths => Oath.all(paths.map(path => runBunCommand0(`run ${path}`).tap(progress.inc))))
		.map(srvs => srvs.length)

const createSymlinks = () =>
	readdir0("./etc/init", { withFileTypes: true })
		.map(dirents => dirents.filter(dirent => dirent.isFile()).map(item => item.name))
		.chain(files =>
			Oath.all(
				files.map(file => runCommand0(`ln -snf ./etc/init/${file} ${file}`).tap(progress.inc))
			)
		)
		.map(links => links.length)

const compileBin = () =>
	readdir0("./boot/src", { withFileTypes: true })
		.map(dirents => dirents.filter(dirent => dirent.isDirectory()).map(dir => dir.name))
		.chain(dirs =>
			Oath.all(
				dirs.map(path =>
					isFile0(`./boot/src/${path}/index.ts`).map(exists => (exists ? path : (false as const)))
				)
			)
		)
		.map(dirs => dirs.filter(Boolean))
		.chain(dirs =>
			Oath.all(
				dirs.map(dir =>
					runBunCommand0(`build ./boot/src/${dir}/index.ts --compile --outfile ${dir}`)
						.chain(() => runCommand0(`mv -fv ${dir} bin/${dir}`))
						.tap(progress.inc)
				)
			)
		)
		.map(bins => bins.length)
