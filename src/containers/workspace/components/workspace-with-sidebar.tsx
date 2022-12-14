import { PropsWithChildren } from "react"
import Workspace from "$containers/workspace"
import Sidebar from "$containers/workspace/components/sidebar"

type Props = {
  sidebarChildren: PropsWithChildren["children"]
}

export default function WorkspaceWithSidebar({
  children,
  sidebarChildren,
}: PropsWithChildren<Props>) {
  // TODO: Add support for dragging
  return (
    <>
      <Sidebar>{sidebarChildren}</Sidebar>
      <Workspace>{children}</Workspace>
    </>
  )
}
