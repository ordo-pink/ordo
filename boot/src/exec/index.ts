import { Command } from "commander"
import { exec } from "./src/impl"

const program = new Command()

program
	.name("exec")
	.version("0.1.0")
	.description("Execute given command for given lib or srv.")
	.argument("location", "place to execute command in")
	.argument("<command...>", "command to execute")
	.action((location, command) => exec(location, command.join(" ")))

program.parse()
