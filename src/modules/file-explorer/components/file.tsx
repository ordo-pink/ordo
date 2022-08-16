import React from "react";
import { Either } from "or-else";

import { useAppDispatch, useAppSelector } from "@core/state/store";
import { OrdoFile } from "@modules/file-explorer/types";
import { useFileIcon } from "@modules/file-explorer/hooks/use-file-icon";
import { useTreeNesting } from "@modules/file-explorer/hooks/use-tree-nesting";
import { tapPreventDefault, tapStopPropagation } from "@utils/events";
import { FoldVoid, fromBoolean } from "@utils/either";

type FileProps = {
  file: OrdoFile;
};

/**
 * Project file representation in FileExplorer.
 */
export const File: React.FC<FileProps> = ({ file }) => {
  const dispatch = useAppDispatch();

  const selectedFile = useAppSelector((state) => state.editor.currentTab);
  const openFiles = useAppSelector((state) => state.editor.tabs);
  const toRename = useAppSelector((state) => state.fileExplorer.toRename);

  const changeInputRef = React.useRef<HTMLInputElement>(null);

  const Icon = useFileIcon(file);
  const paddingLeft = useTreeNesting(file.depth);

  const [isOpenFile, setIsOpenFile] = React.useState<boolean>(false);
  const [isCurrentFile, setIsCurrentFile] = React.useState<boolean>(false);
  const [renameInputValue, setRenameInputValue] = React.useState<string>(file.readableName);

  React.useEffect(() => {
    setIsCurrentFile(selectedFile === file.path);
    setIsOpenFile(openFiles.some((f) => f.path === file.path));
  }, [selectedFile, file, openFiles]);

  React.useEffect(() => {
    if (toRename === file.path) {
      changeInputRef.current && changeInputRef.current.focus();
    }
  }, [changeInputRef.current, file.path, toRename]);

  const handleClick = () => dispatch({ type: "@editor/open-tab", payload: file.path });
  const handleDragStart = (event: React.DragEvent) => {
    event.dataTransfer.setData("oldPath", file.path);
    event.dataTransfer.setData("fileName", file.readableName);
  };

  const handleContextMenu = (e: React.MouseEvent) =>
    Either.of(e)
      .map(tapPreventDefault)
      .map(tapStopPropagation)
      .map(() =>
        dispatch({
          type: "@file-explorer/show-file-context-menu",
          payload: { path: file.path, x: e.clientX, y: e.clientY },
        }),
      )
      .fold(...FoldVoid);

  const handleRenameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => setRenameInputValue(e.target.value);

  const handleRenameInputFocus = () => dispatch({ type: "@editor/unfocus" });

  const handleRenameInputBlur = () => {
    setRenameInputValue(file.readableName);
    dispatch({ type: "@file-explorer/rename", payload: "" });
  };

  const handleRenameInputKeydown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      e.stopPropagation();

      const trimmed = renameInputValue.trim();
      const newName = trimmed.indexOf(".") !== -1 ? trimmed : `${trimmed}.md`;
      const newPath = file.path.replace(file.readableName, newName);

      dispatch({
        type: "@file-explorer/move",
        payload: { oldPath: file.path, newPath },
      });

      if (isOpenFile) {
        dispatch({ type: "@editor/close-tab", payload: file.path });
        dispatch({ type: "@editor/open-tab", payload: newPath });
      }

      changeInputRef.current && changeInputRef.current.blur();
    } else if (e.key === "Escape") {
      e.preventDefault();
      e.stopPropagation();

      changeInputRef.current && changeInputRef.current.blur();
    }
  };

  return fromBoolean(!toRename || toRename !== file.path).fold(
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
        style={{ paddingLeft }}
        title={file.path}
        draggable={true}
        className={`file-explorer_item ${isOpenFile && "file-explorer_item_open"} ${
          isCurrentFile && "file-explorer_item_current"
        }`}
        onClick={handleClick}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
      >
        <Icon
          className={`file-explorer_item_icon ${
            file.frontmatter && file.frontmatter.color
              ? `text-${file.frontmatter.color}-600 dark:text-${file.frontmatter.color}-300`
              : "text-neutral-500 dark:text-neutral-300"
          }`}
        />
        <div className="file-explorer_item_name">{file.readableName}</div>
      </div>
    ),
  );
};
