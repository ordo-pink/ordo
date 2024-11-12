// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { dir_exists0 } from "@ordo-pink/fs"
import { run_async_command } from "@ordo-pink/binutil"

export const exec = (location?: string, command?: string) =>
	Oath.FromNullable(location)
		.pipe(ops0.map(location => (location.startsWith("./") ? location.slice(2) : location)))
		.pipe(ops0.rejected_map(() => "Location not provided"))
		.pipe(
			ops0.chain(location =>
				Oath.If(location.startsWith("lib") || location.startsWith("srv"), {
					T: () => location,
					F: () =>
						`Provided location "${location}" is invalid. Only "lib/*" or "srv/*" locations are supported.`,
				}),
			),
		)
		.pipe(
			ops0.chain(location =>
				Oath.FromNullable(command)
					.pipe(ops0.rejected_map(() => "Command not provided"))
					.pipe(
						ops0.chain(command =>
							dir_exists0(location).pipe(
								ops0.chain(exists =>
									Oath.If(exists, {
										T: () => ({ location, command }),
										F: () => `Path "${location}" does not exist`,
									}),
								),
							),
						),
					),
			),
		)
		.pipe(
			ops0.chain(({ location, command }) =>
				run_async_command(command, {
					cwd: location,
					stdin: "pipe",
					stdout: "pipe",
					stderr: "pipe",
				}),
			),
		)
		.invoke(invokers0.or_else(console.error))
