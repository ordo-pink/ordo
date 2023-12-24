// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { keysOf } from "@ordo-pink/tau"

export const getc = <K extends string>(variables?: K[]): { [Key in K]: string } => {
	if (!variables) {
		return keysOf(Bun.env as Record<string, string>).reduce(
			(acc, key) => (key.startsWith("ORDO_") ? { ...acc, [key]: Bun.env[key] } : acc),
			{} as { [Key in K]: string },
		)
	}
	return variables.reduce((env, variable) => {
		env[variable] = Bun.env[variable] ?? ""
		return env
	}, {} as { [Key in K]: string })
}
