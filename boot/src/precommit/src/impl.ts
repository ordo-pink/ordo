// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import * as util from "@ordo-pink/binutil"
import { Binary, Curry, Unary, noop } from "@ordo-pink/tau"
import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { is_file0, read_file0, readdir0, write_file0 } from "@ordo-pink/fs"

// --- Public ---

export const precommit = () =>
	Oath.Empty()
		.and(create_licenses_if_not_exist)
		.and(create_spdx_records_if_not_exist)
		.invoke(invokers0.or_else(console.error))

// --- Internal ---

const spdx_progress = util.create_progress()

const create_spdx_records_if_not_exist = () =>
	Oath.Empty()
		.pipe(ops0.tap(() => spdx_progress.start("Creating missing SPDX records")))
		.and(() => create_spdx_records("lib"))
		.and(() => create_spdx_records("srv"))
		.and(() => create_spdx_records("boot/src"))
		.pipe(ops0.bimap(spdx_progress.break, spdx_progress.finish))

const create_spdx_records: Unary<string, Oath<void[], Error>> = (path: string) =>
	readdir0(path, { withFileTypes: true }).and(dirents =>
		Oath.Merge(
			dirents.map(dirent =>
				dirent.isDirectory()
					? create_spdx_records(`${path}/${dirent.name}`).and(noop)
					: dirent.name.endsWith(".ts") || dirent.name.endsWith(".tsx")
						? create_spdx_record(`${path}/${dirent.name}`)
						: Oath.Empty(),
			),
		),
	)

const create_spdx_record = (path: string) =>
	Oath.Resolve(
		path
			.trim()
			.split("/")
			.slice(0, path.includes("boot/src") ? 3 : 2)
			.join("/"),
	).and(space =>
		is_file0(`${space}/license`).and(exists =>
			exists
				? read_file0(`${space}/license`, "utf-8")
						.and(license => (license === unlicense ? "Unlicense" : "AGPL-3.0-only"))
						.and(license => util.get_spdx_record(license))
						.and(spdx =>
							read_file0(path, "utf-8").and(content =>
								(content as string).startsWith(spdx)
									? Oath.Empty()
									: write_file0(path, `${spdx}\n${content as string}`).and(spdx_progress.inc),
							),
						)
				: Oath.Empty(),
		),
	)

const license_progress = util.create_progress()

const create_licenses_if_not_exist = () =>
	Oath.Empty()
		.pipe(ops0.tap(() => license_progress.start("Creating missing licenses")))
		.and(() => create_licenses("lib"))
		.and(() => create_licenses("srv"))
		.and(() => create_licenses("boot/src"))
		.pipe(ops0.bimap(license_progress.break, license_progress.finish))

const create_licenses = (space: "lib" | "srv" | "boot/src") =>
	readdir0(space, { withFileTypes: true })
		.and(util.dirents_to_dirs)
		.and(util.get_dirent_names)
		.and(collect_missing_license_paths(space))
		.and(create_license_files)

const collect_missing_license_paths: Curry<Binary<string, string[], Oath<string[]>>> =
	space => dirs =>
		Oath.Merge(
			dirs.map(dir =>
				is_file0(`${space}/${dir}/license`).and(exists =>
					exists ? null : `${space}/${dir}/license`,
				),
			),
		).and(paths => paths.filter(Boolean) as string[])

const create_license_files: Unary<string[], Oath<void[], Error>> = paths =>
	Oath.Merge(
		paths.map(path =>
			util.create_repository_file(path, unlicense).pipe(ops0.tap(license_progress.inc)),
		),
	)

const unlicense = util.get_license("Unlicense")
