import { EditorTab } from "@modules/editor/types";

export const findCharOffset = (tab: EditorTab, lineNumber: number, charNumber: number) => {
  let i = 0;
  let offset = charNumber;

  while (i < lineNumber - 1) {
    offset += tab.content.children[i].raw.length + 1;
    i++;
  }

  return offset;
};
