import type { CommandHandler } from "@ordo-pink/cmd-handler"
import { build_command } from "@ordo-pink/command-build"
import { init_command } from "@ordo-pink/command-init"
import { mklib_command } from "@ordo-pink/command-mklib"
import { run_command } from "@ordo-pink/command-run"
import { spdx_command } from "@ordo-pink/command-spdx"

const commands: CommandHandler.Commands = {
	...build_command,
	...init_command,
	...mklib_command,
	...run_command,
	...spdx_command,
}

export default commands
