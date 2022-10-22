import type { TagObject } from "@extensions/activities/tags/types"

import React from "react"

import {
  removeSelectedTag,
  addSelectedTag,
  setHoveredTag,
  resetHoveredTag,
  TagsState,
} from "@extensions/activities/tags/store"
import { useAppDispatch, useExtensionSelector } from "@client/common/hooks/state-hooks"

import ActionListItem from "@client/common/action-list-item"

type Props = {
  tag: TagObject
}

export default function Tag({ tag }: Props) {
  const dispatch = useAppDispatch()
  const select = useExtensionSelector<{ tags: TagsState }>()
  const selectedTags = select((state) => state.tags.selectedTags)

  const isCurrent = selectedTags.some((st) => st === tag.name)

  const handleClick = () =>
    dispatch(
      selectedTags.some((st) => st === tag.name)
        ? removeSelectedTag(tag.name)
        : addSelectedTag(tag.name)
    )

  const handleMouseEnter = () => dispatch(setHoveredTag(tag.name))
  const handleMouseLeave = () => dispatch(resetHoveredTag())

  return (
    <ActionListItem
      icon="BsTag"
      text={tag.name}
      onClick={handleClick}
      isCurrent={isCurrent}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="shrink-0 text-xs font-bold font-mono text-neutral-500 dark:text-neutral-400">
        {tag.files.length}
      </div>
    </ActionListItem>
  )
}
