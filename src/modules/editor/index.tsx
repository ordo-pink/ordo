import React from "react";
import { Switch } from "or-else";

import { useCurrentTab } from "./hooks";
import { ImageViewer } from "./image-viewer";
import { Tabs } from "./tabs";
import { TextEditor } from "./text-editor";

export const Editor: React.FC = () => {
	const { file } = useCurrentTab();

	const Component = Switch.of(file?.type).case("image", ImageViewer).default(TextEditor);

	return (
		<>
			<Tabs />
			<Component />
		</>
	);
};
