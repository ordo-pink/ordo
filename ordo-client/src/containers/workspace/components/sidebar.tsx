import { UnaryFn } from "@ordo-pink/core"
import { MouseEvent, PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  onClick: UnaryFn<MouseEvent, void>
}>

export default function Sidebar({ children, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      role="none"
      className="workspace-sidebar"
    >
      {children}
    </div>
  )
}
