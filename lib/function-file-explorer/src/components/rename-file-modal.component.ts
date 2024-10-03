import {
	Maoka,
	type TMaokaChildren,
	create,
	listen,
	set_attribute,
	set_class,
	set_inner_html,
} from "@ordo-pink/maoka"
import { get_commands, get_translations, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { BS_FILE_EARMARK_RICHTEXT } from "@ordo-pink/frontend-icons"

export const RenameFileModal = (ctx: TCreateFunctionContext, fsid: FSID) =>
	Maoka.pure("div", {})(() => "A")
// 	create("div", ({ use }) => {
// 		use(ordo_context.provide(ctx))
// 		use(set_class("p-4 w-96 flex flex-col gap-y-2"))

// 		const translate = use(get_translations)
// 		const commands = use(get_commands)
// 		const metadata = use(get_metadata_by_fsid(fsid))

// 		const t_title = translate("t.file_explorer.modals.rename_file.title")

// 		const state = { name: metadata?.get_name() ?? "" }

// 		return [
// 			Header([TitleIcon, Title(t_title)]),
// 			Body([
// 				CreateFileModalInput(state.name, event => void (state.name = (event.target as any).value)),
// 			]),
// 			Footer([
// 				CancelBtn,
// 				OkBtn(() => {
// 					commands.emit("cmd.data.metadata.rename", { fsid, new_name: state.name })
// 					commands.emit("cmd.application.modal.hide")
// 				}),
// 			]),
// 		]
// 	})

// const Header = (children: TMaokaChildren) =>
// 	create("div", ({ use }) => {
// 		use(set_class("flex gap-x-2 items-center"))
// 		return children
// 	})

// const TitleIcon = create("div", ({ use }) => use(set_inner_html(BS_FILE_EARMARK_RICHTEXT)))

// const Title = (children: TMaokaChildren) =>
// 	create("h2", ({ use }) => {
// 		use(set_class("text-lg"))
// 		return children
// 	})

// const Body = (children: TMaokaChildren) => create("div", () => children)

// const CreateFileModalInput = (initial_value: string, on_change: (event: Event) => void) =>
// 	create("label", () => {
// 		return [
// 			create("div", ({ use }) => {
// 				use(set_class("font-bold text-sm"))
// 				const translate = use(get_translations)
// 				const t_label_text = translate("t.file_explorer.modals.rename_file.input_label")

// 				return t_label_text
// 			}),

// 			create("input", ({ use }) => {
// 				use(listen("oninput", on_change))
// 				use(set_attribute("value", initial_value))
// 				use(
// 					set_class(
// 						"w-full rounded-md border-0 px-2 py-1 shadow-inner focus:ring-0 sm:text-sm sm:leading-6",
// 						"bg-neutral-50 dark:bg-neutral-600 placeholder:text-neutral-500",
// 					),
// 				)
// 			}),
// 		]
// 	})

// const Footer = (children: TMaokaChildren) =>
// 	create("div", ({ use }) => {
// 		use(set_class("flex justify-end items-center gap-x-2"))

// 		return children
// 	})

// const OkBtn = (on_click: (event: MouseEvent) => void) =>
// 	create("button", ({ use }) => {
// 		use(set_class("border rounded-md px-4 py-1 text-sm"))
// 		use(listen("onclick", on_click))

// 		return "OK"
// 	})

// const CancelBtn = create("button", ({ use }) => {
// 	const commands = use(get_commands)

// 	use(set_class("px-4 py-1 text-sm"))
// 	use(listen("onclick", () => commands.emit("cmd.application.modal.hide")))

// 	return "Cancel"
// })
