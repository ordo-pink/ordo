// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

export const getc = <K extends string>(variables: K[]): { [Key in K]: string } => {
	return variables.reduce((env, variable) => {
		env[variable] = Bun.env[variable] ?? ""
		return env
	}, {} as { [Key in K]: string })
}
