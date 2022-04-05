import { useAppSelector } from "@core/state/hooks";
import { Switch } from "or-else";
import React from "react";
import { ImageViewer } from "./image-viewer";
import { Tabs } from "./tabs";
import { TextEditor } from "./text-editor";

export const Editor: React.FC = () => {
	const path = useAppSelector((state) => state.editor.currentTab);
	const currentTab = useAppSelector((state) => state.editor.tabs.find((tab) => tab.path === path));

	const Component = Switch.of(currentTab?.extension).case(".png", ImageViewer).default(TextEditor);

	return (
		<>
			<Tabs />
			<Component />
		</>
	);
};
