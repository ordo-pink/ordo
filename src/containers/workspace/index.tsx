import React from "react";

import { useAppSelector } from "@core/state/store";
import { useWorkspaceComponent } from "@containers/workspace/hooks/use-workspace-component";

/**
 * Workspace is a wrapper component for user interaction. It provides space for
 * components like Editor, Graph, Settings, etc.
 */
export const Workspace: React.FC = () => {
  const currentActivity = useAppSelector((state) => state.activityBar.current);

  const Component = useWorkspaceComponent(currentActivity);

  return (
    <div className="w-full">
      <Component />
    </div>
  );
};
