import type { TagObject } from "@client/tags/types"

import React from "react"

import {
  removeSelectedTag,
  addSelectedTag,
  setHoveredTag,
  resetHoveredTag,
} from "@client/tags/store"
import { useAppDispatch, useAppSelector } from "@client/common/hooks/state-hooks"

import ActionListItem from "@client/common/action-list-item"

type Props = {
  tag: TagObject
}

export default function Tag({ tag }: Props) {
  const dispatch = useAppDispatch()
  const selectedTags = useAppSelector((state) => state.tags.selectedTags)

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
