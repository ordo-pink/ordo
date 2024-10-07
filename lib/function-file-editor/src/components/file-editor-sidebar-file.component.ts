import { equals } from "ramda"

import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { MetadataIcon } from "@ordo-pink/maoka-components"
import { R } from "@ordo-pink/result"
import { TOption } from "@ordo-pink/option"

export const FileEditorSidebarFile = (metadata: Ordo.Metadata.Instance, depth = 0) =>
	Maoka.create("div", ({ use, refresh }) => {
		const fsid = metadata.get_fsid()
		const { emit } = use(MaokaOrdo.Jabs.Commands)

		const file_editor_file_class = MaokaJabs.set_class(
			"flex space-x-2 items-center rounded-sm",
			"hover:bg-gradient-to-r hover:from-neutral-700 hover:to-stone-700",
			"file_editor_file",
		)

		let route: Ordo.Router.Route | null = null
		const $ = use(MaokaOrdo.Jabs.CurrentRoute$)
		const handle_current_route_change = (value: TOption<Ordo.Router.Route>) =>
			R.FromOption(value, () => null)
				.pipe(R.ops.chain(r => R.If(r.path !== route?.path, { T: () => r, F: () => r })))
				.pipe(R.ops.chain(r => R.If(!equals(r, route), { T: () => r, F: () => r })))
				.cata({
					Ok: async updated_route => {
						route = updated_route
						await refresh()
					},
					Err: async null_or_same_route => {
						// Skip since routes are equal
						if (null_or_same_route || !route) return

						route = null_or_same_route
						await refresh()
					},
				})

		use(MaokaOrdo.Jabs.subscribe($, handle_current_route_change))

		use(file_editor_file_class)
		use(MaokaJabs.set_style({ paddingLeft: `${depth + 0.5}rem`, paddingRight: "0.5rem" }))
		use(MaokaJabs.listen("onclick", () => emit("cmd.file_editor.open_file", fsid)))

		return () => {
			if (route?.params?.fsid === fsid)
				use(MaokaJabs.add_class("bg-gradient-to-tr from-pink-900 to-rose-900"))
			else use(MaokaJabs.remove_class("bg-gradient-to-tr", "from-pink-900", "to-rose-900"))

			return [MetadataIcon({ metadata }), FileEditorFileName(metadata.get_name())]
		}
	})

const FileEditorFileName = (name: string) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class(...file_editor_file_text_classes))
		return () => name
	})

const file_editor_file_text_classes = [
	"text-ellipsis w-full line-clamp-1 cursor-pointer",
	"file_editor_file_text",
]
