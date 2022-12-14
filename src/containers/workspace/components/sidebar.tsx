import { PropsWithChildren } from "react"

export default function Sidebar({ children }: PropsWithChildren) {
  return <div className="workspace-sidebar">{children}</div>
}
