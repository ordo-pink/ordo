import { type TMaokaCreateComponentImplFn, create } from "@ordo-pink/maoka"
import { is_false, is_true, noop } from "@ordo-pink/tau"
import { Switch } from "@ordo-pink/switch"
import { type TMetadata } from "@ordo-pink/data"
import { get_metadata_query } from "@ordo-pink/maoka-ordo-hooks"

import { FileEditorDirectory } from "./file-editor-directory.component"
import { FileEditorFile } from "./file-editor-file.component"

export const FileEditorSidebarItem = (
	metadata: TMetadata,
	depth = 0,
): TMaokaCreateComponentImplFn =>
	create("div", ({ use }) => {
		const metadata_query = use(get_metadata_query)
		const children = metadata_query.has_children(metadata.get_fsid())

		return Switch.of(children.unwrap())
			.case(is_true, () => FileEditorDirectory(metadata, depth))
			.case(is_false, () => FileEditorFile(metadata, depth))
			.default(noop)
	})
