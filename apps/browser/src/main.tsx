import { FSDriver, UnaryFn } from "@ordo-pink/common-types"
import { ConsoleLogger } from "@ordo-pink/logger"
import { clearActivities, _initActivities } from "@ordo-pink/stream-activities"
import { _initAuth } from "@ordo-pink/stream-auth"
import { executeCommand, _initCommands } from "@ordo-pink/stream-commands"
import { hideContextMenu, _initContextMenu } from "@ordo-pink/stream-context-menu"
import { _initDrives } from "@ordo-pink/stream-drives"
import { _initExtensions } from "@ordo-pink/stream-extensions"
import { _initFileAssociations } from "@ordo-pink/stream-file-associations"
import { _initModals } from "@ordo-pink/stream-modals"
import { _initRouter } from "@ordo-pink/stream-router"
import { _initI18n } from "@ordo-pink/stream-translations"
import Keycloak from "keycloak-js"
import { tap } from "ramda"
import * as ReactDOM from "react-dom/client"
import App from "./app/app"
import ContextMenu from "./context-menu"
import Modal from "./modal"

import "./styles.css"

const loggedInExtensions = [
  () => import("@ordo-pink/extension-fs"),
  () => import("@ordo-pink/extension-editor"),
]
const loggedOutExtensions = [() => import("@ordo-pink/extension-home")]

const FS_HOST = process.env.BACKEND_HOST ?? "http://localhost:5000"
const SSO_HOST = process.env.AUTH_HOST
const SSO_REALM = process.env.AUTH_REALM
const SSO_CLIENT_ID = process.env.AUTH_CLIENT_ID

const AUTHORIZATION_HEADER_KEY = "authorization"

const DIRECTORY_API = "fs/directories"
const FILE_API = "fs/files"

const ssoUrl = SSO_HOST ?? "https://sso.ordo.pink"
const realm = SSO_REALM ?? "test"
const clientId = SSO_CLIENT_ID ?? "ordo-web-app"
const fsUrl = FS_HOST.endsWith("/") ? FS_HOST.slice(0, -1) : FS_HOST

const logger = ConsoleLogger

_initCommands({ logger })

const user$ = _initAuth({
  keycloak: new Keycloak({ url: ssoUrl, realm, clientId }),
  loggedInExtensions,
  loggedOutExtensions,
  onChangeLoginStatus: (authInfo) => {
    clearActivities()

    if (authInfo?.isAuthenticated && window.location.pathname === "/") {
      executeCommand("router.navigate", "/editor")
    }

    // TODO: Handle situation when there is no authInfo

    if (authInfo && !authInfo.isAuthenticated && window.location.pathname !== "/") {
      executeCommand("router.navigate", "/")
    }
  },
})

const getFsDriver: UnaryFn<{ token: string; sub: string }, FSDriver> = ({ token, sub }) => ({
  files: {
    create: ({ file, content }) =>
      fetch(`${fsUrl}/${FILE_API}/${sub}${file.path}`, {
        method: "POST",
        body: content,
        headers: {
          [AUTHORIZATION_HEADER_KEY]: `Bearer ${token}`,
        },
      })
        .then(
          tap(() =>
            fetch(`${fsUrl}/${FILE_API}/${sub}${file.path}.metadata`, {
              method: "PUT",
              body: JSON.stringify(file.metadata),
              headers: {
                [AUTHORIZATION_HEADER_KEY]: `Bearer ${token}`,
              },
            }).catch(logger.error),
          ),
        )
        .then((res) => res.json())
        .catch(logger.error),
    get: (path) =>
      fetch(`${fsUrl}/${FILE_API}/${sub}${path}`, {
        headers: {
          [AUTHORIZATION_HEADER_KEY]: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .catch(logger.error),
    set: (file) =>
      fetch(`${fsUrl}/${FILE_API}/${sub}${file.path}.metadata`, {
        method: "PUT",
        body: JSON.stringify(file.metadata),
        headers: {
          [AUTHORIZATION_HEADER_KEY]: `Bearer ${token}`,
        },
      })
        .catch(logger.error)
        .then(() => file),
    getContent: (path) =>
      fetch(`${fsUrl}/${FILE_API}/${sub}${path}`, {
        headers: {
          [AUTHORIZATION_HEADER_KEY]: `Bearer ${token}`,
        },
      }),
    setContent: ({ file, content }) =>
      fetch(`${fsUrl}/${FILE_API}/${sub}${file.path}`, {
        method: "PUT",
        headers: {
          [AUTHORIZATION_HEADER_KEY]: `Bearer ${token}`,
        },
        body: content,
      })
        .then((res) => res.json())
        .catch(logger.error),
    remove: (path) =>
      fetch(`${fsUrl}/${FILE_API}/${sub}${path}`, {
        method: "DELETE",
        headers: {
          [AUTHORIZATION_HEADER_KEY]: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .catch(logger.error),
    move: ({ oldPath, newPath }) =>
      fetch(`${fsUrl}/${FILE_API}/${sub}${oldPath}->${newPath}`, {
        method: "PATCH",
        headers: {
          [AUTHORIZATION_HEADER_KEY]: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .catch(logger.error),
  },
  directories: {
    create: (path) =>
      fetch(`${fsUrl}/${DIRECTORY_API}/${sub}${path}`, {
        method: "POST",
        headers: {
          [AUTHORIZATION_HEADER_KEY]: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .catch(logger.error),
    set: (directory) =>
      fetch(`${fsUrl}/${FILE_API}/${sub}${directory.path}.metadata`, {
        method: "PUT",
        body: JSON.stringify(directory.metadata),
        headers: {
          [AUTHORIZATION_HEADER_KEY]: `Bearer ${token}`,
        },
      })
        .catch(logger.error)
        .then(() => directory),
    get: (path) =>
      fetch(`${fsUrl}/${DIRECTORY_API}/${sub}${path}`, {
        headers: {
          [AUTHORIZATION_HEADER_KEY]: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .catch(logger.error),
    remove: (path) =>
      fetch(`${fsUrl}/${DIRECTORY_API}/${sub}${path}`, {
        method: "DELETE",
        headers: {
          [AUTHORIZATION_HEADER_KEY]: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .catch(logger.error),
    move: ({ oldPath, newPath }) =>
      fetch(`${fsUrl}/${DIRECTORY_API}/${sub}${oldPath}->${newPath}`, {
        method: "PATCH",
        headers: {
          [AUTHORIZATION_HEADER_KEY]: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .catch(logger.error),
  },
})

_initDrives(user$, getFsDriver)

const router$ = _initRouter()
const activities$ = _initActivities()
const fileAssociations$ = _initFileAssociations()
const contextMenu$ = _initContextMenu()

_initI18n()

const modal$ = _initModals(logger)

_initExtensions({ user$, modal$, router$, activities$, fileAssociations$, contextMenu$, logger })

logger.info("Starting the application")

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <div onClick={hideContextMenu}>
    <App />
    <ContextMenu state$={contextMenu$} />
    <Modal />
  </div>,
)
