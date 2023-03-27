import {
  Nullable,
  AuthInfo,
  UserInfo,
  UnaryFn,
  ExtensionCreatorContext,
  ThunkFn,
} from "@ordo-pink/common-types"
import { callOnce } from "@ordo-pink/fns"
import { registerCommand, executeCommand } from "@ordo-pink/stream-commands"
import Keycloak from "keycloak-js"
import { of } from "ramda"
import { BehaviorSubject, Observable, forkJoin, switchMap, iif, tap } from "rxjs"

type InitParams = {
  keycloak: Keycloak
  loggedInExtensions: ThunkFn<
    Promise<{
      default: UnaryFn<ExtensionCreatorContext, void | Promise<void>>
    }>
  >[]
  loggedOutExtensions: ThunkFn<
    Promise<{
      default: UnaryFn<ExtensionCreatorContext, void | Promise<void>>
    }>
  >[]
  onChangeLoginStatus: UnaryFn<Nullable<AuthInfo>, void>
}

const auth$ = new BehaviorSubject<Nullable<AuthInfo>>(null)

const createAuthenticatedUser$ = (
  auth: AuthInfo,
  extensions: Promise<{ default: UnaryFn<ExtensionCreatorContext, void | Promise<void>> }>[],
): Observable<UserInfo> =>
  forkJoin({
    auth: of(auth),
    extensions: of(extensions),
  })

const createUnauthenticatedUser$ = (
  extensions: Promise<{ default: UnaryFn<ExtensionCreatorContext, void | Promise<void>> }>[],
) =>
  of<UserInfo>({
    auth: { isAuthenticated: false },
    extensions: extensions,
  })

export const _initAuth = callOnce(
  ({ keycloak, loggedInExtensions, loggedOutExtensions, onChangeLoginStatus }: InitParams) => {
    const newTab = false

    const on = registerCommand("auth")

    on("login", ({ payload: { redirectUri = "/" }, logger }) => {
      logger.debug('"auth.login" invoked')
      const url = keycloak.createLoginUrl({ redirectUri })
      executeCommand("router.open-external", { url, newTab })
    })

    on("register", ({ payload: { redirectUri = "/" }, logger }) => {
      logger.debug('"auth.register" invoked')
      const url = keycloak.createRegisterUrl({ redirectUri })
      executeCommand("router.open-external", { url, newTab })
    })

    on("logout", ({ payload: { redirectUri = "/" }, logger }) => {
      logger.debug('"auth.logout" invoked')
      const url = keycloak.createLogoutUrl({ redirectUri })
      executeCommand("router.open-external", { url, newTab })
    })

    keycloak.init({ onLoad: "check-sso" }).then((isAuthenticated) => {
      if (isAuthenticated) {
        const { token, tokenParsed } = keycloak
        const authInfo: AuthInfo =
          token && tokenParsed
            ? { isAuthenticated: true, credentials: { token, sub: tokenParsed.sub as string } }
            : { isAuthenticated: false }

        auth$.next(authInfo)
      }
    })

    keycloak.onTokenExpired = () => {
      keycloak.updateToken(300).then(() => {
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
            loggedInExtensions.map((f) => f()),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ),
          createUnauthenticatedUser$(loggedOutExtensions.map((f) => f())),
        ),
      ),
      tap((userInfo) => onChangeLoginStatus(userInfo.auth)),
    )

    return user$
  },
)
