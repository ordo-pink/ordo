import React, { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"

import { useAppDispatch, useAppSelector } from "@client/state"
import {
  addSelectedTag,
  getTags,
  removeSelectedTag,
  resetHoveredTag,
  resetSelectedTags,
  setHoveredTag,
} from "@client/tags/store"

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

  const activeClass =
    "hover:bg-gradient-to-r hover:from-rose-300 hover:dark:from-violet-700 hover:to-purple-300 hover:dark:to-purple-700 bg-gradient-to-r from-rose-300 dark:from-violet-700 to-purple-300 dark:to-purple-700"
  const hasNoSelectedTag = selectedTags.length === 0

  return (
    <div>
      <div
        onMouseEnter={() => dispatch(resetHoveredTag())}
        onClick={() => dispatch(resetSelectedTags())}
        className={`flex items-center justify-between text-sm px-4 py-1 hover-passive rounded-md cursor-pointer ${
          hasNoSelectedTag && activeClass
        }`}
      >
        <div className="truncate shrink-0">{t("tags.all-tags")}</div>
        <div className="shrink-0 text-xs font-bold font-mono text-neutral-600 dark:text-neutral-400">
          {tagCount}
        </div>
      </div>
      {tags.map((tag) => (
        <div
          key={tag.name}
          onMouseEnter={() => dispatch(setHoveredTag(tag.name))}
          onMouseLeave={() => dispatch(resetHoveredTag())}
          onClick={() =>
            dispatch(
              selectedTags.some((st) => st === tag.name)
                ? removeSelectedTag(tag.name)
                : addSelectedTag(tag.name)
            )
          }
          className={`flex items-center justify-between text-sm px-4 py-1 hover-passive rounded-md cursor-pointer ${
            selectedTags.some((st) => st === tag.name) && activeClass
          }`}
        >
          <div className="truncate shrink-0">{tag.name}</div>

          <div className="shrink-0 text-xs font-bold font-mono text-neutral-500 dark:text-neutral-400">
            {tag.files.length}
          </div>
        </div>
      ))}
    </div>
  )
}
