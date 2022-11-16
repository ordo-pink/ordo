import loadable from "@loadable/component"
import { BsGearWideConnected } from "react-icons/bs"

import { OrdoActivityExtension } from "$core/types"

const SettingsExtension: OrdoActivityExtension<"settings"> = {
  Component: loadable(() => import("$activities/settings/components")),
  Icon: BsGearWideConnected,
  name: "ordo-activity-settings",
  translations: {
    ru: {
      "@ordo-activity-settings/title": "Настройки",
    },
    en: {
      "@ordo-activity-settings/title": "Settings",
    },
  },
}

export default SettingsExtension
