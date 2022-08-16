import React from "react";

import { ImageViewer } from "@modules/editor/components/image-viewer";
import { TextEditor } from "@modules/editor/components/text-editor";
import { EmptyEditor } from "@modules/editor/components/empty-editor";
import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";

export const useEditorComponent = () => {
  const currentTab = useCurrentTab();

  const Component = React.useMemo(() => {
    if (!currentTab.file) return EmptyEditor;
    if (currentTab.file.type === "image") return ImageViewer;
    return TextEditor;
  }, [currentTab.file && currentTab.file.path]);

  return Component;
};
