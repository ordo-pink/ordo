import { useEffect } from "react"
import { Outlet, RouteObject, useLocation, useNavigate } from "react-router-dom"

import AllActivitiesExtension from "$activities/all-activities"
import EditorExtension from "$activities/editor"
import ExtensionStoreExtension from "$activities/extension-store"
import SettingsExtension from "$activities/settings"
import UserExtension from "$activities/user"
import ActivityBar from "$containers/activity-bar"
import CreateModal from "$containers/app/components/create-modal"
import { useI18nInit } from "$containers/app/hooks/use-i18n-init"
import { gotDirectory, registerExtensions } from "$containers/app/store"
import { useFSAPI } from "$core/api/fs.adapter"
import { isActivityExtension } from "$core/guards/is-extension.guard"
import { router } from "$core/router"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch.hook"
import { useAppSelector } from "$core/state/hooks/use-app-selector.hook"
import IsmFileAssociation from "$file-associations/ism"
import MdViewerFileAssociation from "$file-associations/md-viewer"

import "$containers/app/index.css"
import { combineReducers } from "@reduxjs/toolkit"
import { reducer, store } from "$core/state"
import { getExtensionName } from "$core/extensions/utils"

export default function App() {
  const dispatch = useAppDispatch()
  const i18n = useI18nInit()

  const fsApi = useFSAPI()

  const activities = useAppSelector((state) => state.app.activityExtensions)
  const currentRoute = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    fsApi.directories.get("/").then((root) => dispatch(gotDirectory(root)))
  }, [])

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
    ]

    extensions.forEach((extension) => {
      if (isActivityExtension(extension)) {
        const activityExists = activities.some((activity) => activity.name === extension.name)

        // TODO: Disallow overriding routes
        if (activityExists) return

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
      }

      Object.keys(extension.translations).forEach((language) => {
        i18n.addResourceBundle(
          language,
          "translation",
          (extension.translations as Record<string, string>)[language],
        )
      })

      if (extension.storeSlice != null) {
        const newReducer = extension.storeSlice.reducer

        const combinedReducer = combineReducers({
          ...reducer,
          [extension.name]: newReducer,
        })

        store.replaceReducer(combinedReducer)
      }
    })

    dispatch(registerExtensions(extensions))
  }, [i18n, dispatch, navigate, currentRoute, activities])

  return (
    <div className="app">
      <ActivityBar />

      <Outlet />

      <CreateModal />
    </div>
  )
}
