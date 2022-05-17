import React from "react";

import { ImageViewer } from "@modules/editor/components/image-viewer";
import { TextEditor } from "@modules/editor/components/text-editor";
import { EmptyEditor } from "@modules/editor/components/empty-editor";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";

export const useEditorComponent = () => {
	const { file } = useCurrentTab();

	const Component = React.useMemo(() => {
		if (!file) return EmptyEditor;
		if (file.type === "image") return ImageViewer;
		return TextEditor;
	}, [file && file.path]);

	return Component;
};
