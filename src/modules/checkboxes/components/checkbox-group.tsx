import React from "react";

import { OrdoFile } from "@modules/file-explorer/types";
import { useIcon } from "@core/hooks/use-icon";
import { useAppDispatch } from "@core/state/store";
import { getDocumentName } from "@utils/get-document-name";

import Checkbox from "@modules/checkboxes/components/checkbox";

type Props = {
  file: OrdoFile;
};

/**
 * A group of checkboxes contained in the file.
 */
const CheckboxGroup = ({ file }: Props) => {
  const dispatch = useAppDispatch();

  const LinkIcon = useIcon("HiOutlineLink");

  const fileName = getDocumentName(file.readableName);

  const handleClick = () => {
    const payload = file.path;
    dispatch({ type: "@editor/open-tab", payload });
  };

  return (
    <div>
      <div className="checkbox-group_heading">
        <h2 className="checkbox-group_heading_text">{fileName}</h2>
        <button onClick={handleClick}>
          <LinkIcon className="checkbox-group_heading_button" />
        </button>
      </div>

      <fieldset>
        {file.frontmatter!.todos.pending.map((label: string) => (
          <Checkbox checked={false} filePath={file.path} label={label} key={`${file.path}-${label}`} />
        ))}

        {file.frontmatter!.todos.done.map((label: string) => (
          <Checkbox checked={true} filePath={file.path} label={label} key={`${file.path}-${label}`} />
        ))}
      </fieldset>
    </div>
  );
};

export default CheckboxGroup;
