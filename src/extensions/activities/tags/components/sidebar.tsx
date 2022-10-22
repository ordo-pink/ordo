import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import {
  useAppDispatch,
  useAppSelector,
  useExtensionSelector,
} from "@client/common/hooks/state-hooks"
import {
  getTags,
  resetHoveredTag,
  resetSelectedTags,
  TagsState,
} from "@extensions/activities/tags/store"

import ActionListItem from "@client/common/components/action-list-item"
import Tag from "@extensions/activities/tags/components/tag"

export default function TagsSidebar() {
  const select = useExtensionSelector<{ tags: TagsState }>()

  const dispatch = useAppDispatch()
  const tree = useAppSelector((state) => state.app.personalDirectory)
  const selectedTags = select((state) => state.tags.selectedTags)
  const tags = select((state) => state.tags.tags)
  const { t } = useTranslation()

  const [tagCount, setTagCount] = useState(0)

  useEffect(() => {
    const count = tags.reduce((acc, tag) => acc + tag.files.length, 0)

    setTagCount(count)
  }, [tags])

  useEffect(() => {
    if (tree) dispatch(getTags(tree))
  }, [tree])

  const hasNoSelectedTag = selectedTags.length === 0

  return (
    <div>
      <ActionListItem
        icon="BsTags"
        text={t("@tags/all-tags")}
        isCurrent={hasNoSelectedTag}
        onMouseEnter={() => dispatch(resetHoveredTag())}
        onClick={() => dispatch(resetSelectedTags())}
      >
        <div className="shrink-0 text-xs font-bold font-mono text-neutral-600 dark:text-neutral-400">
          {tagCount}
        </div>
      </ActionListItem>

      {tags.map((tag) => (
        <Tag key={tag.name} tag={tag} />
      ))}
    </div>
  )
}
