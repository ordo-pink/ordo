import { PropsWithChildren } from "react"

export default function Workspace({ children }: PropsWithChildren) {
  return <div className="max-h-screen h-full flex overflow-auto w-full">{children}</div>
}
