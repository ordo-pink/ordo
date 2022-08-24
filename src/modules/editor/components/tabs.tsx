import React from "react";

import { useAppSelector } from "@core/state/store";
import { Tab } from "@modules/editor/components/tab";

export const Tabs: React.FC = React.memo(
  () => {
    const tabs = useAppSelector((state) => state.editor.tabs);

    return (
      <div className="editor_tabs-container">
        {tabs.map((tab) => (
          <Tab key={tab.path} tab={tab} />
        ))}
      </div>
    );
  },
  () => true,
);
