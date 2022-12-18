import { ComponentType } from "react"
import Loadable from "react-loadable"

import Loading from "$core/components/loading"

export const createLoadable = (
  loader: () => Promise<ComponentType>,
  loading = Loading,
  delay = 300,
): ReturnType<typeof Loadable> =>
  Loadable({
    loader,
    loading,
    delay,
    timeout: 10000,
  }) as ReturnType<typeof Loadable>
