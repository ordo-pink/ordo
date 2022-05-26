import { Either } from "or-else";

import { OrdoEventHandler } from "@core/types";
import { updateFolder } from "@modules/file-explorer/api/update-folder";
import { findOrdoFolderByPath } from "@modules/file-explorer/utils/find-ordo-folder";
import { FoldVoid } from "@utils/either";
import { tap } from "@utils/functions";

/**
 * Collapses or expands the folder.
 */
export const handleToggleFolder: OrdoEventHandler<"@file-explorer/toggle-folder"> = ({ draft, payload }) =>
	Either.fromNullable(payload)
		.chain((p) => Either.fromNullable(findOrdoFolderByPath(draft.fileExplorer.tree, p)))
		.map(tap((f) => void (f.collapsed = !f.collapsed)))
		.map(({ path, collapsed }) => updateFolder(path, { collapsed }))
		.fold(...FoldVoid);
