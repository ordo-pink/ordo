import { PropsWithChildren } from "react"

export default function Workspace({ children }: PropsWithChildren) {
  return <div className="max-h-screen h-full overflow-auto w-full py-8">{children}</div>
}
