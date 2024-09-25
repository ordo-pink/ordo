import { BsCaretDown, BsCaretRight } from "@ordo-pink/frontend-icons"
import { FSID, Metadata, TMetadata } from "@ordo-pink/data"
import { Maoka, type TMaokaHook } from "@ordo-pink/maoka"
import { MetadataIcon } from "@ordo-pink/maoka-components"
import { OrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { R } from "@ordo-pink/result"

import { FileEditorSidebarItem } from "./file-editor-sidebar-item.component"

const expanded_state = {} as Record<FSID, boolean>

export const FileEditorSidebarDirectory = (metadata: TMetadata, depth = 0) =>
	Maoka.create("div", ({ use, refresh }) => {
		const fsid = metadata.get_fsid()

		const route_params = use(OrdoHooks.route_params)
		const metadata_query = use(OrdoHooks.metadata_query)

		const on_caret_click = (event: MouseEvent) => {
			event.stopPropagation()
			expanded_state[fsid] = !expanded_state[fsid]
			refresh()
		}

		return () => {
			// Expand directory if it is an ancestor of the metadata that is identified by the fsid
			// provided in route params (opened in the FileEditor workspace). It should also cover
			// cases when user navigates to another file with a link.
			// TODO check if it actually expands directories when navigating via a link.
			R.FromNullable(route_params.value.fsid)
				.pipe(R.ops.chain(i => R.If(Metadata.Validations.is_fsid(i), { T: () => i as FSID })))
				.pipe(R.ops.chain(fsid => metadata_query.get_ancestors(fsid)))
				.cata(R.catas.if_ok(as => as.forEach(a => void (expanded_state[a.get_fsid()] = true))))

			return metadata_query
				.get_children(fsid)
				.cata(
					R.catas.if_ok(is => [
						FileEditorDirectoryName(metadata, depth, on_caret_click),
						FileEditorDirectoryChildren(metadata, is, depth),
					]),
				)
		}
	})

// --- Internal ---

const FileEditorDirectoryChildren = (metadata: TMetadata, children: TMetadata[], depth: number) =>
	R.If(expanded_state[metadata.get_fsid()])
		.pipe(R.ops.map(() => depth + 1))
		.pipe(R.ops.map(depth => () => children.map(i => FileEditorSidebarItem(i, depth))))
		.cata(R.catas.if_ok(children => Maoka.create("div", () => children)))

const FileEditorDirectoryName = (
	metadata: TMetadata,
	depth: number,
	on_caret_click: (event: MouseEvent) => void,
) =>
	Maoka.create("div", ({ use }) => {
		const fsid = metadata.get_fsid()

		const route_params = use(OrdoHooks.route_params)
		const commands = use(OrdoHooks.commands)

		use(Maoka.hooks.listen("onclick", () => commands.emit("cmd.file_editor.open_file", fsid)))
		use(Maoka.hooks.set_style({ paddingLeft: `${depth + 0.5}rem`, paddingRight: "0.5rem" }))
		use(Maoka.hooks.set_class(...file_editor_sidebar_directory_name_classes))

		return () => {
			if (route_params.value.fsid === fsid)
				use(Maoka.hooks.add_class(file_editor_sidebar_directory_name_active_class))
			else use(Maoka.hooks.remove_class(file_editor_sidebar_directory_name_active_class))

			return [
				FileEditorDirectoryNameText(metadata),
				FileEditorDirectoryNameCaret(fsid, Maoka.hooks.listen("onclick", on_caret_click)),
			]
		}
	})

const file_editor_sidebar_directory_name_active_class =
	"bg-gradient-to-tr from-pink-900 to-rose-900"

const file_editor_sidebar_directory_name_classes = [
	"flex justify-between items-center w-full rounded-sm",
	"hover:bg-gradient-to-r hover:from-neutral-700 hover:to-stone-700",
	"file_editor_sidebar_directory_name",
]

const file_editor_sidebar_directory_name_text_classes = [
	"flex space-x-2 items-center cursor-pointer",
	"file_editor_sidebar_directory_name_text",
]

const FileEditorDirectoryNameText = (metadata: TMetadata) =>
	Maoka.create("div", ({ use }) => {
		use(Maoka.hooks.set_class(...file_editor_sidebar_directory_name_text_classes))

		return () => [
			Maoka.create("div", () => () => MetadataIcon({ metadata })),
			Maoka.create("div", ({ use }) => {
				use(Maoka.hooks.set_class("text-ellipsis line-clamp-1"))
				return () => metadata.get_name()
			}),
		]
	})

const FileEditorDirectoryNameCaret = (fsid: FSID, click_listener: TMaokaHook) =>
	Maoka.create("div", ({ use }) => {
		use(click_listener)
		use(Maoka.hooks.set_class("cursor-pointer"))

		return () =>
			expanded_state[fsid]
				? BsCaretDown("p-1 shrink-0 size-5")
				: BsCaretRight("p-1 shrink-0 size-5 rotate-180")
	})
