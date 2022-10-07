import { useAppSelector } from "@client/state"
import Switch from "@core/utils/switch"

import Null from "@client/null"
import FileExplorer from "@client/app/file-explorer"
import TagsSidebar from "@client/tags/sidebar"

export const useSidebarComponent = () => {
  const currentActivity = useAppSelector((state) => state.activityBar.currentActivity)

  return Switch.of(currentActivity)
    .case("editor", FileExplorer)
    .case("tags", TagsSidebar)
    .default(Null)
}
