import loadable from "@loadable/component"
import { BsCollection } from "react-icons/bs"

import { OrdoActivityExtension } from "$core/types"

const AllActivitiesExtension: OrdoActivityExtension<"all-activities"> = {
  Component: loadable(() => import("$activities/all-activities/components")),
  Icon: BsCollection,
  name: "ordo-activity-all-activities",
  readableName: "@ordo-activity-all-activities/title",
  translations: {
    ru: {
      "@ordo-activity-all-activities/title": "Установленные расширения",
    },
    en: {
      "@ordo-activity-all-activities/title": "All installed extensions",
    },
  },
}

export default AllActivitiesExtension
