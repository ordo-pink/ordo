import React from "react";
import { Switch } from "or-else";

import { Editor } from "@modules/editor";
import { WelcomePage } from "@modules/welcome-page";
import { Settings } from "@core/settings";
import { GraphView } from "@modules/graph/graph-view";
import { Checkboxes } from "@modules/checkboxes";

export const useWorkspaceComponent = (currentActivity: string) => {
  const component = React.useMemo(
    () =>
      Switch.of(currentActivity)
        .case("Editor", Editor)
        .case("Graph", GraphView)
        .case("Settings", Settings)
        .case("Checkboxes", Checkboxes)
        .default(WelcomePage),
    [currentActivity],
  );

  return component;
};
