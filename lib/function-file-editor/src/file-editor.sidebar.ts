import { Ordo, ordo_context } from "@ordo-pink/maoka-ordo-hooks"
import { Maoka } from "@ordo-pink/maoka"
import { R } from "@ordo-pink/result"
import { type TCreateFunctionContext } from "@ordo-pink/core"

import { FileEditorSidebarItem } from "./components/file-editor-sidebar-item.component"

export const FileEditorSidebar = (ctx: TCreateFunctionContext) =>
	Maoka.create("div", ({ use }) => {
		use(ordo_context.provide(ctx))
		use(Maoka.hooks.set_class("flex flex-col px-2", "file_editor_sidebar"))

		const metadata_query = use(Ordo.Hooks.metadata_query)

		return () =>
			metadata_query
				.get()
				.pipe(R.ops.map(is => is.filter(i => i.is_root_child())))
				.cata(R.catas.if_ok(is => is.map(i => FileEditorSidebarItem(i))))
	})
