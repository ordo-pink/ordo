import Logo from "$assets/img/logo.png"
import { useWorkspace } from "$containers/workspace/hooks/use-workspace.hook"

export default function Welcome() {
  const Workspace = useWorkspace()

  return (
    <Workspace>
      <div className="flex w-full h-full items-center justify-center">
        <img
          className="h-52 w-52 drop-shadow-sm"
          src={Logo}
          alt="Ordo Logo"
        />
      </div>
    </Workspace>
  )
}
