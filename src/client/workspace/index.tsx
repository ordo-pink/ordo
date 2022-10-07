import React from "react"

import { useWorkspaceComponent } from "./hooks/use-workspace-component"

export default function Workspace() {
  const Component = useWorkspaceComponent()

  return (
    <div className="p-4 workspace h-full outline-none">
      <Component />
    </div>
  )
}
