import { OrdoEventHandler } from "@core/types";

export const handleSelectAll: OrdoEventHandler<"@editor/select-all"> = ({ transmission }) => {
  const currentTab = transmission.select((state) => state.editor.currentTab);
  const tabs = transmission.select((state) => state.editor.tabs);

  const tab = tabs.find((t) => t.path === currentTab);

  if (!tab) return;

  const selection = tab.content.range;

  transmission.emit("@editor/update-caret-positions", [
    { start: { line: 1, character: 0 }, end: selection.end, direction: "ltr" },
  ]);
};
