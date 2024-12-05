import { mklib_command } from "@ordo-pink/cmd-mklib"

const commands: Record<string, TCommand> = {
	hello_world: {
		handler: () => console.log("Hello, world!"),
		help: "Prints Hello, world! to console.",
	},
	...mklib_command,
}

export default commands

type TCommand = {
	handler: (args: string[]) => void
	help: string
}
