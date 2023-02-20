import { loadable } from "@ordo-pink/loadable"
import { ComponentType } from "react"
import Loading from "../components/loading"

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
