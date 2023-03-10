import { loadable } from "@ordo-pink/loadable"
import { Loading } from "@ordo-pink/react-utils"
import { ComponentType } from "react"

export const createLoadable = (
  loader: () => Promise<ComponentType>,
  loading = Loading,
  delay = 300,
) =>
  loadable({
    loader,
    loading,
    delay,
    timeout: 10000,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any
