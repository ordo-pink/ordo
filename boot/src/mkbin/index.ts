import { Command } from "commander"
import { mkbin } from "./src/impl"

const program = new Command()

program
	.name("mkbin")
	.version("0.2.0")
	.description(
		"The 'mkbin' command creates a new directory inside 'boot/src' with the conventional " +
			"file structure to start a new 'bin'. Bins are the executable CLI tools that provide " +
			"improved developer experience within the repository without hiding the complexity " +
			"of what is actually happening under the hood.",
	)
	.argument("name", "name of the bin to be created")
	.option("-u, --unlicense", "use The Unlicense instead of GNU AGPL 3.")
	.action(async (name, options) => {
		const license = options.unlicense ? "Unlicense" : "AGPL-3.0-only"

		await mkbin(name, license)
	})

program.parse()
