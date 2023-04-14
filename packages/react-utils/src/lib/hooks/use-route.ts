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

export const wieldRoute = () => currentRoute$.getValue()

export const useRouteParams = <T extends string = string>() => {
  const route = useRoute()

  const [params, setParams] = useState<Record<T, string | undefined>>(
    {} as Record<T, string | undefined>,
  )

  useEffect(() => {
    if (!route || !route.params) return setParams({} as Record<T, string | undefined>)

    const dynamicParam = Object.keys(route.params).find((param) => param.endsWith("*"))

    if (!dynamicParam) return setParams(route.params as Record<T, string | undefined>)

    const paramsCopy = { ...route.params }

    const dynamicParamValue = route.route.slice(route.route.indexOf(route.params[dynamicParam]))

    paramsCopy[dynamicParam.slice(0, -1)] = decodeURI(dynamicParamValue)

    setParams(paramsCopy as Record<T, string | undefined>)
  }, [route])

  return params
}

export const wieldRouteParams = <T extends string = string>() => {
  const route = wieldRoute()

  if (!route) return {} as Record<T, string | undefined>

  const dynamicParam = Object.keys(route.params).find((param) => param.endsWith("*"))

  if (!dynamicParam) return route.params as Record<T, string | undefined>

  const paramsCopy = { ...route.params }

  const dynamicParamValue = route.route.slice(route.route.indexOf(route.params[dynamicParam]))

  paramsCopy[dynamicParam.slice(0, -1)] = decodeURI(dynamicParamValue)

  return paramsCopy as Record<T, string | undefined>
}
