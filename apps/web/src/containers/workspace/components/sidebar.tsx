import { UnaryFn } from "@ordo-pink/common-types"
import { MouseEvent, PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  onClick: UnaryFn<MouseEvent, void>
}>

export default function Sidebar({ children, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      role="none"
      className="h-full bg-neutral-100 dark:bg-neutral-800 z-40"
    >
      {children}
    </div>
  )
}
