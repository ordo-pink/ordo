import { useMemo } from "react";
import { Switch } from "or-else";

import { useAppSelector } from "@core/state/store";
import { Editor } from "@modules/editor";
import { WelcomePage } from "@modules/welcome-page";
import { GraphView } from "@modules/graph/graph-view";

import Checkboxes from "@modules/checkboxes";
import Settings from "@core/settings";

const activitySwitch = (activity: string) =>
  Switch.of(activity)
    .case("Editor", Editor)
    .case("Graph", GraphView)
    .case("Settings", Settings)
    .case("Checkboxes", Checkboxes);

/**
 * The useWorkspaceComponent hook is used for picking the right Workspace component based on currently selected activity.
 * TODO: Dynamically add activities
 */
export const useWorkspaceComponent = () => {
  const currentActivity = useAppSelector((state) => state.activityBar.current);
  const WorkspaceComponent = useMemo(() => activitySwitch(currentActivity).default(WelcomePage), [currentActivity]);

  return WorkspaceComponent;
};
