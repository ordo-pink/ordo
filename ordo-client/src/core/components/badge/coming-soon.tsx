import { PropsWithChildren } from "react"

import Badge from "$core/components/badge"

type Props = PropsWithChildren<{
  className?: string
}>

export default function ComingSoonBadge({ children, className = "" }: Props) {
  return (
    <Badge
      className={`uppercase font-light bg-gradient-to-tr from-cyan-200 to-violet-200 dark:from-cyan-800 dark:to-violet-800 ${className}`}
    >
      {children ? (
        children
      ) : (
        <div className="flex items-center space-x-1">
          <div>{"soon"}</div>
        </div>
      )}
    </Badge>
  )
}
