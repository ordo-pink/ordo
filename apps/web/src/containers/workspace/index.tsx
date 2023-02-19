import { PropsWithChildren } from "react"

export default function Workspace({ children }: PropsWithChildren) {
  return <div className="h-full overflow-auto w-full">{children}</div>
}
