import { AuthInfo, OrdoDrive } from "@ordo-pink/common-types"
import { OrdoDirectory } from "@ordo-pink/fs-entity"
import { _initAuth } from "@ordo-pink/stream-auth"
import { _initCommands } from "@ordo-pink/stream-commands"
import { _initExtensions } from "@ordo-pink/stream-extensions"
import { _initRouter } from "@ordo-pink/stream-router"
import { _initI18n } from "@ordo-pink/stream-translations"
import Keycloak from "keycloak-js"
import * as ReactDOM from "react-dom/client"
import App from "./app/app"

import "./styles.css"

const getDrivesP = (auth: AuthInfo) =>
  new Promise<OrdoDrive[]>((resolve) =>
    auth && auth.isAuthenticated
      ? resolve([
          { params: { maxTotalSize: 50, maxUploadSize: 5 }, root: OrdoDirectory.empty("/") },
        ])
      : resolve([
          { params: { maxTotalSize: 0, maxUploadSize: 0 }, root: OrdoDirectory.empty("/") },
        ]),
  )

const loggedInExtensions = [import("@ordo-pink/extension-home")]
const loggedOutExtensions = [import("@ordo-pink/extension-home")]

const url = "https://sso.ordo.pink"
const realm = "test"
const clientId = "ordo-web-app"

_initCommands()

const user$ = _initAuth(
  new Keycloak({ url, realm, clientId }),
  loggedInExtensions,
  loggedOutExtensions,
  getDrivesP,
)

const router$ = _initRouter()

_initI18n()

_initExtensions(user$, router$)

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(<App />)
