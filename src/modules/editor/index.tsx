import React from "react";
import { Switch } from "or-else";

import { useAppSelector } from "@core/state/store";
import { ImageViewer } from "@modules/editor/components/image-viewer";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { EmptyEditor } from "@modules/editor/components/empty-editor";
import { TextEditor } from "@modules/editor/components/text-editor";
import { Tabs } from "@modules/editor/components/tabs";

export const Editor: React.FC = () => {
	const { file } = useCurrentTab();
	const tabs = useAppSelector((state) => state.editor.tabs);

	const Component = Switch.of(file?.type).case("image", ImageViewer).default(TextEditor);

	if (!tabs.length) {
		return <EmptyEditor />;
	}

	return (
		<>
			<Tabs />
			<Component />
		</>
	);
};
