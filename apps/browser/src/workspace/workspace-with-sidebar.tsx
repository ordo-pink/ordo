import { useWindowSize } from "@ordo-pink/react-utils"
import { PropsWithChildren, useEffect, useState } from "react"
import ReactSplit from "react-split"
import Sidebar from "./sidebar"
import Workspace from "./workspace"

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

  useEffect(() => {
    const isNarrow = width < 768

    setIsNarrow(width < 768)

    if (isNarrow) {
      setSizes([0, 100])
    } else {
      setSizes([25, 75])
    }
  }, [width])

  const handleSidebarClick = () => {
    if (!isNarrow || sizes[0] === 0) return

    setSizes([0, 100])
  }

  return (
    <ReactSplit
      sizes={sizes}
      snapOffset={isNarrow ? width / 2 : 200}
      minSize={0}
      className="flex overflow-hidden h-screen"
      direction="horizontal"
      onDrag={(sizes) => {
        setSizes(sizes)
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

        setSizes([newLeft, newRight])
      }}
    >
      <div
        className={`h-full ${sizes[0] <= 5 ? "hidden" : "block"}`}
        onClick={handleSidebarClick}
      >
        <Sidebar
          onClick={() => {
            if (isNarrow) {
              setSizes([0, 100])
            }
          }}
        >
          {sidebarChildren}
        </Sidebar>
      </div>
      <div className={`h-full w-full ${sizes[1] <= 5 ? "hidden" : "block"}`}>
        <Workspace>
          <div className="h-full w-full">{children}</div>
        </Workspace>
      </div>
    </ReactSplit>
  )
}
