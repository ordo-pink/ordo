import { ComponentType } from "react"
import Loading from "../components/loading"
import Loadable from "../loadable/index"

export const createLoadable = (
  loader: () => Promise<ComponentType>,
  loading = Loading,
  delay = 300,
) => {
  return Loadable({
    loader,
    loading,
    delay,
    timeout: 10000,
  })
}
