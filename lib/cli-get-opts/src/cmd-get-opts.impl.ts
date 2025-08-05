/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { GetOpts } from "./cmd-get-opts.types"

const is_long_option = (arg: string) => arg.startsWith("--")
const is_short_option = (arg: string) => arg.startsWith("-")

export const get_opts: GetOpts.Fn = args => {
	const delimiter = args.indexOf("--")
	const args_to_parse = delimiter >= 0 ? args.slice(0, delimiter) : args

	const opts: GetOpts.Opts = {
		args: [],
		long_options: {},
		pass_through: delimiter >= 0 ? args.slice(delimiter + 1) : [],
		short_options: {},
	}

	let index = 0

	while (index < args_to_parse.length) {
		if (!args_to_parse[index]) {
			index++
			continue
		}

		if (is_long_option(args_to_parse[index])) {
			const value = args_to_parse[index + 1]

			const value_is_arg = !!value && !is_long_option(value) && !is_short_option(value)

			opts.long_options[args_to_parse[index].slice(2)] = value_is_arg ? value : true
			index++

			if (value_is_arg) index++

			continue
		}

		if (is_short_option(args_to_parse[index])) {
			const value = args_to_parse[index + 1]

			const value_is_arg = !!value && !is_long_option(value) && !is_short_option(value)

			let i = 1

			while (i < args_to_parse[index].length - 1) {
				opts.short_options[args_to_parse[index][i]] = true
				i++
			}

			opts.short_options[args_to_parse[index].at(-1)!] = value_is_arg ? value : true
			index++

			if (value_is_arg) index++

			continue
		}

		opts.args.push(args_to_parse[index])
		index++
	}

	return opts
}
