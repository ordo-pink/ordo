import { useEffect } from "react"
import { Outlet, RouteObject, useLocation, useNavigate } from "react-router-dom"

import AllActivitiesExtension from "$activities/all-activities"
import EditorExtension from "$activities/editor"
import SettingsExtension from "$activities/settings"
import UserExtension from "$activities/user"
import ActivityBar from "$containers/activity-bar"
import { useI18nInit } from "$containers/app/hooks/use-i18n-init"
import { registerExtensions } from "$containers/app/store"
import { isActivityExtension } from "$core/guards/is-extension.guard"
import { router } from "$core/router"
import { useAppDispatch } from "$core/state/hooks/use-app-dispatch.hook"

import "$containers/app/index.css"
import { useAppSelector } from "$core/state/hooks/use-app-selector.hook"

export default function App() {
  useI18nInit()

  const dispatch = useAppDispatch()
  const i18n = useI18nInit()

  const activities = useAppSelector((state) => state.app.activityExtensions)
  const currentRoute = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    if (!i18n || !dispatch || !activities) return

    const extensions = [AllActivitiesExtension, EditorExtension, UserExtension, SettingsExtension]

    extensions.forEach((extension) => {
      if (isActivityExtension(extension)) {
        const activityExists = activities.some((activity) => activity.name === extension.name)

        if (activityExists) return

        const path = extension.name.replace("ordo-activity-", "")
        const Element = extension.Component

        router.routes[0].children?.unshift({
          path,
          element: <Element />,
          hasErrorBoundary: false,
          id: extension.name,
        } as RouteObject)

        if (currentRoute.pathname.startsWith(`/${path}`)) {
          navigate(currentRoute)
        }
      }

      Object.keys(extension.translations).forEach((language) => {
        i18n.addResourceBundle(
          language,
          "translation",
          (extension.translations as Record<string, string>)[language],
        )
      })
    })

    dispatch(registerExtensions(extensions))
  }, [i18n, dispatch])

  return (
    <div className="app">
      <ActivityBar />
      <Outlet />
    </div>
  )
}
