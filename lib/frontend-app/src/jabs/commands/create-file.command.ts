import { ContextMenuItemType, Metadata } from "@ordo-pink/core"
import { Maoka, type TMaokaJab } from "@ordo-pink/maoka"
import { BsFileEarmarkPlus } from "@ordo-pink/frontend-icons"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { CreateFileModal } from "../../components/create-file-modal.component"

export const create_file_command: TMaokaJab = ({ on_unmount, use }) => {
	const state = use(MaokaOrdo.Context.consume)

	const handle_show_create_modal: Ordo.Command.HandlerOf<"cmd.metadata.show_create_modal"> = fsid => {
		const Component = MaokaOrdo.Components.WithState(state, () => CreateFileModal(fsid))
		state.commands.emit("cmd.application.modal.show", { render: div => void Maoka.render_dom(div, Component) })
	}

	state.commands.on("cmd.metadata.show_create_modal", handle_show_create_modal)

	state.commands.emit("cmd.application.context_menu.add", {
		command: "cmd.metadata.show_create_modal",
		render_icon: div => div.appendChild(BsFileEarmarkPlus() as SVGSVGElement), // TODO: Move to icons
		readable_name: "t.common.components.modals.create_file.title",
		should_show: ({ payload }) => Metadata.Validations.is_metadata(payload) || payload === "root",
		payload_creator: ({ payload }) => (Metadata.Validations.is_metadata(payload) ? payload.get_fsid() : null),
		type: ContextMenuItemType.CREATE,
	})

	state.commands.emit("cmd.application.command_palette.add", {
		on_select: () => state.commands.emit("cmd.metadata.show_create_modal", null),
		hotkey: "mod+shift+n",
		readable_name: "t.common.components.modals.create_file.title",
		render_icon: div => void div.appendChild(BsFileEarmarkPlus() as SVGSVGElement),
	})

	on_unmount(() => {
		state.commands.off("cmd.metadata.show_create_modal", handle_show_create_modal)
		state.commands.emit("cmd.application.context_menu.remove", "cmd.metadata.show_create_modal")
		state.commands.emit("cmd.application.command_palette.remove", "t.common.components.modals.create_file.title")
	})
}
