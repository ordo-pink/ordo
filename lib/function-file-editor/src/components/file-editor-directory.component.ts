import { BsCaretDown, BsCaretRight, BsFolderOpen } from "@ordo-pink/frontend-icons"
import { FSID, Metadata, TMetadata } from "@ordo-pink/data"
import { Maoka, type TMaokaHook } from "@ordo-pink/maoka"
import { OrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { R } from "@ordo-pink/result"

import { FileEditorSidebarItem } from "./file-editor-sidebar-item.component"

const expanded_state = {} as Record<FSID, boolean>

// TODO: Create common component for file and directory
export const FileEditorDirectory = (metadata: TMetadata, depth = 0) =>
	Maoka.create("div", ({ use, on_mount, refresh }) => {
		const fsid = metadata.get_fsid()
		const { fsid: route_fsid } = use(OrdoHooks.route_params<"fsid">)
		const metadata_query = use(OrdoHooks.metadata_query)

		const on_caret_click = (event: MouseEvent) => {
			event.stopPropagation()
			expanded_state[fsid] = !expanded_state[fsid]
			refresh()
		}

		on_mount(() => {
			R.FromNullable(route_fsid)
				.pipe(R.ops.chain(i => R.If(Metadata.Validations.is_fsid(i), { T: () => i as FSID })))
				.pipe(R.ops.chain(fsid => metadata_query.get_ancestors(fsid)))
				.pipe(R.ops.map(as => as.forEach(a => void (expanded_state[a.get_fsid()] = true))))
		})

		return metadata_query
			.get_children(fsid)
			.cata(
				R.catas.if_ok(is => [
					FileEditorDirectoryName(metadata, depth, on_caret_click),
					FileEditorDirectoryChildren(metadata, is, depth),
				]),
			)
	})

// --- Internal ---

const FileEditorDirectoryChildren = (metadata: TMetadata, children: TMetadata[], depth: number) =>
	expanded_state[metadata.get_fsid()]
		? Maoka.create("div", () => children.map(child => FileEditorSidebarItem(child, depth + 1)))
		: void 0

const FileEditorDirectoryName = (
	metadata: TMetadata,
	depth: number,
	on_caret_click: (event: MouseEvent) => void,
) =>
	Maoka.create("div", ({ use }) => {
		const fsid = metadata.get_fsid()
		const { emit } = use(OrdoHooks.commands)
		const { fsid: route_fsid } = use(OrdoHooks.route_params<"fsid">)

		const file_editor_directory_name_class = Maoka.hooks.set_class(
			"flex justify-between items-center w-full rounded-sm",
			"text-ellipsis line-clamp-1",
			"hover:bg-gradient-to-r hover:from-neutral-700 hover:to-stone-700",
			"file_editor_directory_name",
		)

		use(Maoka.hooks.listen("onclick", () => emit("cmd.file_editor.open_file", fsid)))
		use(Maoka.hooks.set_style({ paddingLeft: `${depth + 0.5}rem`, paddingRight: "0.5rem" }))
		use(file_editor_directory_name_class)

		if (route_fsid === fsid)
			use(Maoka.hooks.add_class("bg-gradient-to-tr from-pink-900 to-rose-900"))

		return [
			FileEditorDirectoryNameText(metadata),
			FileEditorDirectoryNameCaret(fsid, Maoka.hooks.listen("onclick", on_caret_click)),
		]
	})

const FileEditorDirectoryNameText = (metadata: TMetadata) =>
	Maoka.create("div", ({ use }) => {
		const file_editor_directory_name_text_class = Maoka.hooks.set_class(
			"flex space-x-2 items-center cursor-pointer",
			"file_editor_directory_name_text",
		)

		use(file_editor_directory_name_text_class)

		return [
			Maoka.create("div", () => BsFolderOpen("size-4")),
			Maoka.create("div", () => metadata.get_name()),
		]
	})

const FileEditorDirectoryNameCaret = (fsid: FSID, click_listener: TMaokaHook) =>
	Maoka.create("div", ({ use }) => {
		use(click_listener)
		use(Maoka.hooks.set_class("cursor-pointer"))

		return expanded_state[fsid]
			? BsCaretDown("p-1 shrink-0 size-5")
			: BsCaretRight("p-1 shrink-0 size-5 rotate-180")
	})
