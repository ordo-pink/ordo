import {
  Route,
  Nullable,
  Activity,
  ExtensionCreatorContext,
  ExtensionCreatorScopedContext,
  UserInfo,
  FileAssociation,
} from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { Logger } from "@ordo-pink/logger"
import { registerActivity, unregisterActivity } from "@ordo-pink/stream-activities"
import {
  executeCommand,
  unregisterCommand,
  registerCommand,
  prependListener,
  appendListener,
} from "@ordo-pink/stream-commands"
import {
  ContextMenuItem,
  registerContextMenuItem,
  unregisterContextMenuItem,
} from "@ordo-pink/stream-context-menu"
import {
  registerFileAssociation,
  unregisterFileAssociation,
} from "@ordo-pink/stream-file-associations"
import { route, noMatch } from "@ordo-pink/stream-router"
import { registerTranslations } from "@ordo-pink/stream-translations"
import i18next from "i18next"
import { prop } from "ramda"
import { ComponentType } from "react"
import { mergeMap, BehaviorSubject, mergeAll, Observable } from "rxjs"
import { map, filter, switchMap } from "rxjs/operators"
import { Router } from "silkrouter"

const scopeExtensionContextTo = (
  name: string,
  ctx: ExtensionCreatorContext,
): ExtensionCreatorScopedContext => ({
  ...ctx,
  commands: {
    before: ctx.commands.before,
    after: ctx.commands.after,
    on: ctx.commands.on(name),
    off: ctx.commands.off(name),
    emit: ctx.commands.emit,
  },
  registerActivity: ctx.registerActivity(name),
  unregisterActivity: ctx.unregisterActivity(name),
  registerContextMenuItem: ctx.registerContextMenuItem(name),
  unregisterContextMenuItem: ctx.unregisterContextMenuItem(name),
  registerFileAssociation: ctx.registerFileAssociation(name),
  unregisterFileAssociation: ctx.unregisterFileAssociation(name),
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

type InitExtensionsParams = {
  logger: Logger
  contextMenu$: Observable<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Nullable<{ x: number; y: number; target: any; structure: ContextMenuItem[] }>
  >
  modal$: Observable<Nullable<ComponentType>>
  user$: Observable<UserInfo>
  router$: Router
  activities$: Observable<Activity[]>
  fileAssociations$: Observable<FileAssociation[]>
}

export const _initExtensions = callOnce(
  ({ logger, user$, router$, activities$ }: InitExtensionsParams) =>
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
            commands: {
              before: prependListener,
              after: appendListener,
              on: registerCommand,
              off: unregisterCommand,
              emit: executeCommand,
            },
            registerContextMenuItem,
            unregisterContextMenuItem,
            registerTranslations,
            registerFileAssociation,
            unregisterFileAssociation,
            registerActivity,
            unregisterActivity,
            logger,
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
