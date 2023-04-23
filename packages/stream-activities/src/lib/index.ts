import { Activity, Command, PayloadCommand } from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { map, merge, scan, shareReplay, Subject } from "rxjs"

export const isPayloadCommand = (cmd: Command): cmd is PayloadCommand =>
  typeof cmd.type === "string" && (cmd as PayloadCommand).payload !== undefined

const addActivity$ = new Subject<Activity>()
const removeActivity$ = new Subject<string>()
const clearActivities$ = new Subject<null>()

const add = (newActivity: Activity) => (state: Activity[]) => [...state, newActivity]

const remove = (activity: string) => (state: Activity[]) => state.filter((a) => a.name === activity)

const clear = () => () => [] as Activity[]

export const activities$ = merge(
  addActivity$.pipe(map(add)),
  removeActivity$.pipe(map(remove)),
  clearActivities$.pipe(map(clear)),
).pipe(
  scan((acc, f) => f(acc), [] as Activity[]),
  shareReplay(1),
)

export const _initActivities = callOnce(() => {
  activities$.subscribe()

  return activities$
})

export const registerActivity =
  (extensionName: string) => (name: string, activity: Omit<Activity, "name">) => {
    addActivity$.next({
      ...activity,
      name: `${extensionName}.${name}`,
    })
  }

export const unregisterActivity = (extensionName: string) => (name: string) => {
  removeActivity$.next(`${extensionName}.${name}`)
}

export const clearActivities = () => {
  clearActivities$.next(null)
}
