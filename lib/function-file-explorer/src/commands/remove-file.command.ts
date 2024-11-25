import { ContextMenuItemType, Metadata } from "@ordo-pink/core"
import { BsFileEarmarkMinus } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import { RemoveFileModal } from "../components/remove-file-modal.component"

export const register_remove_file = (ctx: Ordo.CreateFunction.Params) => {
	const commands = ctx.get_commands()

	commands.on("cmd.metadata.show_remove_modal", fsid => {
		const Modal = MaokaOrdo.Components.WithCtx(ctx, () => RemoveFileModal(fsid))

		commands.emit("cmd.application.modal.show", { render: div => Maoka.render_dom(div, Modal) })
	})

	commands.emit("cmd.application.context_menu.add", {
		command: "cmd.metadata.show_remove_modal",
		render_icon: div => div.appendChild(BsFileEarmarkMinus() as SVGSVGElement),
		readable_name: "t.file_explorer.modals.remove_file.title",
		should_show: ({ payload }) => Metadata.Validations.is_metadata(payload),
		payload_creator: ({ payload }) => Metadata.Validations.is_metadata(payload) && payload.get_fsid(),
		type: ContextMenuItemType.DELETE,
	})
}
