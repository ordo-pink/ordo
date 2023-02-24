import { PropsWithChildren } from "react"

import "./badge.css"

type Props = PropsWithChildren<{
  className?: string
}>

export const Badge = ({ children, className = "" }: Props) => {
  return <div className={`badge ${className}`}>{children}</div>
}
