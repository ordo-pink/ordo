import { loadable } from "@ordo-pink/loadable"
import { Loading } from "@ordo-pink/react-components"
import { ComponentType } from "react"

export const createLoadable = (
  loader: () => Promise<ComponentType>,
  loading = Loading,
  delay = 300,
) => {
  return loadable({
    loader,
    loading,
    delay,
    timeout: 10000,
  })
}
