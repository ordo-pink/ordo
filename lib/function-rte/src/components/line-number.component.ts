import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MaokaStyled } from "@ordo-pink/maoka-styled"

export const LineNumber = (block_index: number) =>
	StyledLineNumber(({ use }) => {
		const commands = use(MaokaOrdo.Jabs.get_commands)

		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		const handle_click = (event: MouseEvent) =>
			commands.emit("cmd.application.context_menu.show", { event, payload: { location: "rte", block_index } })

		return () => String(block_index + 1)
	})

// --- Internal ---

const StyledLineNumber = MaokaStyled.Tags.div(
	"text-neutral-500 text-xs p-1 text-right opacity-0 transition-opacity cursor-pointer",
)
