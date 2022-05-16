import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";

export const useCurrentPositions = () => useCurrentTab().eitherTab.map((t) => t.caretPositions);
