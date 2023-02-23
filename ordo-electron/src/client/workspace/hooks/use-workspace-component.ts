import type { OrdoActivityExtension } from "@core/types"

import { useAppSelector } from "@client/common/hooks/state-hooks"
import { Extensions } from "@extensions/index"
import Switch from "@client/common/utils/switch"

import Null from "@client/common/components/null"
import Editor from "@client/editor"
import Settings from "@client/settings"

export const useWorkspaceComponent = () => {
  const currentActivity = useAppSelector((state) => state.activityBar.currentActivity)

  let componentSwitch = Switch.of(currentActivity).case("editor", Editor).case("settings", Settings)

  Extensions.forEach((extension) => {
    const isActivityExtension = extension.name.startsWith("ordo-activity-")

    if (!isActivityExtension) return

    const { name, workspaceComponent } = extension as OrdoActivityExtension<string>

    if (!workspaceComponent) return

    componentSwitch = componentSwitch.case(name, workspaceComponent)
  })

  return componentSwitch.default(Null)
}
