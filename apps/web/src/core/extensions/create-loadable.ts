import { ComponentType } from "react"
import Loadable from "../loadable/index"
import Loading from "../components/loading"

export const createLoadable = <T>(
  loader: () => Promise<ComponentType>,
  loading = Loading,
  delay = 300,
): any => {
  return Loadable({
    loader,
    loading,
    delay,
    timeout: 10000,
  })
}
