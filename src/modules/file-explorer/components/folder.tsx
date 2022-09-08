import React from "react";
import { Either } from "or-else";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { OrdoFolder } from "@modules/file-explorer/types";
import { Creator } from "@modules/file-explorer/components/creator";
import { useFolderIcons } from "@modules/file-explorer/hooks/use-folder-icons";
import { useTreeNesting } from "@modules/file-explorer/hooks/use-tree-nesting";
import { FolderContent } from "@modules/file-explorer/components/folder-content";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { fromBoolean } from "@utils/either";
import { NoOp, FoldVoid } from "@utils/functions";
import { tap } from "@utils/functions";

type FolderProps = {
  folder: OrdoFolder;
};

/**
 * Collapsible and expandable representation of a folder inside the project.
 */
export const Folder: React.FC<FolderProps> = ({ folder }) => {
  const dispatch = useAppDispatch();

  const toRename = useAppSelector((state) => state.fileExplorer.toRename);

  const changeInputRef = React.useRef<HTMLInputElement>(null);

  const { FolderIcon, CollapseIcon } = useFolderIcons(folder);
  const paddingLeft = useTreeNesting(folder.depth);

  const [iconClassName, setIconClassName] = React.useState<string>("file-explorer_folder_green");
  const [draggedOver, setDraggedOver] = React.useState<boolean>(false);
  const [renameInputValue, setRenameInputValue] = React.useState<string>(folder.readableName);

  React.useEffect(() => {
    setIconClassName(`file-explorer_folder_${folder.color}`);
  }, [folder]);

  React.useEffect(() => {
    if (toRename === folder.path) {
      changeInputRef.current && changeInputRef.current.focus();
    }
  }, [changeInputRef.current, folder.path, toRename]);

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
      .map(tap(console.log))
      .map(tapPreventDefault)
      .map(tapStopPropagation)
      .map((e) => ({ name: e.dataTransfer.getData("fileName"), oldPath: e.dataTransfer.getData("oldPath") }))
      .map(({ name, oldPath }) => ({ name, oldPath, newFolder: folder.path }))
      .map((payload) => dispatch({ type: "@file-explorer/move", payload }))
      .map(() => (draggedOver ? setDraggedOver(false) : void 0))
      .fold(...FoldVoid);

  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("oldPath", folder.path);
    event.dataTransfer.setData("fileName", folder.readableName);
  };

  const handleContextMenu = (e: React.MouseEvent) =>
    Either.of(e)
      .map(tapPreventDefault)
      .map(tapStopPropagation)
      .map(() =>
        dispatch({
          type: "@file-explorer/show-folder-context-menu",
          payload: { path: folder.path, x: e.clientX, y: e.clientY },
        }),
      )
      .fold(...FoldVoid);

  const handleClick = () => dispatch({ type: "@file-explorer/toggle-folder", payload: folder.path });

  const handleRenameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setRenameInputValue(e.target.value);

  const handleRenameInputFocus = () => dispatch({ type: "@editor/unfocus" });

  const handleRenameInputBlur = () => {
    setRenameInputValue(folder.readableName);
    dispatch({ type: "@file-explorer/rename", payload: "" });
  };

  const handleRenameInputKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      const trimmed = renameInputValue.trim();
      const newPath = folder.path.replace(folder.readableName, trimmed);

      dispatch({
        type: "@file-explorer/move",
        payload: { oldPath: folder.path, newPath },
      });

      changeInputRef.current && changeInputRef.current.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      changeInputRef.current && changeInputRef.current.blur();
    }
  };

  return Either.fromNullable(folder).fold(NoOp, () => (
    <div
      className={draggedOver ? "bg-neutral-400 dark:bg-neutral-800" : ""}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      title={folder.path}
    >
      {fromBoolean(!toRename || toRename !== folder.path).fold(
        () => (
          <div style={{ paddingLeft }}>
            <input
              type="text"
              className="bg-neutral-100 dark:bg-neutral-600 border-0"
              ref={changeInputRef}
              onBlur={handleRenameInputBlur}
              onKeyDown={handleRenameInputKeydown}
              onChange={handleRenameInputChange}
              onFocus={handleRenameInputFocus}
              value={renameInputValue}
            />
          </div>
        ),
        () => (
          <div
            className="file-explorer_item"
            draggable={true}
            style={{ paddingLeft }}
            onClick={handleClick}
            onContextMenu={handleContextMenu}
            onDragStart={handleDragStart}
          >
            <CollapseIcon />
            <FolderIcon className={iconClassName} />
            <div className="file-explorer_item_name">{folder.readableName}</div>
          </div>
        ),
      )}

      <Creator path={folder.path} depth={folder.depth} />

      <FolderContent folder={folder} />
    </div>
  ));
};
