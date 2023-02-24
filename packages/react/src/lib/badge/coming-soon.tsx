import { PropsWithChildren } from "react"
import { Badge } from "./badge"

import "./coming-soon.css"

type Props = PropsWithChildren<{
  className?: string
}>

export const ComingSoonBadge = ({ children, className = "" }: Props) => {
  return (
    <Badge className={`coming-soon-badge ${className}`}>
      {children ? children : <div>{"soon"}</div>}
    </Badge>
  )
}
