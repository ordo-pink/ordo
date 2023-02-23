import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  className?: string
}>

export const Badge = ({ children, className = "" }: Props) => {
  return <div className={`px-1 py-0.5 text-xs uppercase rounded-sm ${className}`}>{children}</div>
}
