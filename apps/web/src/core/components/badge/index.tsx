import { PropsWithChildren } from "react"

type Props = PropsWithChildren<{
  className?: string
}>

export default function Badge({ children, className = "" }: Props) {
  return <div className={`px-1 py-0.5 text-xs uppercase rounded-sm ${className}`}>{children}</div>
}
