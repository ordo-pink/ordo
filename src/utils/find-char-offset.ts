import { EditorTab } from "@modules/editor/types";

type Params = {
  tab: EditorTab;
  lineNumber: number;
  charNumber: number;
};

export const findCharOffset = ({ tab, lineNumber, charNumber }: Params) => {
  let offset = charNumber;

  for (let i = 0; i < lineNumber - 1; i++) {
    offset += tab.content.children[i].raw.length + 1;
  }

  return offset;
};
