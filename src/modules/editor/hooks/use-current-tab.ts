import React from "react";

import { useAppSelector } from "@core/state/store";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";

export const useCurrentTab = () => {
	const tabs = useAppSelector((state) => state.editor.tabs);
	const currentTab = useAppSelector((state) => state.editor.currentTab);
	const tree = useAppSelector((state) => state.fileExplorer.tree);

	const tab = React.useMemo(() => (tabs ? tabs.find((t) => t.path === currentTab) || null : null), [tabs, currentTab]);
	const file = React.useMemo(
		() => (tree && currentTab ? findOrdoFile(tree, "path", currentTab) : null),
		[tree, currentTab],
	);

	return { tab, file };
};
