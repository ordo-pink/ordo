import {
  Route,
  Nullable,
  Activity,
  ExtensionCreatorContext,
  ExtensionCreatorScopedContext,
  ExtensionModule,
  UserInfo,
} from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { executeCommand, registerCommand } from "@ordo-pink/stream-commands"
import { route, noMatch } from "@ordo-pink/stream-router"
import { registerTranslations } from "@ordo-pink/stream-translations"
import i18next from "i18next"
import { prop } from "ramda"
import { ComponentType } from "react"
import { mergeMap, Subject, BehaviorSubject, mergeAll, Observable } from "rxjs"
import { map, filter, scan } from "rxjs/operators"
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
  (name: string, callback: (ctx: ExtensionCreatorScopedContext) => ExtensionModule) =>
  (ctx: ExtensionCreatorContext) =>
    callback(scopeExtensionContextTo(name, ctx))

const isFulfilled = <T>(x: PromiseSettledResult<T>): x is PromiseFulfilledResult<T> =>
  x.status === "fulfilled"

export const _initExtensions = callOnce((user$: Observable<UserInfo>, router$: Router) =>
  user$
    .pipe(
      map(prop("extensions")),
      mergeMap((exts) => Promise.allSettled(exts)),
      mergeAll(),
      filter(isFulfilled),
      map(prop("value")),
      map(prop("default")),
      map((f) => f({ executeCommand, registerCommand, registerTranslations })),
      filter((extension) => Array.isArray(extension.activities)),
      map(({ activities }: ExtensionModule) => {
        activities?.map((activity) =>
          activity.routes.map((r) => {
            activityIcon$.next(activity.Icon)

            router$.pipe(route(r, router$)).subscribe((routeData: Route) => {
              currentActivity$.next(activity)
              currentRouteData$.next(routeData)
            })
          }),
        )

        router$.pipe(noMatch(router$)).subscribe(() => {
          currentActivity$.next(null)
        })
      }),
    )
    .subscribe(),
)

const activityIcon$ = new Subject<ComponentType>()

export const currentActivity$ = new BehaviorSubject<Nullable<Activity>>(null)
export const currentRouteData$ = new BehaviorSubject<Nullable<Route>>(null)
export const activityIcons$ = activityIcon$.pipe(
  scan((acc, c) => acc.concat([c]), [] as ComponentType[]),
)
