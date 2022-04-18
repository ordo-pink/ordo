import { useAppSelector } from "@core/state/hooks";

import { findOrdoFile } from "@modules/file-explorer/file-tree/find-ordo-file";

export const useCurrentTab = () => {
	const { tabs, currentTab } = useAppSelector((state) => state.editor);
	const tree = useAppSelector((state) => state.fileExplorer.tree);
	const tab = tabs.find((t) => t.path === currentTab) ?? null;
	const file = tree ? findOrdoFile(tree, currentTab) : null;

	return { tab, file };
};
