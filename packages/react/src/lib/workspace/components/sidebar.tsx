import { UnaryFn } from "@ordo-pink/common-types"
import { MouseEvent, PropsWithChildren } from "react"

import "./sidebar.css"

type Props = PropsWithChildren<{
  onClick: UnaryFn<MouseEvent, void>
}>

export default function Sidebar({ children, onClick }: Props) {
  return (
    <div
      className="sidebar"
      onClick={onClick}
    >
      {children}
    </div>
  )
}
