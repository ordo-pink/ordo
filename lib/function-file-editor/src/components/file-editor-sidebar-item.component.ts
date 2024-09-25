import { Maoka, type TMaokaCreateComponentImplFn } from "@ordo-pink/maoka"
import { is_false, is_true, noop } from "@ordo-pink/tau"
import { Ordo } from "@ordo-pink/maoka-ordo-hooks"
import { R } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"
import { type TMetadata } from "@ordo-pink/data"

import { FileEditorSidebarDirectory } from "./file-editor-sidebar-directory.component"
import { FileEditorSidebarFile } from "./file-editor-sidebar-file.component"

export const FileEditorSidebarItem = (
	initial_metadata: TMetadata,
	depth = 0,
): TMaokaCreateComponentImplFn =>
	Maoka.create("div", ({ use, refresh, on_unmount }) => {
		let metadata = initial_metadata

		const commands = use(Ordo.Hooks.commands)
		const metadata_query = use(Ordo.Hooks.metadata_query)

		const subscription = metadata_query.$.subscribe(() => {
			metadata_query
				.get_by_fsid(initial_metadata.get_fsid())
				.pipe(R.ops.chain(R.FromOption))
				.pipe(R.ops.chain(x => R.If(!initial_metadata.equals(x), { T: () => x })))
				.pipe(R.ops.map(x => void (metadata = x)))
				.cata(R.catas.if_ok(refresh))
		})

		use(
			Maoka.hooks.listen("oncontextmenu", event => {
				event.preventDefault()
				event.stopPropagation()

				commands.emit("cmd.application.context_menu.show", {
					event: event as any,
					payload: metadata,
				})
			}),
		)

		on_unmount(() => subscription.unsubscribe())

		return () =>
			Switch.Match(metadata_query.has_children(metadata.get_fsid()).unwrap())
				.case(is_true, () => FileEditorSidebarDirectory(metadata, depth))
				.case(is_false, () => FileEditorSidebarFile(metadata, depth))
				.default(noop)
	})
