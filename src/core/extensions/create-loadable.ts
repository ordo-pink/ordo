import { ComponentType } from "react"
import Loadable, { LoadableComponent } from "react-loadable"

import Loading from "$core/components/loading"

export const createLoadable = <T>(
  loader: () => Promise<ComponentType>,
  loading = Loading,
  delay = 300,
): ComponentType<T> & LoadableComponent =>
  Loadable({
    loader,
    loading,
    delay,
    timeout: 10000,
  }) as ComponentType<T> & LoadableComponent
