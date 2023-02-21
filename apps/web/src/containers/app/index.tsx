import { OrdoExtensionType } from "@ordo-pink/common-types"
import { combineReducers, Reducer } from "@reduxjs/toolkit"
import { MouseEvent, useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import { useHotkeys } from "react-hotkeys-hook"
import { Outlet, RouteObject, useLocation, useNavigate } from "react-router-dom"

// import AllActivitiesExtension from "$activities/all-activities"
import EditorExtension from "../../activities/editor"
// import ExtensionStoreExtension from "../../activities/extension-store"
import { EditorActivityState } from "../../activities/editor/types"
import Features from "../../activities/features"
import Home from "../../activities/home"
import Pricing from "../../activities/pricing"
import SettingsExtension from "../../activities/settings"
import UserExtension from "../../activities/user"

import AuthCommands from "../../commands/auth"
import CommandPalette from "../../commands/command-palette"
import FileSystemCommands from "../../commands/file-system"
import OpenFile from "../../commands/open-file"
import UserSupportCommands from "../../commands/user-support"

import ActivityBar from "../../containers/activity-bar"
import ContextMenu from "../../containers/app/hooks/use-context-menu/components/context-menu"
import { useI18n } from "../../containers/app/hooks/use-i18n"
import { useSystemCommands } from "../../containers/app/hooks/use-system-commands/use-system-commands"
import { gotDirectory, registerExtensions } from "../../containers/app/store"

import { useKeycloak } from "../../core/auth/hooks/use-keycloak"
import { createExtensionPersistedState } from "../../core/extensions/create-extension-metadata"
import { isActivityExtension } from "../../core/guards/is-extension"
import { useActionContext } from "../../core/hooks/use-action-context"
import { useCommandIconButton } from "../../core/hooks/use-command-icon-button"
import { router } from "../../core/router"
import { reducer, store } from "../../core/state"
import { useAppDispatch } from "../../core/state/hooks/use-app-dispatch"
import { useAppSelector } from "../../core/state/hooks/use-app-selector"
import { useExtensionSelector } from "../../core/state/hooks/use-extension-selector"
import { OrdoExtension, OrdoExtensionName } from "../../core/types"

import AutolinkPlugin from "../../editor-plugins/autolink"
import HighlightCodePlugin from "../../editor-plugins/highlight-code"
import ToolbarPlugin from "../../editor-plugins/toolbar"

import ImgFileExtension from "../../file-associations/img"
import MdFileExtension from "../../file-associations/md"
import MediaEditor from "../../file-associations/media"
import PDFFileExtension from "../../file-associations/pdf"

const loggedInExtensions = [
  // AllActivitiesExtension,
  EditorExtension,
  UserExtension,
  SettingsExtension,
  MdFileExtension,
  FileSystemCommands,
  CommandPalette,
  OpenFile,
  UserSupportCommands,
  AuthCommands,
  ImgFileExtension,
  PDFFileExtension,
  MediaEditor,
  ToolbarPlugin,
  HighlightCodePlugin,
  AutolinkPlugin,
]

const loggedOutExtensions = [
  AuthCommands,
  CommandPalette,
  Home,
  Features,
  Pricing,
  UserSupportCommands,
  ToolbarPlugin,
  HighlightCodePlugin,
  AutolinkPlugin,
]

export default function App() {
  const dispatch = useAppDispatch()
  const i18n = useI18n()

  const editorSelector = useExtensionSelector<EditorActivityState>()

  // const [accelerators, setAccelerators] = useState<Record<string, UnaryFn<ActionContext, void>>>({})
  const [extensions, setExtensions] = useState<OrdoExtension<string, OrdoExtensionType>[]>([])
  const currentFile = editorSelector((state) => state?.["ordo-activity-editor"]?.currentFile)

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const activities = useAppSelector((state) => state.app.activityExtensions)
  const overlays = useAppSelector((state) => state.app.overlays)
  const commands = useAppSelector((state) => state.app.commands)
  const { keycloak } = useKeycloak()

  const actionContext = useActionContext()

  const isAuthenticated = keycloak.authenticated

  const currentRoute = useLocation()
  const navigate = useNavigate()

  const accelerators = useSystemCommands(extensions, commands, currentFile)

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(gotDirectory("/"))

      setExtensions(loggedInExtensions)
    } else {
      setExtensions(loggedOutExtensions)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated])

  useHotkeys(
    Object.keys(accelerators).join(", "),
    (event, handler) => {
      event.preventDefault()
      event.stopPropagation()

      const action = accelerators[handler.key]

      action && action(actionContext)
    },
    [accelerators],
  )

  const CommandPaletteIcon = useCommandIconButton(
    CommandPalette,
    "@ordo-command-command-palette/show-command-palette",
  )

  useEffect(() => {
    if (!i18n || !dispatch || !activities) return

    const reducers: Record<string, Reducer> = {}

    extensions.forEach((extension) => {
      if (isActivityExtension(extension)) {
        const activityExists = activities.some((activity) => activity.name === extension.name)

        if (activityExists) return

        // Register paths in the router to make activities available
        const Element = extension.Component

        const persistedStore = createExtensionPersistedState(
          extension.name as OrdoExtensionName,
          extension.persistedState,
        )

        for (const path of extension.routes) {
          if (persistedStore) {
            persistedStore.init().then(() => {
              router.routes[0].children?.unshift({
                path,
                element: (
                  <Element
                    persistedStore={persistedStore}
                    selector={() => null} // TODO
                    translate={() => null} // TODO
                  />
                ),
                hasErrorBoundary: false,
                id: extension.name,
              } as RouteObject)

              if (currentRoute.pathname.startsWith(`/${path}`)) {
                currentRoute.hash = ""
                navigate(currentRoute)
              }
            })
          } else {
            router.routes[0].children?.unshift({
              path,
              element: (
                <Element
                  persistedStore={null} // TODO
                  selector={() => null} // TODO
                  translate={() => null} // TODO
                />
              ),
              hasErrorBoundary: false,
              id: extension.name,
            } as RouteObject)

            if (currentRoute.pathname.startsWith(`/${path}`)) {
              currentRoute.hash = ""
              navigate(currentRoute)
            }
          }
        }
      }

      if (extension.translations) {
        // Register translations for i18n
        Object.keys(extension.translations).forEach((language) => {
          i18n.addResourceBundle(
            language,
            "translation",
            (extension.translations as Record<string, string>)[language],
          )
        })
      }

      if (extension.storeSlice != null) {
        // Register extension store slice
        reducers[extension.name] = extension.storeSlice.reducer
      }
    })

    if (currentRoute.pathname === "/") {
      navigate(isAuthenticated ? "/editor" : "/home")
    }

    const combinedReducer = combineReducers({
      ...reducer,
      ...reducers,
    })

    store.replaceReducer(combinedReducer)

    // Register installed extensions in the store
    dispatch(registerExtensions(extensions))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extensions, isAuthenticated])

  return (
    <div
      className="bg-neutral-50 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200 flex flex-col min-h-screen"
      onContextMenu={handleContextMenu}
    >
      <Helmet>
        <title>{"Ordo.pink"}</title>
      </Helmet>

      <ActivityBar />

      <Outlet />

      <ContextMenu />

      {overlays.map((Component, index) => (
        <Component key={index} />
      ))}

      <div
        className="fixed top-5 right-5 cursor-pointer hover:text-pink-600 transition-colors duration-200"
        role="none"
      >
        <CommandPaletteIcon />
      </div>
    </div>
  )
}
