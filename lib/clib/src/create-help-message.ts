import type { TCreateHelpMessage } from "./types.ts"

import { iro } from "#lib/iro/mod.ts"

export const createHelpMessage: TCreateHelpMessage = (
	expectations,
	{ noColor, silent }
) => {
	if (silent) {
		return ""
	}

	const c = iro(noColor)

	let message = `${c.bold("USAGE:")}\n\n$ bin/${expectations.name} ${(
		expectations.args ?? []
	)
		.map(arg => {
			if (arg.multiple) {
				return c.bold(
					`${arg.name.toLocaleUpperCase()}1 ${arg.name.toLocaleUpperCase()}2 ... ${arg.name.toLocaleUpperCase()}N`
				)
			} else {
				return c.bold(arg.name.toLocaleUpperCase())
			}
		})
		.join(" ")}`

	message += expectations.description
		? `\n\n${c.bold("DESCRIPTION:")}\n\n${expectations.description}`
		: ""

	if (expectations.options) {
		message += `\n\n${c.bold("OPTIONS:")}`

		for (const option of expectations.options) {
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
