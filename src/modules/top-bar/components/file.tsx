import React from "react";

import { OrdoFile } from "@modules/file-explorer/types";
import { useAppDispatch } from "@core/state/store";
import { useFileIcon } from "@modules/file-explorer/hooks/use-file-icon";

type FileProps = {
  path: string;
  readableName: string;
  size: number;
  type: string;
  selected: number;
  index: number;
  setSelected: React.Dispatch<React.SetStateAction<number>>;
};

export const File: React.FC<FileProps> = ({ path, readableName, size, type, selected, index, setSelected }) => {
  const dispatch = useAppDispatch();

  const Icon = useFileIcon({ size, type } as OrdoFile);

  const [isSelected, setIsSelected] = React.useState<boolean>(false);

  React.useEffect(() => {
    setIsSelected(selected === index);
  }, [selected, index]);

  const handleMouseOver = () => setSelected(index);
  const handleClick = () => dispatch({ type: "@editor/open-tab", payload: path });

  return (
    <div
      className={`top-bar_item ${isSelected && "top-bar_item_selected"}`}
      onMouseOver={handleMouseOver}
      onClick={handleClick}
    >
      <div className="top-bar_item_info">
        <Icon className="top-bar_item_info_icon" />
        <div className="top-bar_item_info_name">{readableName}</div>
      </div>
    </div>
  );
};
