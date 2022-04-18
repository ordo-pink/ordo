import React from "react";
import { Switch } from "or-else";

import { useCurrentTab } from "./hooks";
import { ImageViewer } from "./image-viewer";
import { Tabs } from "./tabs";
import { TextEditor } from "./text-editor";
import { useAppDispatch } from "@core/state/hooks";
import { closeTab } from "./editor-slice";
import useMousetrap from "react-hook-mousetrap";

export const Editor: React.FC = () => {
	const dispatch = useAppDispatch();

	const { file } = useCurrentTab();

	useMousetrap(["command+w", "ctrl+w"], () => dispatch(closeTab(file?.path || "")));

	const Component = Switch.of(file?.type).case("image", ImageViewer).default(TextEditor);

	return (
		<>
			<Tabs />
			<Component />
		</>
	);
};
