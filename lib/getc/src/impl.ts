// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import "#std/dotenv/load.ts"

// TODO: Merge all dotenvs in the repo into environment
export const getc = <K extends string>(variables: K[]): { [Key in K]: string } => {
	return variables.reduce((env, variable) => {
		env[variable] = Deno.env.get(variable) ?? ""
		return env
	}, {} as { [Key in K]: string })
}
