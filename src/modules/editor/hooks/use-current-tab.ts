import { Either } from "or-else";

import { useAppSelector } from "@core/state/store";
import { findOrdoFile } from "@modules/file-explorer/utils/find-ordo-file";

export const useCurrentTab = () => {
	const { tabs, currentTab } = useAppSelector((state) => state.editor);
	const tree = useAppSelector((state) => state.fileExplorer.tree);

	const eitherTab = Either.fromNullable(tree).chain(() => Either.fromNullable(tabs.find((t) => t.path === currentTab)));
	const eitherFile = Either.fromNullable(tree).chain(() => Either.fromNullable(findOrdoFile(tree, "path", currentTab)));

	return { eitherTab, eitherFile };
};
