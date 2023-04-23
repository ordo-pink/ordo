import { useEffect, DependencyList } from "react"

export const useDebounceEffect = (fn: () => void, waitTime: number, deps?: DependencyList) => {
  useEffect(() => {
    const t = setTimeout(() => {
      // eslint-disable-next-line prefer-spread
      fn.apply(undefined, deps as [])
    }, waitTime)

    return () => {
      clearTimeout(t)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
