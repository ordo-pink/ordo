import { promises } from "fs";
import { join } from "path";

import { OrdoEventHandler } from "@core/types";

/**
 * Moves file or folder from oldPath to newPath.
 */
export const handleMove: OrdoEventHandler<"@file-explorer/move"> = async ({ payload, transmission, context }) => {
  const tree = transmission.select((state) => state.fileExplorer.tree);
  const confirmMove = transmission.select((state) => state.app.userSettings.explorer.confirmMove);

  const newPath = payload.newPath ? payload.newPath : join(payload.newFolder!, payload.name!);

  if (payload.oldPath === newPath) {
    return;
  }

  const result = confirmMove
    ? context.dialog.showMessageBoxSync(context.window, {
        type: "question",
        buttons: ["Yes", "No"],
        message: `Are you sure you want to move "${payload.oldPath}" to "${newPath}"?`,
      })
    : 0;

  if (result === 0) {
    await promises.rename(payload.oldPath, newPath);
    await transmission.emit("@file-explorer/list-folder", tree.path);
  }
};
