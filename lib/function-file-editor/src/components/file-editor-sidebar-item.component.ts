import { Maoka, type TMaokaComponent } from "@ordo-pink/maoka"
import { is_false, is_true, noop } from "@ordo-pink/tau"
import { MaokaHooks } from "@ordo-pink/maoka-hooks"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-hooks"
import { R } from "@ordo-pink/result"
import { Switch } from "@ordo-pink/switch"

import { FileEditorSidebarDirectory } from "./file-editor-sidebar-directory.component"
import { FileEditorSidebarFile } from "./file-editor-sidebar-file.component"

export const FileEditorSidebarItem = (
	initial_metadata: Ordo.Metadata.Instance,
	depth = 0,
): TMaokaComponent =>
	Maoka.create("div", ({ use, refresh, on_unmount }) => {
		let metadata = initial_metadata

		const commands = use(MaokaOrdo.Hooks.commands)
		const metadata_query = use(MaokaOrdo.Hooks.metadata_query)

		const subscription = metadata_query.$.subscribe(() => {
			metadata_query
				.get_by_fsid(initial_metadata.get_fsid())
				.pipe(R.ops.chain(R.FromOption))
				.pipe(R.ops.chain(x => R.If(!initial_metadata.equals(x), { T: () => x })))
				.pipe(R.ops.map(x => void (metadata = x)))
				.cata(R.catas.if_ok(() => void refresh()))
		})

		use(
			MaokaHooks.listen("oncontextmenu", event => {
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
