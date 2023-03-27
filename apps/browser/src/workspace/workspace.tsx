import { PropsWithChildren } from "react"

import "./workspace.css"

export default function Workspace({ children }: PropsWithChildren) {
  return <div className="workspace">{children}</div>
}
