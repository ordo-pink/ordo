import {
  Nullable,
  AuthInfo,
  UserInfo,
  OrdoDrive,
  UnaryFn,
  ExtensionCreatorContext,
  ExtensionModule,
} from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { registerCommand, executeCommand } from "@ordo-pink/stream-commands"
import Keycloak from "keycloak-js"
import { of } from "ramda"
import { BehaviorSubject, Observable, forkJoin, from, switchMap, iif } from "rxjs"

const auth$ = new BehaviorSubject<Nullable<AuthInfo>>(null)

const createAuthenticatedUser$ = (
  auth: AuthInfo,
  extensions: Promise<{ default: UnaryFn<ExtensionCreatorContext, ExtensionModule> }>[],
  drives: Promise<OrdoDrive[]>,
): Observable<UserInfo> =>
  forkJoin({
    auth: of(auth),
    extensions: of(extensions),
    drives: from(drives),
  })

const createUnauthenticatedUser$ = (
  extensions: Promise<{ default: UnaryFn<ExtensionCreatorContext, ExtensionModule> }>[],
) =>
  of<UserInfo>({
    auth: { isAuthenticated: false },
    drives: [],
    extensions: extensions,
  })

export const _initAuth = callOnce(
  (
    keycloak: Keycloak,
    loggedInExtensions: Promise<{ default: UnaryFn<ExtensionCreatorContext, ExtensionModule> }>[],
    loggedOutExtensions: Promise<{ default: UnaryFn<ExtensionCreatorContext, ExtensionModule> }>[],
    getDrives: UnaryFn<AuthInfo, Promise<OrdoDrive[]>>,
  ) => {
    const newTab = false

    registerCommand("auth.login", (redirectUri = "/") => {
      const url = keycloak.createLoginUrl({ redirectUri })
      executeCommand("router.open-external", { url, newTab })
    })

    registerCommand("auth.register", (redirectUri = "/") => {
      const url = keycloak.createRegisterUrl({ redirectUri })
      executeCommand("router.open-external", { url, newTab })
    })

    registerCommand("auth.logout", (redirectUri = "/") => {
      const url = keycloak.createLogoutUrl({ redirectUri })
      executeCommand("router.open-external", { url, newTab })
    })

    keycloak.init({ onLoad: "check-sso" }).then(() => {
      const { token, tokenParsed } = keycloak
      const authInfo: AuthInfo =
        token && tokenParsed
          ? { isAuthenticated: true, credentials: { token, sub: tokenParsed.sub as string } }
          : { isAuthenticated: false }

      auth$.next(authInfo)
    })

    keycloak.onTokenExpired = () => {
      keycloak.updateToken(60).then(() => {
        const { token, tokenParsed } = keycloak
        const authInfo: AuthInfo =
          token && tokenParsed
            ? { isAuthenticated: true, credentials: { token, sub: tokenParsed.sub as string } }
            : { isAuthenticated: false }

        auth$.next(authInfo)
      })
    }

    const user$ = auth$.pipe(
      switchMap((auth) =>
        iif(
          () => Boolean(auth),
          createAuthenticatedUser$(
            auth as AuthInfo,
            loggedInExtensions,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getDrives((auth as any)?.credentials?.token),
          ),
          createUnauthenticatedUser$(loggedOutExtensions),
        ),
      ),
    )

    return user$
  },
)
