import { Either } from "or-else";

import { OrdoEventHandler } from "@core/types";
import { fromBoolean } from "@utils/either";
import { id } from "@utils/functions";
import { noOpFn } from "@utils/no-op";

/**
 * Moves folder with a path provided via payload to trash bin.
 */
export const handleRemoveFolder: OrdoEventHandler<"@file-explorer/remove-folder"> = async ({
  payload,
  context,
  transmission,
}) =>
  (transmission.select((state) => state.app.userSettings.explorer.confirmDelete)
    ? Either.fromNullable(
        context.dialog.showMessageBoxSync({
          type: "question",
          buttons: ["Yes", "No"],
          message: `Are you sure you want to remove folder "${payload}"?`,
        }),
      )
    : Either.of(0)
  )
    .chain((result) => fromBoolean(result === 0))
    .map(() => transmission.select((state) => state.fileExplorer.tree))
    .map((tree) =>
      context
        .trashItem(payload)
        .then(() => transmission.emit("@file-explorer/list-folder", tree.path))
        .then(noOpFn),
    )
    .fold(noOpFn, id);
