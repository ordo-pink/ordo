import { useWorkspace } from "../../../containers/workspace/hooks/use-workspace"
import Loader from "../loader"

export default function Loading() {
  const Workspace = useWorkspace()

  return (
    <Workspace>
      <div className="flex max-h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-700">
        <Loader />
      </div>
    </Workspace>
  )
}
