import { PropsWithChildren } from "react"
import { BsHeadphones } from "react-icons/bs"

import Badge from "$core/components/badge"

type Props = PropsWithChildren<{
  className?: string
}>

export default function SupportBadge({ children, className = "" }: Props) {
  return (
    <Badge
      className={`bg-gradient-to-tr from-rose-300 to-pink-300 dark:from-rose-800 dark:to-pink-800 ${className}`}
    >
      {children ? (
        children
      ) : (
        <div className="flex items-center space-x-1">
          <BsHeadphones className="shrink-0" />
          <div>{"Via support"}</div>
        </div>
      )}
    </Badge>
  )
}
