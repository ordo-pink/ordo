import { Nullable } from "@ordo-pink/common-types"
import { IOrdoDirectory } from "@ordo-pink/fs-entity"
import type Keycloak from "keycloak-js"
import * as Rx from "rxjs"
import { executeCommand, registerCommand } from "../commands"
import { UserAuth, UserStorage } from "../types"

const getStorage = (auth: UserAuth) =>
  new Promise<UserStorage>((resolve) =>
    resolve({
      totalSize: 0,
      maxUploadSize: 5,
      maxTotalSize: 50,
    }),
  )

const getTree = (auth: UserAuth) =>
  new Promise<IOrdoDirectory>((resolve) => resolve({ path: "/", children: [], readableName: "" }))

const auth$ = new Rx.Subject<Nullable<UserAuth>>()

const unauthenticatedUser$ = Rx.of({
  auth: { isAuthenticated: false } as const,
  extensions: ["http://localhost:7000/asdf/main.js"],
})
const createAuthencticatedUser$ = (auth: UserAuth) =>
  Rx.forkJoin({
    tree: Rx.from(getTree(auth)), // TODO
    storage: Rx.from(getStorage(auth)), // TODO
    auth: Rx.of(auth),
    extensions: Rx.of(["http://localhost:7000/asdf/main.js"]),
  })

const user$ = auth$.pipe(
  Rx.switchMap((auth) =>
    Rx.iif(() => Boolean(auth), createAuthencticatedUser$(auth as UserAuth), unauthenticatedUser$),
  ),
)

// API --------------------------------------------------------------------- //

export const initAuth = (keycloak: Keycloak) => {
  registerCommand<["auth.login", string]>("auth.login", (redirectUri = "/") => {
    const url = keycloak.createLoginUrl({ redirectUri })
    executeCommand("router.open-external", { url, newTab: false })
  })

  registerCommand<["auth.register", string]>("auth.register", (redirectUri = "/") => {
    const url = keycloak.createRegisterUrl({ redirectUri })
    executeCommand("router.open-external", { url, newTab: false })
  })

  registerCommand<["auth.logout", string]>("auth.logout", (redirectUri = "/") => {
    const url = keycloak.createLogoutUrl({ redirectUri })
    executeCommand("router.open-external", { url, newTab: false })
  })

  keycloak.init({ onLoad: "check-sso" }).then(() => {
    const { token, tokenParsed } = keycloak

    auth$.next(token && tokenParsed ? { token, tokenParsed } : null)
  })

  keycloak.onTokenExpired = () => {
    keycloak.updateToken(60).then(() => {
      const { token, tokenParsed } = keycloak

      auth$.next(token && tokenParsed ? { token, tokenParsed } : null)
    })
  }

  return user$
}
