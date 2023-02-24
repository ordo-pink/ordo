import { PropsWithChildren } from "react"

import "./fieldset.css"

type Props = PropsWithChildren<{
  className?: string
}>

export const Fieldset = ({ children, className = "" }: Props) => {
  return <fieldset className={`fieldset ${className}`}>{children}</fieldset>
}
