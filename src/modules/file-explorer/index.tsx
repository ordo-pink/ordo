import React from "react";
import { Either } from "or-else";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { Header } from "@modules/file-explorer/components/header";
import { Creator } from "@modules/file-explorer/components/creator";
import { FolderContent } from "@modules/file-explorer/components/folder-content";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { NoOp, FoldVoid } from "@utils/functions";

import "@modules/file-explorer/index.css";

export const FileExplorer: React.FC = () => {
  const dispatch = useAppDispatch();

  const tree = useAppSelector((state) => state.fileExplorer.tree);

  const [draggedOver, setDraggedOver] = React.useState<boolean>(false);

  const handleDragLeave = (event: React.MouseEvent) =>
    Either.right(event)
      .map(tapPreventDefault)
      .map(tapStopPropagation)
      .map(() => (draggedOver ? setDraggedOver(false) : void 0))
      .fold(...FoldVoid);

  const handleDragOver = (event: React.MouseEvent) =>
    Either.right(event)
      .map(tapPreventDefault)
      .map(tapStopPropagation)
      .map(() => (draggedOver ? void 0 : setDraggedOver(true)))
      .fold(...FoldVoid);

  const handleDrop = (event: React.DragEvent) =>
    Either.right(event)
      .map(tapPreventDefault)
      .map(tapStopPropagation)
      .map((e) => ({ name: e.dataTransfer.getData("fileName"), oldPath: e.dataTransfer.getData("oldPath") }))
      .map(({ name, oldPath }) => ({ name, oldPath, newFolder: tree.path }))
      .map((payload) => dispatch({ type: "@file-explorer/move", payload }))
      .map(() => (draggedOver ? setDraggedOver(false) : void 0))
      .fold(...FoldVoid);

  const handleContextMenu = (e: React.MouseEvent) =>
    Either.of(e)
      .map(tapPreventDefault)
      .map(tapStopPropagation)
      .map(() =>
        dispatch({
          type: "@file-explorer/show-folder-context-menu",
          payload: { path: tree.path, x: e.clientX, y: e.clientY },
        }),
      )
      .fold(...FoldVoid);

  return Either.fromNullable(tree).fold(NoOp, (folder) => (
    <div
      className={`file-explorer ${draggedOver ? "bg-neutral-400 dark:bg-neutral-800" : ""}`}
      onContextMenu={handleContextMenu}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Header />
      <Creator path={folder.path} depth={0} />
      <div className="file-explorer_tree-wrapper">
        <FolderContent folder={folder} />
      </div>
    </div>
  ));
};
