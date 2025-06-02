/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace GetOpts {
	export type Opts = {
		long_options: Record<string, string | true>
		short_options: Record<string, string | true>
		pass_through: string[]
		args: string[]
	}

	export type Fn = (args: string[]) => GetOpts.Opts
}
