import React from "react";

import { useAppSelector } from "@core/state/store";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";
import { EmptyEditor } from "@modules/editor/components/empty-editor";
import { Tabs } from "@modules/editor/components/tabs";
import { useEditorComponent } from "@modules/editor/hooks/use-editor-component";
import { fromBoolean } from "@utils/either";
import { NoOp } from "@utils/no-op";

import "@modules/editor/index.css";

export const Editor: React.FC = () => {
	const { eitherFile } = useCurrentTab();

	const tabs = useAppSelector((state) => state.editor.tabs);

	const Component = useEditorComponent(eitherFile.fold(NoOp, (x) => x));

	return fromBoolean(tabs.length > 0).fold(
		() => <EmptyEditor />,
		() => (
			<>
				<Tabs />
				<Component />
			</>
		),
	);
};
