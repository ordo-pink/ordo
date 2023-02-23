import { UnaryFn } from "@ordo-pink/common-types"
import { MouseEvent, PropsWithChildren } from "react"

import "./sidebar.css"

type Props = PropsWithChildren<{
  onClick: UnaryFn<MouseEvent, void>
}>

export default function Sidebar({ children, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      role="none"
      className="h-full min-h-screen bg-neutral-100 dark:bg-neutral-800 z-40 pb-11"
    >
      {children}
    </div>
  )
}
