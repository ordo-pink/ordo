import { PropsWithChildren } from "react"
import { BsHeadphones } from "react-icons/bs"
import { Badge } from "./badge"

import "./support.css"

type Props = PropsWithChildren<{
  className?: string
}>

export const SupportBadge = ({ children, className = "" }: Props) => {
  return (
    <Badge className={`support-badge ${className}`}>
      {children ? (
        children
      ) : (
        <div className="support-badge-text-wrapper">
          <BsHeadphones className="support-badge-icon" />
          <div>{"support"}</div>
        </div>
      )}
    </Badge>
  )
}
