import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { useAppDispatch, useAppSelector } from "@client/state"
import { getTags, resetHoveredTag, resetSelectedTags } from "@client/tags/store"

import ActionListItem from "@client/common/action-list-item"
import Tag from "@client/tags/components/tag"

export default function TagsSidebar() {
  const dispatch = useAppDispatch()
  const tree = useAppSelector((state) => state.app.personalDirectory)
  const selectedTags = useAppSelector((state) => state.tags.selectedTags)
  const tags = useAppSelector((state) => state.tags.tags)
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
        text={t("tags.all-tags")}
        isCurrent={hasNoSelectedTag}
        onMouseEnter={() => dispatch(resetHoveredTag())}
        onClick={() => dispatch(resetSelectedTags())}
      >
        <div className="shrink-0 text-xs font-bold font-mono text-neutral-600 dark:text-neutral-400">
          {tagCount}
        </div>
      </ActionListItem>

      {tags.map((tag) => (
        <Tag tag={tag} key={tag.name} />
      ))}
    </div>
  )
}
