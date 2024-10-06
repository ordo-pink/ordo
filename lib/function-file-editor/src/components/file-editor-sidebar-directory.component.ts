import { BsCaretDown, BsCaretRight } from "@ordo-pink/frontend-icons"
import { Maoka, type TMaokaJab } from "@ordo-pink/maoka"
import { MaokaHooks } from "@ordo-pink/maoka-hooks"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-hooks"
import { Metadata } from "@ordo-pink/core"
import { MetadataIcon } from "@ordo-pink/maoka-components"
import { R } from "@ordo-pink/result"
import { type TOption } from "@ordo-pink/option"

import { FileEditorSidebarItem } from "./file-editor-sidebar-item.component"
import { equals } from "ramda"

const expanded_state = {} as Record<Ordo.Metadata.FSID, boolean>

export const FileEditorSidebarDirectory = (metadata: Ordo.Metadata.Instance, depth = 0) =>
	Maoka.create("div", ({ use, refresh }) => {
		const fsid = metadata.get_fsid()

		const metadata_query = use(MaokaOrdo.Hooks.metadata_query)

		let route: Ordo.Router.Route | null = null
		const $ = use(MaokaOrdo.Hooks.current_route)
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

		use(MaokaOrdo.Hooks.subscription($, handle_current_route_change))

		const on_caret_click = (event: MouseEvent) => {
			event.stopPropagation()
			expanded_state[fsid] = !expanded_state[fsid]
			void refresh()
		}

		return () => {
			// Expand directory if it is an ancestor of the metadata that is identified by the fsid
			// provided in route params (opened in the FileEditor workspace). It should also cover
			// cases when user navigates to another file with a link.
			// TODO check if it actually expands directories when navigating via a link.
			R.FromNullable(route)
				.pipe(R.ops.chain(MaokaOrdo.Ops.get_route_params))
				.pipe(
					R.ops.chain(({ fsid }) =>
						R.If(Metadata.Validations.is_fsid(fsid), { T: () => fsid as Ordo.Metadata.FSID }),
					),
				)
				.pipe(R.ops.chain(fsid => metadata_query.get_ancestors(fsid)))
				.cata(R.catas.if_ok(as => as.forEach(a => void (expanded_state[a.get_fsid()] = true))))

			return metadata_query
				.get_children(fsid)
				.pipe(
					R.ops.map(is =>
						is.sort((a, b) => {
							const a_dir = metadata_query
								.has_children(a.get_fsid())
								.cata(R.catas.or_else(() => false))

							const b_dir = metadata_query
								.has_children(b.get_fsid())
								.cata(R.catas.or_else(() => false))

							if (a_dir && !b_dir) return -1
							if (b_dir && !a_dir) return 1

							return a.get_name().localeCompare(b.get_name())
						}),
					),
				)
				.cata(
					R.catas.if_ok(is => [
						FileEditorDirectoryName(metadata, depth, on_caret_click),
						FileEditorDirectoryChildren(metadata, is, depth),
					]),
				)
		}
	})

// --- Internal ---

const FileEditorDirectoryChildren = (
	metadata: Ordo.Metadata.Instance,
	children: Ordo.Metadata.Instance[],
	depth: number,
) =>
	R.If(expanded_state[metadata.get_fsid()])
		.pipe(R.ops.map(() => depth + 1))
		.pipe(R.ops.map(depth => () => children.map(i => FileEditorSidebarItem(i, depth))))
		.cata(R.catas.if_ok(children => Maoka.create("div", () => children)))

const FileEditorDirectoryName = (
	metadata: Ordo.Metadata.Instance,
	depth: number,
	on_caret_click: (event: MouseEvent) => void,
) =>
	Maoka.create("div", ({ use, refresh }) => {
		const fsid = metadata.get_fsid()

		let route: Ordo.Router.Route | null = null
		const $ = use(MaokaOrdo.Hooks.current_route)
		const handle_current_route_change = (value: TOption<Ordo.Router.Route>) =>
			R.FromOption(value, () => null)
				.pipe(R.ops.chain(r => R.If(r.path !== route?.path, { T: () => r, F: () => r })))
				.pipe(R.ops.chain(r => R.If(!equals(r, route), { T: () => r, F: () => r })))
				.cata({
					Ok: updated_route => {
						route = updated_route
						void refresh()
					},
					Err: null_or_same_route => {
						// Skip since routes are equal
						if (null_or_same_route || !route) return

						route = null_or_same_route
						void refresh()
					},
				})

		use(MaokaOrdo.Hooks.subscription($, handle_current_route_change))

		const commands = use(MaokaOrdo.Hooks.commands)

		use(MaokaHooks.listen("onclick", () => commands.emit("cmd.file_editor.open_file", fsid)))
		use(MaokaHooks.set_style({ paddingLeft: `${depth + 0.5}rem`, paddingRight: "0.5rem" }))
		use(MaokaHooks.set_class(...file_editor_sidebar_directory_name_classes))

		return () => {
			if (route?.params?.fsid === fsid) use(MaokaHooks.add_class(directory_active))
			else use(MaokaHooks.remove_class(...directory_active.split(" ")))

			return [
				FileEditorDirectoryNameText(metadata),
				FileEditorDirectoryNameCaret(fsid, MaokaHooks.listen("onclick", on_caret_click)),
			]
		}
	})

const directory_active = "bg-gradient-to-tr from-pink-900 to-rose-900"

const file_editor_sidebar_directory_name_classes = [
	"flex justify-between items-center w-full rounded-sm",
	"hover:bg-gradient-to-r hover:from-neutral-700 hover:to-stone-700",
	"file_editor_sidebar_directory_name",
]

const file_editor_sidebar_directory_name_text_classes = [
	"flex space-x-2 items-center cursor-pointer",
	"file_editor_sidebar_directory_name_text",
]

const FileEditorDirectoryNameText = (metadata: Ordo.Metadata.Instance) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaHooks.set_class(...file_editor_sidebar_directory_name_text_classes))

		return () => [
			Maoka.create("div", () => () => MetadataIcon({ metadata })),
			Maoka.create("div", ({ use }) => {
				use(MaokaHooks.set_class("text-ellipsis line-clamp-1"))
				return () => metadata.get_name()
			}),
		]
	})

const FileEditorDirectoryNameCaret = (fsid: Ordo.Metadata.FSID, click_listener: TMaokaJab) =>
	Maoka.create("div", ({ use }) => {
		use(click_listener)
		use(MaokaHooks.set_class("cursor-pointer"))

		return () =>
			expanded_state[fsid]
				? BsCaretDown("p-1 shrink-0 size-5")
				: BsCaretRight("p-1 shrink-0 size-5 rotate-180")
	})
