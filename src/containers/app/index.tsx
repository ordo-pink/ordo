import { combineReducers } from "@reduxjs/toolkit"
import { FC, MouseEvent, useEffect, useState } from "react"
import { Outlet, RouteObject, useLocation, useNavigate } from "react-router-dom"

// import AllActivitiesExtension from "$activities/all-activities"
import EditorExtension from "$activities/editor"
import ExtensionStoreExtension from "$activities/extension-store"
import SettingsExtension from "$activities/settings"
import UserExtension from "$activities/user"

import CreateFileOrDirectory from "$commands/create-file-or-directory"

import ActivityBar from "$containers/activity-bar"
import ContextMenu from "$containers/app/hooks/use-context-menu/components/context-menu"
import DeleteModal from "$containers/app/hooks/use-delete-modal/components"
import { useI18nInit } from "$containers/app/hooks/use-i18n-init"
import { gotDirectory, registeredExtensions } from "$containers/app/store"

import { getExtensionName } from "$core/extensions/utils"
import { isActivityExtension } from "$core/guards/is-extension"
import { router } from "$core/router"
import { reducer, store } from "$core/state"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch"
import { useAppSelector } from "$core/state/hooks/use-app-selector"
import { OrdoLoadableComponent } from "$core/types"
import { Either } from "$core/utils/either"
import { noOp } from "$core/utils/no-op"

import IsmFileAssociation from "$file-associations/ism"
import MdViewerFileAssociation from "$file-associations/md-viewer"

import "$containers/app/index.css"

export default function App() {
  const dispatch = useAppDispatch()
  const i18n = useI18nInit()

  const handleContextMenu = (event: MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()
  }

  const activities = useAppSelector((state) => state.app.activityExtensions)
  const currentRoute = useLocation()
  const navigate = useNavigate()

  const [overlayComponents, setOverlayComponents] = useState<(OrdoLoadableComponent | FC)[]>([])

  useEffect(() => {
    dispatch(gotDirectory("/"))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!i18n || !dispatch || !activities) return

    const extensions = [
      // AllActivitiesExtension,
      EditorExtension,
      ExtensionStoreExtension,
      UserExtension,
      SettingsExtension,
      IsmFileAssociation,
      MdViewerFileAssociation,
      CreateFileOrDirectory,
    ]

    // TODO: Extract to commands
    setOverlayComponents([DeleteModal])

    extensions.forEach((extension) => {
      // Register overlay components to be rendered at the top level of the application
      Either.fromNullable(extension.overlayComponents).fold(noOp, (components) =>
        setOverlayComponents((existingComponents) => [
          ...existingComponents,
          ...(components as OrdoLoadableComponent[]),
        ]),
      )

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
        const newReducer = extension.storeSlice.reducer

        const combinedReducer = combineReducers({
          ...reducer,
          [extension.name]: newReducer,
        })

        store.replaceReducer(combinedReducer)
      }
    })

    // Register installed extensions in the store
    dispatch(registeredExtensions(extensions))
  }, [i18n, dispatch, navigate, currentRoute, activities])

  return (
    <div
      className="app"
      onContextMenu={handleContextMenu}
    >
      <ActivityBar />

      <Outlet />

      <ContextMenu />

      {overlayComponents.map((Component, index) => (
        <Component key={index} />
      ))}
    </div>
  )
}
