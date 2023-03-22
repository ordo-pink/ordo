import {
  Route,
  Nullable,
  Activity,
  ExtensionCreatorContext,
  ExtensionCreatorScopedContext,
  UserInfo,
} from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { registerActivity, unregisterActivity } from "@ordo-pink/stream-activities"
import { executeCommand, listenCommand, registerCommand } from "@ordo-pink/stream-commands"
import { route, noMatch } from "@ordo-pink/stream-router"
import { registerTranslations } from "@ordo-pink/stream-translations"
import i18next from "i18next"
import { prop } from "ramda"
import { mergeMap, BehaviorSubject, mergeAll, Observable } from "rxjs"
import { map, filter, switchMap } from "rxjs/operators"
import { Router } from "silkrouter"

const scopeExtensionContextTo = (
  name: string,
  ctx: ExtensionCreatorContext,
): ExtensionCreatorScopedContext => ({
  ...ctx,
  registerTranslations: ctx.registerTranslations(name),
  translate: (key: string) => i18next.t(key, { ns: name }),
  // TODO: persistedStore
})

export const createExtension =
  (name: string, callback: (ctx: ExtensionCreatorScopedContext) => void | Promise<void>) =>
  (ctx: ExtensionCreatorContext) =>
    callback(scopeExtensionContextTo(name, ctx))

const isFulfilled = <T>(x: PromiseSettledResult<T>): x is PromiseFulfilledResult<T> =>
  x.status === "fulfilled"

export const _initExtensions = callOnce(
  (user$: Observable<UserInfo>, router$: Router, activities$: Observable<Activity[]>) =>
    user$
      .pipe(
        map(prop("extensions")),
        mergeMap((exts) => Promise.allSettled(exts)),
        mergeAll(),
        filter(isFulfilled),
        map(prop("value")),
        map(prop("default")),
        map((f) =>
          f({
            executeCommand,
            registerCommand,
            registerTranslations,
            listenCommand,
            registerActivity,
            unregisterActivity,
          }),
        ),
        switchMap(() => activities$),
        map((activities) => {
          activities?.map((activity) => {
            return activity.routes.map((activityRoute) => {
              router$.pipe(route(activityRoute)).subscribe((routeData: Route) => {
                currentActivity$.next(activity)
                currentRoute$.next(routeData)
              })
            })
          })

          router$.pipe(noMatch(router$)).subscribe(() => {
            currentActivity$.next(null)
            currentRoute$.next(null)
          })
        }),
      )
      .subscribe(),
)

export const currentActivity$ = new BehaviorSubject<Nullable<Activity>>(null)
export const currentRoute$ = new BehaviorSubject<Nullable<Route>>(null)
