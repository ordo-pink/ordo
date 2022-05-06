import React from "react";
import { Switch } from "or-else";

import { useAppSelector } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { EmptyEditor } from "@modules/editor/components/empty-editor";
import { Tabs } from "@modules/editor/components/tabs";
import { useEditorComponent } from "./hooks/use-editor-component";

export const Editor: React.FC = () => {
	const { file } = useCurrentTab();
	const tabs = useAppSelector((state) => state.editor.tabs);

	const Component = useEditorComponent(file);

	return (
		<>
			{tabs.length ? <Tabs /> : null}
			{tabs.length ? <Component /> : <EmptyEditor />}
		</>
	);
};
