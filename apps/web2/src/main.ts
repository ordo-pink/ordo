import Keycloak from "keycloak-js"
import * as R from "ramda"
import * as Rx from "rxjs"
import { initAuth } from "./auth"
import { executeCommand, registerCommand } from "./commands"
import { navigate, openExternal, router$, route, noMatch } from "./router"
import { registerTranslations } from "./translations"
import { OrdoExtensionProducer, Route } from "./types"
import { refreshContainer } from "./utils/refresh-container"

const SSO_HOST = "https://sso.ordo.pink"
const SSO_REALM = "test"
const SSO_CLIENT_ID = "ordo-web-app"

// TODO: Extract DOM manipulation
// TODO: PersistedStore
// TODO: Add file association creation registerFileAssociations([], ({ fileAssociationContainer, iconContainer }) => { })
// TODO: Add editor plugin creation registerEditorPlugins({ nodes: [], plugins: [] })

const keycloak = new Keycloak({ url: SSO_HOST, realm: SSO_REALM, clientId: SSO_CLIENT_ID })

const user$ = initAuth(keycloak)

const extensionUrls$ = user$.pipe(Rx.map(R.prop("extensions")))

const isFulfilled = <T>(x: PromiseSettledResult<T>): x is PromiseFulfilledResult<T> =>
  x.status === "fulfilled"

const extensionCreators$ = extensionUrls$.pipe(
  Rx.map((exts) => exts.map((ext) => import(ext) as Promise<{ default: OrdoExtensionProducer }>)),
  Rx.mergeMap((exts) => Promise.allSettled(exts)),
  Rx.mergeAll(),
  Rx.filter(isFulfilled),
  Rx.map(R.prop("value")),
  Rx.map(R.prop("default")),
)

const extensions$ = extensionCreators$.pipe(
  Rx.map((creator) =>
    creator({ executeCommand, registerCommand, navigate, openExternal, registerTranslations }),
  ),
)

const rootContainer = document.querySelector("#ordo") as HTMLDivElement
const activityBarContainer = document.querySelector("#activity-bar") as HTMLDivElement

extensions$
  .pipe(
    Rx.map((activity) => {
      const { activities } = activity.init()

      activities.map((activity) =>
        activity.routes.map((r) => {
          router$.pipe(route(r, router$)).subscribe((routeData: Route) => {
            const container = refreshContainer(rootContainer, "activity")
            const iconContainer = refreshContainer(activityBarContainer, `icon-${activity.name}`) // TODO: ADD NAME!

            // const sidebarContainer = refreshContainer(rootContainer, "sidebar")

            activity.render({ container, routeData })
            activity.renderIcon({ container: iconContainer, routeData })
          })
        }),
      )

      router$.pipe(noMatch(router$)).subscribe(() => {
        const activity = refreshContainer(rootContainer, "activity")
        activity.innerHTML = `<h1>404</h1>`
      })
    }),
  )
  .subscribe()
