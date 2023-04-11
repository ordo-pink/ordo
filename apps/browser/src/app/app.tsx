import { Either } from "@ordo-pink/either"
import { Loading, Null, useCurrentActivity, useSubscription } from "@ordo-pink/react-utils"
import { activities$ } from "@ordo-pink/stream-activities"
import { Suspense } from "react"
import ActivityBar from "../activity-bar"
import Workspace from "../workspace/workspace"
import WorkspaceWithSidebar from "../workspace/workspace-with-sidebar"

/**
 * Root level of the application.
 */
export function App() {
  const currentActivity = useCurrentActivity()
  const activities = useSubscription(activities$)

  return Either.fromNullable(currentActivity).fold(Null, ({ Component, Sidebar }) => (
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
              <Suspense fallback={<Loading />}>
                <Component />
              </Suspense>
            </WorkspaceWithSidebar>
          ) : (
            <Suspense fallback={<Loading />}>
              <Workspace>
                <Component />
              </Workspace>
            </Suspense>
          )}
        </div>
      </div>
    </Suspense>
  ))
}

export default App
