import type { TCreateHelpMessage } from "./types.ts"

import { iro } from "#lib/iro/mod.ts"
import { CLIOption } from "../mod.ts"

export const createHelpMessage: TCreateHelpMessage = (
	expectations,
	{ noColor, silent }
) => {
	if (silent) {
		return ""
	}

	const c = iro(noColor)

	const options = [
		...(expectations.options ?? []),
		{
			long: "--color",
			description:
				"The color option specifies under which conditions colorized terminal output should be generated.",
			values: {
				yes: "The output will be colorized.",
				no: "The output will not be colorized.",
			},
		},
		{
			long: "--silent",
			description:
				"The silent option specifies whether terminal output should be generated.",
		},

		{
			long: "--dry-run",
			description:
				"The dry-run option specifies whether file output should be generated.",
		},
	] as CLIOption[]

	let message = `${c.bold("USAGE:")}\n\n$ ${expectations.name} ${(
		expectations.args ?? []
	)
		.map(arg => c.inverse(arg.name.toLocaleUpperCase()))
		.join(" ")}`

	message += expectations.description
		? `\n\n${c.bold("DESCRIPTION:")}\n\n${expectations.description}`
		: ""

	if (options) {
		message += `\n\n${c.bold("OPTIONS:")}`

		for (const option of options) {
			message += `\n${c.blue(option.long)}`

			const values = Object.keys(option.values ?? {}).join("|") ?? "VALUE"

			// TODO: Default value

			if (option.inputRequired) {
				message += values ? `=${values}` : ""
			} else {
				message += values ? c.disabled(`[=${values}]`) : ""
			}

			// TODO: Add describing short options

			message += `. ${option.description}`

			if (option.values) {
				for (const key of Object.keys(option.values)) {
					message += `\n    ${c.green(key)} - ${option.values[key]}`
				}
			}
		}
	}

	return message
}
