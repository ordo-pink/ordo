import "@ordo-pink/oss-oath/global"
import { get_opts } from "@ordo-pink/cli-get-opts"

import commands from "./cmd"

const all_args = process.argv.slice(2)

const opts = get_opts(all_args)

const main = () =>
	oath
		.from_nullable(all_args[0])
		.pipe(
			oath.ops.chain(command_name =>
				oath.if_else(command_name === "--help", { t: show_help }).pipe(oath.ops.fix(() => command_name)),
			),
		)
		.pipe(oath.ops.chain(command_name => oath.from_nullable(commands[command_name])))
		.pipe(oath.ops.chain(command => oath.try_catch(() => command.handler(opts))))
		.cata({ reject: educate, resolve: () => void 0 })

const educate = () => {
	if (!all_args[0]) console.error("ERROR: Invalid usage: command not provided. Type 'bin/dog --help' for details.")
	else console.error(`ERROR: Invalid usage: "${all_args[0]}" is not a valid command. Type 'bin/dog --help' for details.`)

	process.exit(1)
}

const show_help = () => {
	const longest_name_length = Math.max(...Object.keys(commands).map(cmd => cmd.length))
	const padding = 5

	console.log(
		`Usage: bin/dog [command] [options]

Commands:

`.concat(
			...Object.keys(commands).map(
				key => `  ${key}${" ".repeat(longest_name_length - key.length + padding)}${commands[key].help}\n`,
			),
		),
	)

	process.exit(0)
}

void main()
