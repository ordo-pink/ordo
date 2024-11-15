import { LabelColor } from "@ordo-pink/core"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { is_string } from "@ordo-pink/tau"

import "./label.css"

export const Label = (label: Ordo.Metadata.Label, emit: Ordo.Command.EmitFn) =>
	Maoka.create("div", ({ use }) => {
		if (!label) return

		const readable_name = is_string(label) ? label : label.name
		const color = is_string(label) ? LabelColor.DEFAULT : label.color

		use(MaokaJabs.set_class(`label ${color_class[color]}`))
		use(MaokaJabs.listen("onclick", event => handle_click(event)))

		const handle_click = (event: MouseEvent) => {
			event.stopPropagation()

			emit("cmd.metadata.show_edit_label_modal", label)
		}

		return () => readable_name
	})

// --- Internal ---

const color_class = [
	"default",
	"red",
	"orange",
	"amber",
	"yellow",
	"lime",
	"green",
	"emerald",
	"teal",
	"cyan",
	"sky",
	"blue",
	"indigo",
	"violet",
	"purple",
	"fuchsia",
	"pink",
	"rose",
	"", // <- equivalent to LabelColor enum length
] as const
