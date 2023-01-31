import { PropsWithChildren, useState } from "react"
import ReactSplit from "react-split"

import Workspace from "$containers/workspace"
import Sidebar from "$containers/workspace/components/sidebar"

type Props = {
  sidebarChildren: PropsWithChildren["children"]
}

export default function WorkspaceWithSidebar({
  children,
  sidebarChildren,
}: PropsWithChildren<Props>) {
  const windowWidth = window.innerWidth
  const isMobile = windowWidth <= 448

  const [sizes, setSizes] = useState(isMobile ? [0, 100] : [25, 75])
  const [snapLeft, setSnapLeft] = useState(isMobile)
  const [snapRight, setSnapRight] = useState(false)

  return (
    <ReactSplit
      sizes={sizes}
      snapOffset={isMobile ? windowWidth / 2 : 200}
      minSize={0}
      className="w-full flex max-w"
      direction="horizontal"
      onDrag={() => {
        setSnapLeft(true)
        setSnapRight(true)
      }}
      onDragEnd={([left, right]) => {
        let newLeft = left
        let newRight = right

        if (isMobile) {
          if (left < 50) {
            newLeft = 0
            newRight = 100
          } else {
            newLeft = 100
            newRight = 0
          }
        } else {
          if (left < 5) {
            newLeft = 0
            newRight = 100
          } else if (left >= windowWidth - 200) {
            newLeft = 100
            newRight = 0
          }
        }

        setSnapLeft(newLeft === 0)
        setSnapRight(newRight === 0)

        setSizes([newLeft, newRight])
      }}
    >
      <Sidebar>
        <div className={`h-full ${snapLeft ? "snapped" : "unsnapped"}`}>{sidebarChildren}</div>
      </Sidebar>
      <Workspace>
        <div className={snapRight ? "snapped" : "unsnapped"}>{children}</div>
      </Workspace>
    </ReactSplit>
  )
}
