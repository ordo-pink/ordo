import { OrdoEventHandler } from "@core/types";
import { parseText } from "@modules/text-parser";
import { findCharOffset } from "@utils/find-char-offset";

export const handleCut: OrdoEventHandler<"@editor/cut"> = async ({ context, transmission, draft }) => {
  const editorTabs = draft.editor.tabs;
  const currentTab = transmission.select((state) => state.editor.currentTab);

  const tab = editorTabs.find((tab) => tab.path === currentTab);

  if (!tab) return;

  const hasNoneOrMultipleSelections = tab.caretPositions.length !== 1;

  if (hasNoneOrMultipleSelections) return;

  const currentCaretPosition = tab.caretPositions[0];
  const isLeftToRight = currentCaretPosition.direction === "ltr";
  const caretRangeStart = isLeftToRight ? currentCaretPosition.start : currentCaretPosition.end;
  const caretRangeEnd = isLeftToRight ? currentCaretPosition.end : currentCaretPosition.start;

  const isOneLineRange = caretRangeStart.line === caretRangeEnd.line;
  const hasRange = !isOneLineRange || caretRangeStart.character !== caretRangeEnd.character;

  if (!hasRange) return;

  const selectionOffset1 = findCharOffset(tab, caretRangeStart.line, caretRangeStart.character);
  const selectionOffset2 = findCharOffset(tab, caretRangeEnd.line, caretRangeEnd.character);

  const selectionOffsetStart = selectionOffset1 <= selectionOffset2 ? selectionOffset1 : selectionOffset2;
  const selectionOffsetEnd = selectionOffset1 <= selectionOffset2 ? selectionOffset2 : selectionOffset1;

  const selectedText = tab.raw.slice(selectionOffsetStart, selectionOffsetEnd);

  context.toClipboard(selectedText);

  tab.raw = tab.raw.slice(0, selectionOffsetStart).concat(tab.raw.slice(selectionOffsetEnd));

  tab.content.children = [];
  tab.content.raw = tab.raw;
  parseText(tab.raw, tab.content);

  await transmission.emit("@editor/update-caret-positions", [
    {
      start: { character: caretRangeStart.character, line: caretRangeStart.line },
      end: { character: caretRangeStart.character, line: caretRangeStart.line },
      direction: "ltr",
    },
  ]);

  await transmission.emit("@file-explorer/save-file", { path: tab.path, content: tab.raw });
};
