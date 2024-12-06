import { type TCommandRecord } from "@ordo-pink/binutil"
import { build_command } from "@ordo-pink/cmd-build"
import { init_command } from "@ordo-pink/cmd-init"
import { mklib_command } from "@ordo-pink/cmd-mklib"
import { run_command } from "@ordo-pink/cmd-run"
import { spdx_command } from "@ordo-pink/cmd-spdx"

const commands: TCommandRecord = {
	...build_command,
	...init_command,
	...mklib_command,
	...run_command,
	...spdx_command,
}

export default commands
