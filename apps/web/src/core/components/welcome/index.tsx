import Logo from "../../../assets/img/logo.png"
import { useWorkspace } from "../../../containers/workspace/hooks/use-workspace"

export default function Welcome() {
  const Workspace = useWorkspace()

  return (
    <Workspace>
      <div className="flex max-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-700 m-[-0.5rem]">
        <img
          className="h-52 w-52 drop-shadow-sm"
          src={Logo}
          alt="Ordo Logo"
        />
      </div>
    </Workspace>
  )
}
