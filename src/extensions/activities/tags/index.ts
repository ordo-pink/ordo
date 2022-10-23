import type { OrdoActivityExtension } from "@core/types"

import { openTagsCommand } from "@extensions/activities/tags/commands/open-tags"
import { tagsSlice } from "@extensions/activities/tags/store"

import TagsSidebar from "@extensions/activities/tags/components/sidebar"
import Tags from "@extensions/activities/tags/components/workspace"

const TagsActivityExtension: OrdoActivityExtension<"tags"> = {
  icon: "BsTags",
  name: "ordo-activity-tags",
  commands: [openTagsCommand],
  translations: {
    ru: {
      tags: "Метки",
      "@tags/all-tags": "Все метки",
      "@tags/open-activity": "Открыть метки",
    },
    en: {
      tags: "Tags",
      "@tags/all-tags": "All tags",
      "@tags/open-activity": "Open Tags",
    },
  },
  sidebarComponent: TagsSidebar,
  workspaceComponent: Tags,
  storeSlice: tagsSlice,
}

export default TagsActivityExtension
