import loadable from "@loadable/component"
import { BsShop } from "react-icons/bs"

import { OrdoActivityExtension } from "$core/types"

const ExtensionStoreExtension: OrdoActivityExtension<"extension-store"> = {
  Component: loadable(() => import("$activities/extension-store/components")),
  Icon: BsShop,
  name: "ordo-activity-extension-store",
  readableName: "@ordo-activity-extension-store/title",
  paths: ["extension-store", "extension-store/:type/:name"],
  translations: {
    ru: {
      "@ordo-activity-extension-store/title": "Расширения",
    },
    en: {
      "@ordo-activity-extension-store/title": "Extensions",
    },
  },
}

export default ExtensionStoreExtension
