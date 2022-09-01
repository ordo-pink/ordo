import React from "react";

type Props = {
  focusedIndex: number;
  index: number;
  title: string;
  onClick: (e: React.MouseEvent, title: string) => void;
  onMouseOver: (index: number) => void;
};

export const AutocompleteItem: React.FC<Props> = ({ focusedIndex, index, title, onClick, onMouseOver }) => {
  return (
    <p
      title={title}
      className={`dark:bg-neutral-900 px-2 cursor-pointer max-w-full w-[calc(20rem-3ctpx)] truncate ${
        focusedIndex === index && "bg-neutral-300"
      }`}
      onClick={(e) => onClick(e, title)}
      onMouseOver={() => onMouseOver(index)}
    >
      {title}
    </p>
  );
};
