import React from "react";

import { useWorkspaceComponent } from "@containers/workspace/hooks/use-workspace-component";

import "@containers/workspace/index.css";

/**
 * Workspace is a wrapper component for user interaction. It provides space for
 * components like Editor, Graph, Settings, etc.
 */
export const Workspace = () => {
  const WorkspaceComponent = useWorkspaceComponent();

  return (
    <div className="workspace">
      <WorkspaceComponent />
    </div>
  );
};
