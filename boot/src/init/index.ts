import { Command } from "commander"
import { init } from "./src"

const program = new Command()

program
	.name("init")
	.version("0.2.0")
	.description("Initialize repository with the stuff needed before you run it for the first time.")
	.action(init)

program.parse()
