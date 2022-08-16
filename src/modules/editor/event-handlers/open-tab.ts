import { sep } from "path";

import { createRoot } from "@core/parser/create-root";
import { OrdoEventHandler } from "@core/types";
import { readFile } from "@modules/file-explorer/api/read-file";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";
import { findOrdoFolderByPath } from "@modules/file-explorer/utils/find-ordo-folder";
import { parseText } from "@modules/text-parser";
import { collectFrontmatterValues } from "../utils/collect-frontmatter-values";

export const handleOpenTab: OrdoEventHandler<"@editor/open-tab"> = async ({
  draft,
  payload,
  transmission,
  context,
}) => {
  const currentTab = transmission.select((state) => state.editor.currentTab);
  const tree = draft.fileExplorer.tree;
  const file = findOrdoFile(tree, "path", payload);

  if (!file) {
    return;
  }

  let tab = transmission.select((state) => state.editor.tabs.find((tab) => tab.path === payload));

  if (!tab) {
    const raw = await readFile(payload);

    if (typeof raw === "string") {
      const content = createRoot(payload);

      parseText(raw, content);

      tab = {
        raw,
        path: payload,
        caretPositions: [
          {
            start: { line: 1, character: 0 },
            end: { line: 1, character: 0 },
            direction: "ltr",
          },
        ],
        content,
      };

      collectFrontmatterValues(file, tab);

      draft.editor.tabs.push(tab);
    } else {
      transmission.emit("@notifications/add", {
        type: "error",
        title: "Type error",
        content: "This file type is not supported",
      });
    }
  }

  if (tab) {
    draft.editor.currentTab = payload;
    transmission.emit("@activity-bar/open-editor", null);

    let parentPath = file?.path.split(sep).slice(0, -1).join(sep);

    while (parentPath && parentPath !== tree.path) {
      const folder = findOrdoFolderByPath(tree, parentPath);

      if (folder?.collapsed) {
        await transmission.emit("@file-explorer/toggle-folder", parentPath);
      }

      parentPath = parentPath.split(sep).slice(0, -1).join(sep);
    }

    context.window.setRepresentedFilename(file ? file.path : "");
    context.window.setTitle(file ? `${file.relativePath} — ${tree.readableName}` : "Ordo");

    await transmission.emit("@file-explorer/save-file", { path: tab!.path, content: tab!.raw });

    draft.editor.focused = true;
  }
};
