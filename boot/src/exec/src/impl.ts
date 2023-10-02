// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { runAsyncCommand0 } from "@ordo-pink/binutil"
import { directoryExists0 } from "@ordo-pink/fs"
import { Oath } from "@ordo-pink/oath"

export const exec = (location?: string, command?: string) =>
	Oath.fromNullable(location)
		.map(location => (location.startsWith("./") ? location.slice(2) : location))
		.rejectedMap(() => "Location not provided")
		.chain(location =>
			Oath.fromBoolean(
				() => location.startsWith("lib") || location.startsWith("srv"),
				() => location,
				() =>
					`Provided location "${location}" is invalid. Only "lib/*" or "srv/*" locations are supported.`,
			),
		)
		.chain(location =>
			Oath.fromNullable(command)
				.rejectedMap(() => "Command not provided")
				.chain(command =>
					directoryExists0(location).chain(exists =>
						Oath.fromBoolean(
							() => exists,
							() => ({ location, command }),
							() => `Path "${location}" does not exist`,
						),
					),
				),
		)
		.chain(({ location, command }) =>
			runAsyncCommand0(command, { cwd: location, stdin: "pipe", stdout: "pipe", stderr: "pipe" }),
		)
		.orElse(console.error)
