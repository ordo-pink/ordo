import { PropsWithChildren, useEffect, useState } from "react"
import ReactSplit from "react-split"
import Sidebar from "./sidebar"
import Workspace from ".."
import { useWindowSize } from "../../use-window-size"

import "./workspace-with-sidebar.css"

type Props = {
  sidebarChildren: PropsWithChildren["children"]
}

export default function WorkspaceWithSidebar({
  children,
  sidebarChildren,
}: PropsWithChildren<Props>) {
  const [width] = useWindowSize()

  const [isNarrow, setIsNarrow] = useState(true)
  const [sizes, setSizes] = useState(isNarrow ? [0, 100] : [25, 75])
  const [snapLeft, setSnapLeft] = useState(isNarrow)
  const [snapRight, setSnapRight] = useState(false)

  useEffect(() => {
    const isNarrow = width < 768

    setIsNarrow(width < 768)

    if (isNarrow) {
      setSizes([0, 100])
      setSnapLeft(true)
      setSnapRight(false)
    } else {
      setSizes([25, 75])
      setSnapLeft(false)
      setSnapRight(false)
    }
  }, [width])

  return (
    <ReactSplit
      sizes={sizes}
      snapOffset={isNarrow ? width / 2 : 200}
      minSize={0}
      className="workspace-wrapper"
      direction="horizontal"
      onDrag={() => {
        setSnapLeft(true)
        setSnapRight(true)
      }}
      onDragEnd={([left, right]) => {
        let newLeft = left
        let newRight = right

        if (isNarrow) {
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
          } else if (left >= width - 200) {
            newLeft = 100
            newRight = 0
          }
        }

        setSnapLeft(newLeft === 0)
        setSnapRight(newRight === 0)

        setSizes([newLeft, newRight])
      }}
    >
      <Sidebar
        onClick={() => {
          if (isNarrow) {
            setSizes([0, 100])
            setSnapLeft(true)
            setSnapRight(false)
          }
        }}
      >
        <div
          className={`h-full ${
            snapLeft
              ? "opacity-0 transition-opacity duration-300"
              : "opacity-100 transition-opacity duration-300"
          }`}
        >
          {sidebarChildren}
        </div>
      </Sidebar>
      <Workspace>
        <div
          className={
            snapRight
              ? "opacity-0 transition-opacity duration-300"
              : "opacity-100 transition-opacity duration-300"
          }
        >
          {children}
        </div>
      </Workspace>
    </ReactSplit>
  )
}
