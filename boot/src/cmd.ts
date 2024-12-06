import { type TCommandRecord } from "@ordo-pink/binutil"
import { mklib_command } from "@ordo-pink/cmd-mklib"
import { spdx_command } from "@ordo-pink/cmd-spdx"

const commands: TCommandRecord = {
	hello_world: {
		handler: () => console.log("Hello, world!"),
		help: "Prints Hello, world! to console.",
	},
	...mklib_command,
	...spdx_command,
}

export default commands
