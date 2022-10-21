import { useAppSelector } from "@client/common/hooks/state-hooks"
import Switch from "@client/common/utils/switch"

import Null from "@client/common/null"
import FileExplorer from "@client/file-explorer"
import TagsSidebar from "@client/tags/sidebar"

export const useSidebarComponent = () => {
  const currentActivity = useAppSelector((state) => state.activityBar.currentActivity)

  return Switch.of(currentActivity)
    .case("editor", FileExplorer)
    .case("tags", TagsSidebar)
    .default(Null)
}
