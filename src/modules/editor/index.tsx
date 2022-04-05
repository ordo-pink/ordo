import { useAppSelector } from "@core/state/hooks";
import { findOrdoFile } from "@modules/file-explorer/file-tree/find-ordo-file";
import { Switch } from "or-else";
import React from "react";
import { ImageViewer } from "./image-viewer";
import { Tabs } from "./tabs";
import { TextEditor } from "./text-editor";

export const Editor: React.FC = () => {
	const path = useAppSelector((state) => state.editor.currentTab);
	const tree = useAppSelector((state) => state.fileExplorer.tree);

	if (!tree || !path) {
		return null;
	}

	const tab = findOrdoFile(tree, path);

	const Component = Switch.of(tab?.type).case("image", ImageViewer).default(TextEditor);

	return (
		<>
			<Tabs />
			<Component />
		</>
	);
};
