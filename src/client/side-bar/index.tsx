import React from "react"

import { useSidebarComponent } from "@client/side-bar/hooks/use-sidebar-component"

export default function SideBar() {
  const Component = useSidebarComponent()
  return (
    <div className="p-2 side-bar h-full">
      <Component />
    </div>
  )
}
