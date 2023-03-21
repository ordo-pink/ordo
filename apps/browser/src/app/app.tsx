import { Either } from "@ordo-pink/either"
import { Loading, useCurrentActivity } from "@ordo-pink/react-utils"
import { Suspense } from "react"

export function App() {
  const currentActivity = useCurrentActivity()

  return Either.fromNullable(currentActivity).fold(
    () => <div></div>,
    ({ Component }) => (
      <Suspense fallback={<Loading />}>
        <Component />
      </Suspense>
    ),
  )
}

export default App
