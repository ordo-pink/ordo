import React, { useState, useEffect } from "react";

import { useAppSelector } from "@core/state/store";
import { collectFiles } from "@modules/file-explorer/utils/collect-files";
import { OrdoFile } from "@modules/file-explorer/types";

import CheckboxGroup from "./components/checkbox-group";

import "@modules/checkboxes/index.css";

const Checkboxes = () => {
  const tree = useAppSelector((state) => state.fileExplorer.tree);

  const [files, setFiles] = useState<OrdoFile[]>([]);

  useEffect(() => {
    if (!tree) return;

    const flatFiles = collectFiles(tree);
    const filesWithToDos = flatFiles.filter(filterOutFilesWithoutToDos);

    setFiles(filesWithToDos);
  }, [tree]);

  return (
    <div className="checkboxes">
      {files.map((file) => (
        <CheckboxGroup key={file.path} file={file} />
      ))}
    </div>
  );
};

export default Checkboxes;

const filterOutFilesWithoutToDos = (file: OrdoFile) => {
  const hasCompletedToDos = Boolean(file.frontmatter?.todos?.done?.length);
  const hasPendingToDos = Boolean(file.frontmatter?.todos?.pending?.length);

  return hasCompletedToDos || hasPendingToDos;
};
