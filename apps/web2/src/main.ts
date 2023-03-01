import {
  map,
  from,
  mergeMap,
  startWith,
  Subject,
  combineLatestWith,
  scan,
  shareReplay,
  merge,
} from "rxjs"
import { Router, operators } from "silkrouter"
import { AuthenticatedUser, OrdoExtensionProducer, Route } from "./types"
import { refreshContainer } from "./utils/refresh-container"

const { route, noMatch } = operators

const router$ = new Router({
  hashRouting: false,
  init: true,
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const commandStorage$ = new Subject<[string, (arg: any) => void]>()

// commandStorage$  -------1-----2-------3--->
// commandExecutor$ 1---------------2----3--->
// commandQueue$    -------1--------2----3--->

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const addToQueue$ = new Subject<[string, any]>()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const removeFromQueue$ = new Subject<[string, any]>()

const add =
  <T>(value: T) =>
  (state: T[]) =>
    [...state, value]
const remove =
  <T extends [string, unknown]>(value: T) =>
  (state: T[]) =>
    state.filter((item) => item[0] !== value[0] && item[1] !== value[1])

const commandQueue$ = merge(addToQueue$.pipe(map(add)), removeFromQueue$.pipe(map(remove))).pipe(
  scan((acc, v) => v(acc), [] as [string, (arg: unknown) => void][]),
)

const commandExecutor$ = commandQueue$.pipe(
  combineLatestWith(
    commandStorage$.pipe(
      scan(
        (acc, v) => (acc.some((c) => c[0] === v[0]) ? acc : acc.concat([v])),
        [] as [string, (arg: unknown) => void][],
      ),
      shareReplay(1),
    ),
  ),
  map(([queue, commands]) => {
    queue.forEach(([name, payload]) => {
      const command = commands.find((c) => {
        return c && c[0] === name
      })

      if (command) {
        command[1](payload)
        removeFromQueue$.next([name, payload])
      }
    })
  }),
)

commandExecutor$.subscribe()

export function executeCommand(command: string): void
export function executeCommand<T>(command: string, payload: T): void
export function executeCommand(command: string, payload?: unknown) {
  addToQueue$.next([command, payload])
}

export const registerCommand = <T>(command: string, listener: (arg: T) => void) => {
  commandStorage$.next([command, listener])
}

registerCommand("router.navigate", (path: string) => router$.set(path))

const user: AuthenticatedUser = {
  auth: {
    isAuthenticated: true,
    email: "test@test.test",
    username: "test",
    sub: "asdf-adf-asdf-asdf",
  },
  // permissions: { http: {}, fs: {} },
  // settings: {},
  // shares: {},
  storage: {
    totalSize: 0,
    maxUploadSize: 5,
    maxTotalSize: 50,
    tree: { path: "/", children: [], readableName: "" },
  },
  extensions: ["./ext1", "./ext2"],
}

const getUser = () =>
  new Promise<AuthenticatedUser>((resolve, reject) => {
    setTimeout(() => resolve(user), 0)
  })

const user$ = from(getUser()).pipe(
  startWith({
    auth: { isAuthenticated: false },
    extensions: [],
  }),
)

const extensionUrls$ = user$.pipe(map(({ extensions }) => extensions))

const extensionCreators$ = extensionUrls$.pipe(
  map((exts) =>
    exts.map(
      (ext) => import(/* @vite-ignore */ ext) as Promise<{ default: OrdoExtensionProducer }>,
    ),
  ),
  mergeMap((exts) => from(Promise.allSettled(exts))),
  map(
    (x) =>
      x.filter((ext) => ext.status === "fulfilled") as PromiseFulfilledResult<{
        default: OrdoExtensionProducer
      }>[],
  ),
  map((exts) => exts.map((ext) => ext.value)),
  map((exts) => exts.map((x) => x.default)),
)

const extensions$ = extensionCreators$.pipe(
  map((creators) => creators.map((creator) => creator({ executeCommand, registerCommand }))),
)

// const permissions$ = user$.pipe(map((user) => (isUserAuthenticated(user) ? user.permissions : {})))
// const tree$ = user$.pipe(map((user) => (isUserAuthenticated(user) ? user.storage.tree : {})))
// const isUserAuthenticated = (user: User): user is AuthenticatedUser => user.auth.isAuthenticated

const rootContainer = document.querySelector("#ordo") as HTMLDivElement

const activityExtensions$ = extensions$.pipe(map((e) => e.filter((x) => Boolean(x.renderActivity))))

activityExtensions$
  .pipe(
    map((activities) => {
      activities.map((activity) => {
        const { routes } = activity.init()

        router$.pipe(...routes.map((r) => route(r, router$))).subscribe()

        routes.map((r) => {
          router$.pipe(route(r, router$)).subscribe((routeData: Route) => {
            const container = refreshContainer(rootContainer, "activity")

            activity.renderActivity?.({ container, routeData })
          })
        })
      })

      router$.pipe(noMatch(router$)).subscribe(() => {
        const activity = refreshContainer(rootContainer, "activity")
        activity.innerHTML = `<h1>404</h1>`
      })
    }),
  )
  .subscribe()
