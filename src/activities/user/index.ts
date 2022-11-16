import loadable from "@loadable/component"
import { BsPersonBadge } from "react-icons/bs"

import { OrdoActivityExtension } from "$core/types"

const UserExtension: OrdoActivityExtension<"user"> = {
  Component: loadable(() => import("$activities/user/components")),
  Icon: BsPersonBadge,
  name: "ordo-activity-user",
  translations: {
    ru: {
      "@ordo-activity-user/name": "Имя",
    },
    en: {
      "@ordo-activity-user/name": "Name",
    },
  },
}

export default UserExtension
