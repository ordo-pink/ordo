import { Activity } from "@ordo-pink/common-types"
import { Either } from "@ordo-pink/either"
import { Loading, Null, useCurrentActivity } from "@ordo-pink/react-utils"
import { activities$ } from "@ordo-pink/stream-activities"
import { Suspense, useEffect, useState } from "react"
import ActivityBar from "../activity-bar"
import Workspace from "../workspace/workspace"
import WorkspaceWithSidebar from "../workspace/workspace-with-sidebar"

export function App() {
  const currentActivity = useCurrentActivity()

  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    const subscription = activities$.subscribe(setActivities)

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return Either.fromNullable(currentActivity).fold(
    () => <div></div>,
    ({ Component, Sidebar }) => (
      <Suspense fallback={<Loading />}>
        <div className="flex h-screen">
          {Either.fromNullable(currentActivity)
            .chain((activity) => Either.fromBoolean(activity.name !== "home.landing-page"))
            .fold(Null, () => (
              <ActivityBar activities={activities} />
            ))}

          <div className="flex-grow h-full w-[calc(100vw-4rem)]">
            {Sidebar ? (
              <WorkspaceWithSidebar sidebarChildren={<Sidebar />}>
                <Component />
              </WorkspaceWithSidebar>
            ) : (
              <Workspace>
                <Component />
              </Workspace>
            )}
          </div>
        </div>
      </Suspense>
    ),
  )
}

export default App
