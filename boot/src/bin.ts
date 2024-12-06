import { Oath } from "@ordo-pink/oath"

import commands from "./cmd"
import { get_opts } from "@ordo-pink/binutil"

const all_args = process.argv.slice(2)

const opts = get_opts(all_args)

const main = () =>
	Oath.FromNullable(all_args[0])
		.and(command_name => Oath.If(command_name === "--help", { T: show_help }).fix(() => command_name))
		.and(command_name => Oath.FromNullable(commands[command_name]))
		.and(command => Oath.Try(() => command.handler(opts)))
		.fork(educate, () => void 0)

const educate = () => {
	if (!all_args[0]) console.error("ERROR: Invalid usage: command not provided. Type './bin --help' for details.")
	else console.error(`ERROR: Invalid usage: "${all_args[0]}" is not a valid command. Type './bin --help' for details.`)

	process.exit(1)
}

const show_help = () => {
	console.log(
		`Usage: ./bin [command] [options]

Commands:

`.concat(...Object.keys(commands).map(key => `  ${key}                ${commands[key].help}\n`)),
	)

	process.exit(0)
}

void main()
