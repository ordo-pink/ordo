import { useWorkspace } from "$containers/workspace/hooks/use-workspace"
import Loader from "$core/components/loader"

export default function Loading() {
  const Workspace = useWorkspace()

  return (
    <Workspace>
      <div className="flex h-screen items-center justify-center bg-neutral-50 dark:bg-neutral-700 m-[-0.5rem]">
        <Loader />
      </div>
    </Workspace>
  )
}
