import { ContextMenuItemType, Metadata } from "@ordo-pink/core"
import { Maoka, type TMaokaJab } from "@ordo-pink/maoka"
import { BsFileEarmarkMinus } from "@ordo-pink/frontend-icons"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { RemoveFileModal } from "../../components/remove-file-modal.component"

export const remove_file_command: TMaokaJab = ({ on_unmount, use }) => {
	const state = use(MaokaOrdo.Context.consume)

	const handle_show_remove_modal: Ordo.Command.HandlerOf<"cmd.metadata.show_remove_modal"> = fsid => {
		const Modal = MaokaOrdo.Components.WithState(state, () => RemoveFileModal(fsid))

		state.commands.emit("cmd.application.modal.show", { render: div => Maoka.render_dom(div, Modal) })
	}

	state.commands.on("cmd.metadata.show_remove_modal", handle_show_remove_modal)

	state.commands.emit("cmd.application.context_menu.add", {
		command: "cmd.metadata.show_remove_modal",
		payload_creator: ({ payload }) => Metadata.Validations.is_metadata(payload) && payload.get_fsid(),
		readable_name: "t.common.components.modals.remove_file.title",
		render_icon: div => div.appendChild(BsFileEarmarkMinus() as SVGSVGElement),
		should_show: ({ payload }) => Metadata.Validations.is_metadata(payload),
		type: ContextMenuItemType.DELETE,
	})

	// TODO Command palette item if there is currently selected metadata

	on_unmount(() => {
		state.commands.off("cmd.metadata.show_remove_modal", handle_show_remove_modal)
		state.commands.emit("cmd.application.context_menu.remove", "cmd.metadata.show_remove_modal")
	})
}
