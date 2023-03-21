import { Either } from "@ordo-pink/either"
import { useCurrentActivity } from "@ordo-pink/react-utils"

export function App() {
  const currentActivity = useCurrentActivity()

  return Either.fromNullable(currentActivity).fold(
    () => <div></div>,
    ({ Component }) => <Component />,
  )
}

export default App
