import { type TMaokaChildren, create, listen, set_class, set_inner_html } from "@ordo-pink/maoka"
import { get_commands, get_translations, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { BS_FILE_EARMARK_X } from "@ordo-pink/frontend-icons"
import { type FSID } from "@ordo-pink/data"
import { type TCreateFunctionContext } from "@ordo-pink/core"

export const RemoveFileModal = (ctx: TCreateFunctionContext, fsid: FSID) =>
	create("div", ({ use }) => {
		use(ordo_context.provide(ctx))
		use(set_class("p-4 w-96 flex flex-col gap-y-2"))

		const translate = use(get_translations)
		const commands = use(get_commands)

		const t_title = translate("t.file_explorer.modals.remove_file.title")
		const t_message = translate("t.file_explorer.modals.remove_file.message")

		return [
			Header([TitleIcon, Title(t_title)]),
			Body(t_message),
			Footer([
				CancelBtn,
				OkBtn(() => {
					commands.emit("cmd.data.metadata.remove", fsid)
					commands.emit("cmd.application.modal.hide")
				}),
			]),
		]
	})

const Header = (children: TMaokaChildren) =>
	create("div", ({ use }) => {
		use(set_class("flex gap-x-2 items-center"))
		return children
	})

const TitleIcon = create("div", ({ use }) => use(set_inner_html(BS_FILE_EARMARK_X)))

const Title = (children: TMaokaChildren) =>
	create("h2", ({ use }) => {
		use(set_class("text-lg"))
		return children
	})

const Body = (children: TMaokaChildren) => create("div", () => children)

const Footer = (children: TMaokaChildren) =>
	create("div", ({ use }) => {
		use(set_class("flex justify-end items-center gap-x-2"))

		return children
	})

const OkBtn = (on_click: (event: MouseEvent) => void) =>
	create("button", ({ use }) => {
		use(set_class("border rounded-md px-4 py-1 text-sm"))
		use(listen("onclick", on_click))

		return "OK"
	})

const CancelBtn = create("button", ({ use }) => {
	const commands = use(get_commands)

	use(set_class("px-4 py-1 text-sm"))
	use(listen("onclick", () => commands.emit("cmd.application.modal.hide")))

	return "Cancel"
})
