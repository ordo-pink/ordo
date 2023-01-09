import { combineReducers, Reducer } from "@reduxjs/toolkit"
import { MouseEvent, useEffect, useState } from "react"
import { Outlet, RouteObject, useLocation, useNavigate } from "react-router-dom"

import AllActivitiesExtension from "$activities/all-activities"
import EditorExtension from "$activities/editor"
import ExtensionStoreExtension from "$activities/extension-store"
import SettingsExtension from "$activities/settings"
import UserExtension from "$activities/user"

import CommandPalette from "$commands/command-palette"
import CreateFileOrDirectory from "$commands/create-file-or-directory"

import ActivityBar from "$containers/activity-bar"
import ContextMenu from "$containers/app/hooks/use-context-menu/components/context-menu"
import { useI18nInit } from "$containers/app/hooks/use-i18n-init"
import { gotDirectory, registeredExtensions } from "$containers/app/store"

import { getExtensionName } from "$core/extensions/utils"
import { isActivityExtension } from "$core/guards/is-extension"
import { router } from "$core/router"
import { reducer, store } from "$core/state"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { ActionContext, UnaryFn } from "$core/types"

import IsmFileAssociation from "$file-associations/ism"
import MdViewerFileAssociation from "$file-associations/md-viewer"

import "$containers/app/index.css"
import { useHotkeys } from "react-hotkeys-hook"

export default function App() {
  const dispatch = useAppDispatch()
  const i18n = useI18nInit()

  const [accelerators, setAccelerators] = useState<Record<string, UnaryFn<ActionContext, void>>>({})

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const activities = useAppSelector((state) => state.app.activityExtensions)
  const overlays = useAppSelector((state) => state.app.overlays)
  const commands = useAppSelector((state) => state.app.commands)
  const state = useAppSelector((state) => state as any)

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
  }, [commands])

  console.log(accelerators)

  useHotkeys(
    Object.keys(accelerators).join(", "),
    (event, handler) => {
      event.preventDefault()
      event.stopPropagation()

      const action = accelerators[handler.key]

      if (action) {
        action({
          state,
          contextMenuTarget: null,
          dispatch,
          env: {} as any,
        })
      }
    },
    [accelerators],
  )

  useEffect(() => {
    if (!i18n || !dispatch || !activities) return

    const extensions = [
      AllActivitiesExtension,
      EditorExtension,
      ExtensionStoreExtension,
      UserExtension,
      SettingsExtension,
      IsmFileAssociation,
      MdViewerFileAssociation,
      CreateFileOrDirectory,
      CommandPalette,
    ]

    const reducers: Record<string, Reducer> = {}

    extensions.forEach((extension) => {
      if (isActivityExtension(extension)) {
        const activityExists = activities.some((activity) => activity.name === extension.name)

        if (activityExists) return

        // Register paths in the router to make activities available
        const paths = extension.paths ? extension.paths : [getExtensionName(extension)]
        const Element = extension.Component

        for (const path of paths) {
          router.routes[0].children?.unshift({
            path,
            element: <Element />,
            hasErrorBoundary: false,
            id: extension.name,
          } as RouteObject)

          if (currentRoute.pathname.startsWith(`/${path}`)) navigate(currentRoute)
        }

        // TODO: Register accelerators for quick activity access
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
    </div>
  )
}
