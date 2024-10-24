import { MaokaOrdo, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaHooks } from "@ordo-pink/maoka-hooks"
import { R } from "@ordo-pink/result"

import { FileEditorSidebarItem } from "./components/file-editor-sidebar-item.component"

export const FileEditorSidebar = (ctx: Ordo.CreateFunction.Params) =>
	Maoka.create("div", ({ use, refresh, on_unmount }) => {
		use(ordo_context.provide(ctx))

		let metadata: Ordo.Metadata.Instance[] = []

		// TODO Detect
		use(MaokaHooks.set_class("flex flex-col px-2 h-full", "file_editor_sidebar"))

		const commands = use(MaokaOrdo.Hooks.commands)
		const metadata_query = use(MaokaOrdo.Hooks.metadata_query)

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
			MaokaHooks.listen("oncontextmenu", event => {
				event.preventDefault()
				event.stopPropagation()

				commands.emit("cmd.application.context_menu.show", {
					event: event as any,
					payload: "root",
					hide_delete_items: true,
				})
			}),
		)

		return () => metadata.map(i => FileEditorSidebarItem(i))
	})
