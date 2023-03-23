import { Nullable, Route } from "@ordo-pink/common-types"
import { currentRoute$ } from "@ordo-pink/stream-extensions"
import { useEffect, useState } from "react"

export const useRoute = () => {
  const [route, setRoute] = useState<Nullable<Route>>(null)

  useEffect(() => {
    const subscription = currentRoute$.subscribe(setRoute)

    return () => subscription.unsubscribe()
  }, [])

  return route
}

export const useRouteParams = <T extends Record<string, string> = Record<string, string>>() => {
  const route = useRoute()

  const [params, setParams] = useState<Nullable<T>>(null)

  useEffect(() => {
    if (!route || !route.params) return

    const dynamicParam = Object.keys(route.params).find((param) => param.endsWith("*"))

    if (!dynamicParam) return setParams(route.params as T)

    const paramsCopy = { ...route.params }

    const dynamicParamValue = route.route.slice(route.route.indexOf(route.params[dynamicParam]))

    paramsCopy[dynamicParam] = `/${dynamicParamValue}`

    setParams(paramsCopy as T)
  }, [route])

  return params
}
