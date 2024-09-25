import { Maoka } from "@ordo-pink/maoka"
import { MetadataIcon } from "@ordo-pink/maoka-components"
import { OrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { type TMetadata } from "@ordo-pink/data"

export const FileEditorSidebarFile = (metadata: TMetadata, depth = 0) =>
	Maoka.create("div", ({ use }) => {
		const fsid = metadata.get_fsid()
		const { emit } = use(OrdoHooks.commands)
		const route_params = use(OrdoHooks.route_params)

		const file_editor_file_class = Maoka.hooks.set_class(
			"flex space-x-2 items-center rounded-sm",
			"hover:bg-gradient-to-r hover:from-neutral-700 hover:to-stone-700",
			"file_editor_file",
		)

		use(file_editor_file_class)
		use(Maoka.hooks.set_style({ paddingLeft: `${depth + 0.5}rem`, paddingRight: "0.5rem" }))
		use(Maoka.hooks.listen("onclick", () => emit("cmd.file_editor.open_file", fsid)))

		return () => {
			if (route_params.value.fsid === fsid)
				use(Maoka.hooks.add_class("bg-gradient-to-tr from-pink-900 to-rose-900"))
			else use(Maoka.hooks.remove_class("bg-gradient-to-tr from-pink-900 to-rose-900"))

			return [MetadataIcon({ metadata }), FileEditorFileName(metadata.get_name())]
		}
	})

const FileEditorFileName = (name: string) =>
	Maoka.create("div", ({ use }) => {
		use(Maoka.hooks.set_class(...file_editor_file_text_classes))
		return () => name
	})

const file_editor_file_text_classes = [
	"text-ellipsis w-full line-clamp-1 cursor-pointer",
	"file_editor_file_text",
]
