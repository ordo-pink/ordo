import { OrdoEventHandler } from "@core/types";
import { updateFolder } from "@modules/file-explorer/api/update-folder";
import { findOrdoFolderByPath } from "@modules/file-explorer/utils/find-ordo-folder";
import { FoldVoid } from "@utils/either";
import { tap } from "@utils/functions";
import { Either } from "or-else";

/**
 * Sets given color to a given folder.
 */
export const handleSetFolderColor: OrdoEventHandler<"@file-explorer/set-folder-color"> = ({ draft, payload }) =>
  Either.fromNullable(findOrdoFolderByPath(draft.fileExplorer.tree, payload.path))
    .map(tap((folder) => void (folder.color = payload.color)))
    .map((folder) => updateFolder(payload.path, { color: folder.color }))
    .fold(...FoldVoid);
