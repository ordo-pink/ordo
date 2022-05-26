import React from "react";

import { useAppSelector } from "@core/state/store";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";

export const useCurrentTab = () => {
	const { tabs, currentTab } = useAppSelector((state) => state.editor);
	const tree = useAppSelector((state) => state.fileExplorer.tree);

	const tab = tabs ? tabs.find((t) => t.path === currentTab) || null : null;
	const file = tree && currentTab ? findOrdoFile(tree, "path", currentTab) : null;

	return { tab, file };
};
