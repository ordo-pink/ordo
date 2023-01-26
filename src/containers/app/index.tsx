import { combineReducers, Reducer } from "@reduxjs/toolkit"
import { MouseEvent, useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import { Outlet, RouteObject, useLocation, useNavigate } from "react-router-dom"

// import AllActivitiesExtension from "$activities/all-activities"
import EditorExtension from "$activities/editor"
// import ExtensionStoreExtension from "$activities/extension-store"
// import SettingsExtension from "$activities/settings"
import { EditorExtensionStore } from "$activities/editor/types"
import UserExtension from "$activities/user"

import AuthCommands from "$commands/auth"
import CommandPalette from "$commands/command-palette"
import FileSystemCommands from "$commands/file-system"
import UserSupportCommands from "$commands/user-support"

import ActivityBar from "$containers/activity-bar"
import ContextMenu from "$containers/app/hooks/use-context-menu/components/context-menu"
import { useI18nInit } from "$containers/app/hooks/use-i18n-init"
import { gotDirectory, registeredExtensions } from "$containers/app/store"

import { isActivityExtension } from "$core/guards/is-extension"
import { useActionContext } from "$core/hooks/use-action-context"
import { useCommandIconButton } from "$core/hooks/use-command-icon-button"
import { router } from "$core/router"
import { reducer, store } from "$core/state"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { useExtensionSelector } from "$core/state/hooks/use-extension-selector"
import { ActionContext, UnaryFn } from "$core/types"

import MdFileExtension from "$file-associations/md"

import "$containers/app/index.css"

const extensions = [
  // AllActivitiesExtension,
  EditorExtension,
  // ExtensionStoreExtension,
  UserExtension,
  // SettingsExtension,
  MdFileExtension,
  FileSystemCommands,
  CommandPalette,
  UserSupportCommands,
  AuthCommands,
]

export default function App() {
  const dispatch = useAppDispatch()
  const i18n = useI18nInit()

  const editorSelector = useExtensionSelector<EditorExtensionStore>()

  const [accelerators, setAccelerators] = useState<Record<string, UnaryFn<ActionContext, void>>>({})
  const currentFile = editorSelector((state) => state?.["ordo-activity-editor"]?.currentFile)

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const activities = useAppSelector((state) => state.app.activityExtensions)
  const overlays = useAppSelector((state) => state.app.overlays)
  const commands = useAppSelector((state) => state.app.commands)

  const actionContext = useActionContext()

  const currentRoute = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(gotDirectory("/"))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const keybindings: Record<string, UnaryFn<ActionContext, void>> = {}

    commands.forEach((command) => {
      if (command.accelerator) {
        keybindings[command.accelerator] = command.action
      }
    })

    setAccelerators(() => keybindings)
  }, [commands, currentFile])

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

        for (const path of extension.routes) {
          router.routes[0].children?.unshift({
            path,
            element: <Element />,
            hasErrorBoundary: false,
            id: extension.name,
          } as RouteObject)

          if (currentRoute.pathname.startsWith(`/${path}`)) navigate(currentRoute)
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

    const combinedReducer = combineReducers({
      ...reducer,
      ...reducers,
    })

    store.replaceReducer(combinedReducer)

    // Register installed extensions in the store
    dispatch(registeredExtensions(extensions))

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div
      className="app"
      onContextMenu={handleContextMenu}
    >
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
