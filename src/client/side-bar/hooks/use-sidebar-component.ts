import { useAppSelector } from "@client/common/hooks/state-hooks"
import Switch from "@client/common/utils/switch"

import Null from "@client/common/null"
import FileExplorer from "@client/file-explorer"
import { Extensions } from "@extensions/index"
import { OrdoActivityExtension } from "@core/types"

export const useSidebarComponent = () => {
  const currentActivity = useAppSelector((state) => state.activityBar.currentActivity)

  let componentSwitch = Switch.of(currentActivity).case("editor", FileExplorer)

  Extensions.forEach((extension) => {
    const isActivityExtension = extension.name.startsWith("ordo-activity-")

    if (!isActivityExtension) return

    const { name, sidebarComponent } = extension as OrdoActivityExtension<string>

    if (!sidebarComponent) return

    componentSwitch = componentSwitch.case(name, sidebarComponent)
  })

  return componentSwitch.default(Null)
}
