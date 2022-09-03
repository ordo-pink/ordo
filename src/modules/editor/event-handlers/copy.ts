import { OrdoEventHandler } from "@core/types";
import { findCharOffset } from "@utils/find-char-offset";

export const handleCopy: OrdoEventHandler<"@editor/copy"> = ({ context, transmission, draft }) => {
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

  const selectionOffset1 = findCharOffset({
    tab,
    lineNumber: caretRangeStart.line,
    charNumber: caretRangeStart.character,
  });
  const selectionOffset2 = findCharOffset({
    tab,
    lineNumber: caretRangeEnd.line,
    charNumber: caretRangeEnd.character,
  });

  const selectionOffsetStart = selectionOffset1 <= selectionOffset2 ? selectionOffset1 : selectionOffset2;
  const selectionOffsetEnd = selectionOffset1 <= selectionOffset2 ? selectionOffset2 : selectionOffset1;

  const selectedText = tab.raw.slice(selectionOffsetStart, selectionOffsetEnd);

  context.toClipboard(selectedText);
};
