import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { R } from "@ordo-pink/result"

import { FileEditorSidebarItem } from "./components/file-editor-sidebar-item.component"

export const FileEditorSidebar = (ctx: Ordo.CreateFunction.Params) =>
	Maoka.create("div", ({ use, refresh, on_unmount }) => {
		use(MaokaOrdo.Context.provide(ctx))

		let metadata: Ordo.Metadata.Instance[] = []

		// TODO Detect
		use(MaokaJabs.set_class("flex flex-col px-2 h-full", "file_editor_sidebar"))

		const commands = use(MaokaOrdo.Jabs.Commands)
		const metadata_query = use(MaokaOrdo.Jabs.MetadataQuery)

		const subscription = metadata_query.$.subscribe(() => {
			metadata_query
				.get()
				.pipe(R.ops.map(is => is.filter(i => i.is_root_child())))
				.cata(
					R.catas.if_ok(updated => {
						metadata = updated
						void refresh()
					}),
				)
		})

		on_unmount(() => subscription.unsubscribe())

		use(
			MaokaJabs.listen("oncontextmenu", event => {
				event.preventDefault()
				event.stopPropagation()

				const payload = { event, payload: "root", hide_delete_items: true }

				commands.emit("cmd.application.context_menu.show", payload)
			}),
		)

		return () => metadata.map(i => FileEditorSidebarItem(i))
	})
