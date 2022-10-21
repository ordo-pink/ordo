import { useAppSelector } from "@client/common/hooks/state-hooks"
import Switch from "@client/common/utils/switch"

import Checkboxes from "@client/checkboxes"
import Settings from "@client/settings"
import Null from "@client/common/null"
import Editor from "@client/editor"
import Tags from "@client/tags"

export const useWorkspaceComponent = () => {
  const currentActivity = useAppSelector((state) => state.activityBar.currentActivity)

  return Switch.of(currentActivity)
    .case("editor", Editor)
    .case("checkboxes", Checkboxes)
    .case("settings", Settings)
    .case("tags", Tags)
    .default(Null)
}
