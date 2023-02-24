import { PropsWithChildren } from "react"

import "./index.css"

export default function Workspace({ children }: PropsWithChildren) {
  return <div className="workspace">{children}</div>
}
