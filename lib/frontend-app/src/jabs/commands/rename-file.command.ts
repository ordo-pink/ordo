import { ContextMenuItemType, Metadata } from "@ordo-pink/core"
import { Maoka, type TMaokaJab } from "@ordo-pink/maoka"
import { BsFileEarmarkRichText } from "@ordo-pink/frontend-icons"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { RenameFileModal } from "../../components/rename-file-modal.component"

export const rename_file_command: TMaokaJab = ({ on_unmount, use }) => {
	const state = use(MaokaOrdo.Context.consume)

	const handle_show_rename_modal: Ordo.Command.HandlerOf<"cmd.metadata.show_rename_modal"> = fsid => {
		const Component = MaokaOrdo.Components.WithState(state, () => RenameFileModal(fsid))
		state.commands.emit("cmd.application.modal.show", { render: div => void Maoka.render_dom(div, Component) })
	}

	state.commands.on("cmd.metadata.show_rename_modal", handle_show_rename_modal)

	state.commands.emit("cmd.application.context_menu.add", {
		command: "cmd.metadata.show_rename_modal",
		render_icon: div => div.appendChild(BsFileEarmarkRichText() as SVGSVGElement),
		readable_name: "t.common.components.modals.rename_file.title",
		should_show: ({ payload }) => Metadata.Validations.is_metadata(payload),
		payload_creator: ({ payload }) => Metadata.Validations.is_metadata(payload) && payload.get_fsid(),
		type: ContextMenuItemType.UPDATE,
	})

	// TODO Command palette item if there is currently selected metadata

	on_unmount(() => {
		state.commands.off("cmd.metadata.show_rename_modal", handle_show_rename_modal)
		state.commands.emit("cmd.application.context_menu.hide", "cmd.metadata.show_rename_modal")
	})
}
