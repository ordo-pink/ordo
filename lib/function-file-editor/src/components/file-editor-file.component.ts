import { BsFileEarmark } from "@ordo-pink/frontend-icons"
import { Maoka } from "@ordo-pink/maoka"
import { OrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { type TMetadata } from "@ordo-pink/data"

export const FileEditorFile = (metadata: TMetadata, depth = 0) =>
	Maoka.create("div", ({ use }) => {
		const fsid = metadata.get_fsid()
		const { emit } = use(OrdoHooks.commands)
		const { fsid: route_fsid } = use(OrdoHooks.route_params)

		const file_editor_file_class = Maoka.hooks.set_class(
			"flex space-x-2 items-center rounded-sm",
			"hover:bg-gradient-to-r hover:from-neutral-700 hover:to-stone-700",
			"file_editor_file",
		)

		use(file_editor_file_class)
		use(Maoka.hooks.set_style({ paddingLeft: `${depth + 0.5}rem`, paddingRight: "0.5rem" }))
		use(Maoka.hooks.listen("onclick", () => emit("cmd.file_editor.open_file", fsid)))

		if (route_fsid === fsid)
			use(Maoka.hooks.add_class("bg-gradient-to-tr from-pink-900 to-rose-900"))

		return [
			Maoka.create("div", () => BsFileEarmark("size-4")),
			Maoka.create("div", ({ use }) => {
				const file_editor_file_text_class = Maoka.hooks.set_class(
					"text-ellipsis w-full line-clamp-1 cursor-pointer",
					"file_editor_file_text",
				)

				use(file_editor_file_text_class)

				return metadata.get_name()
			}),
		]
	})
