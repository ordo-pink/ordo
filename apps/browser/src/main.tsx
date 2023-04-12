import { ConsoleLogger } from "@ordo-pink/logger"
import { clearActivities, registerActivity, _initActivities } from "@ordo-pink/stream-activities"
import { _initAuth } from "@ordo-pink/stream-auth"
import { registerCommandPaletteItem, _initCommandPalette } from "@ordo-pink/stream-command-palette"
import { executeCommand, registerCommand, _initCommands } from "@ordo-pink/stream-commands"
import { hideContextMenu, _initContextMenu } from "@ordo-pink/stream-context-menu"
import { _initDrives } from "@ordo-pink/stream-drives"
import { _initEditorPlugins } from "@ordo-pink/stream-editor-plugins"
import { _initExtensions } from "@ordo-pink/stream-extensions"
import { _initFileAssociations } from "@ordo-pink/stream-file-associations"
import { _initModals } from "@ordo-pink/stream-modals"
import { _initRouter } from "@ordo-pink/stream-router"
import { registerTranslations, translate, _initI18n } from "@ordo-pink/stream-translations"
import Keycloak from "keycloak-js"
import * as ReactDOM from "react-dom/client"
import { Helmet } from "react-helmet"
import { AiOutlineLogout } from "react-icons/ai"
import { BsPersonCircle } from "react-icons/bs"
import App from "./app/app"
import { useDefaultCommandPalette } from "./command-palette"
import ContextMenu from "./context-menu"
import Modal from "./modal"
import en from "./translations/en.json"
import ru from "./translations/ru.json"
import UserPage from "./user"
import { getFsDriver } from "./utils/get-fs-driver"

import "./styles.css"

// Register extensions --------------------------------------------------------

const loggedInExtensions = [
  () => import("@ordo-pink/extension-fs"),
  () => import("@ordo-pink/extension-editor"),
  // () => import("@ordo-pink/extension-links"),
  () => import("@ordo-pink/extension-kanban"),
  () => import("@ordo-pink/extension-calendar"),
]

const loggedOutExtensions = [() => import("@ordo-pink/extension-home")]

// Define variables -----------------------------------------------------------

const FS_HOST = process.env.BACKEND_HOST ?? "http://localhost:5000"

const ssoUrl = process.env.AUTH_HOST ?? "https://sso.ordo.pink"
const realm = process.env.AUTH_REALM ?? "test"
const clientId = process.env.AUTH_CLIENT_ID ?? "ordo-web-app"

const logger = ConsoleLogger

// Initialise app -------------------------------------------------------------

// Initialise command storage to allow other modules to register commands
_initCommands({ logger })

// Initialise user
const user$ = _initAuth({
  keycloak: new Keycloak({ url: ssoUrl, realm, clientId }),
  loggedInExtensions,
  loggedOutExtensions,
  onChangeLoginStatus: (authInfo) => {
    clearActivities()

    registerActivity("ordo")("user", {
      Component: UserPage,
      Icon: BsPersonCircle,
      routes: ["/user"],
      show: false,
    })

    if (authInfo?.isAuthenticated && window.location.pathname === "/") {
      executeCommand("router.navigate", "/editor")
    }

    // TODO: Handle situation when there is no authInfo

    if (authInfo && !authInfo.isAuthenticated && window.location.pathname !== "/") {
      // TODO: Show "session expired" message
    }
  },
})

const host = FS_HOST.endsWith("/") ? FS_HOST.slice(0, -1) : FS_HOST

_initI18n()
_initDrives(user$, getFsDriver({ host, logger }))
_initModals(logger)
_initEditorPlugins()

const router$ = _initRouter()
const activities$ = _initActivities()
const fileAssociations$ = _initFileAssociations()
const contextMenu$ = _initContextMenu()
const commandPalette$ = _initCommandPalette()

_initExtensions({
  user$,
  router$,
  activities$,
  fileAssociations$,
  contextMenu$,
  logger,
})

registerTranslations("ordo")({ ru, en })

registerCommand("ordo")("support-email", () => {
  executeCommand("router.open-external", { url: `mailto:support@ordo.pink` })
})

registerCommand("ordo")("support-telegram", () => {
  executeCommand("router.open-external", { url: `https://t.me/ordo_pink` })
})

registerCommandPaletteItem({
  id: "ordo.logout",
  name: translate("ordo")("logout"),
  Icon: AiOutlineLogout,
  onSelect: () => executeCommand("auth.logout", "/"),
})

logger.info("Starting the application")

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

const Ordo = () => {
  useDefaultCommandPalette(commandPalette$)

  return (
    <div onClick={hideContextMenu}>
      <Helmet
        titleTemplate="%s | Ordo.pink"
        defaultTitle="Ordo.pink"
      />
      <App />
      <ContextMenu state$={contextMenu$} />
      <Modal />
    </div>
  )
}

root.render(<Ordo />)
