import { join } from "path";
import { existsSync, promises } from "fs";

import { OrdoEventHandler } from "@core/types";

/**
 * Creates a folder with the path provided as payload.
 */
export const handleCreateFolder: OrdoEventHandler<"@file-explorer/create-folder"> = async ({
  transmission,
  payload,
}) => {
  const { createFolderIn, tree } = transmission.select((state) => state.fileExplorer);
  const path =
    typeof payload === "string"
      ? join(createFolderIn ? createFolderIn : tree.path, payload)
      : join(payload.parentPath, payload.name);

  if (existsSync(path)) {
    return;
  }

  await promises.mkdir(path, { recursive: true });

  await transmission.emit("@file-explorer/hide-creation", null);
  await transmission.emit("@file-explorer/list-folder", tree.path);
};
