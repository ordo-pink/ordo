import React from "react";

import { useCurrentTab } from "@modules/editor/hooks/use-current-tab";

export const ImageViewer: React.FC = React.memo(
  () => {
    const current = useCurrentTab();

    return current.tab ? (
      <div className="editor_image-viewer">
        <img className="editor_image-viewer_image" src={current.tab.raw} />
      </div>
    ) : null;
  },
  () => true,
);
