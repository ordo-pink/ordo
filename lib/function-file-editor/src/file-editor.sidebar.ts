import { Ordo, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { Maoka } from "@ordo-pink/maoka"
import { R } from "@ordo-pink/result"
import { type TCreateFunctionContext } from "@ordo-pink/core"

import { FileEditorSidebarItem } from "./components/file-editor-sidebar-item.component"
import { TMetadata } from "@ordo-pink/data"

export const FileEditorSidebar = (ctx: TCreateFunctionContext) =>
	Maoka.create("div", ({ use, refresh, on_unmount }) => {
		use(ordo_context.provide(ctx))

		let metadata: TMetadata[] = []

		// TODO Detect
		use(Maoka.hooks.set_class("flex flex-col px-2 h-full", "file_editor_sidebar"))

		const commands = use(Ordo.Hooks.commands)
		const metadata_query = use(Ordo.Hooks.metadata_query)

		const subscription = metadata_query.$.subscribe(() => {
			metadata_query
				.get()
				.pipe(R.ops.map(is => is.filter(i => i.is_root_child())))
				.cata(
					R.catas.if_ok(updated => {
						metadata = updated
						refresh()
					}),
				)
		})

		on_unmount(() => subscription.unsubscribe())

		use(
			Maoka.hooks.listen("oncontextmenu", event => {
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
