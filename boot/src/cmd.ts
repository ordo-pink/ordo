import type { CommandHandler } from "@ordo-pink/cli-handler"
import { build_command } from "@ordo-pink/command-build"
import { init_command } from "@ordo-pink/command-init"
import { mklib_command } from "@ordo-pink/command-mklib"
import { precommit_command } from "@ordo-pink/command-precommit"
import { run_command } from "@ordo-pink/command-run"
import { spdx_command } from "@ordo-pink/command-spdx"

const commands: CommandHandler.Commands = {
	...build_command,
	...init_command,
	...mklib_command,
	...run_command,
	...spdx_command,
	...precommit_command,
}

export default commands
