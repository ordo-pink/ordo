import { PropsWithChildren } from "react"

import "$containers/workspace/index.css"

export default function Workspace({ children }: PropsWithChildren) {
  return <div className="workspace w-full">{children}</div>
}
