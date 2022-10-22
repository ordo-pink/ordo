import type { OrdoDirectory } from "@core/app/types"
import type { TagObject } from "@extensions/activities/tags/types"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

import { collectTags } from "@extensions/activities/tags/collect-tags"

export type TagsState = {
  tags: TagObject[]
  hoveredTag: string
  selectedTags: string[]
}

const initialState: TagsState = {
  tags: [],
  hoveredTag: "",
  selectedTags: [],
}

export const tagsSlice = createSlice({
  name: "@activity-bar",
  initialState,
  reducers: {
    getTags: (state: TagsState, action: PayloadAction<OrdoDirectory>) => {
      state.tags = collectTags(action.payload)
    },
    setHoveredTag: (state: TagsState, action: PayloadAction<string>) => {
      state.hoveredTag = action.payload
    },
    resetHoveredTag: (state: TagsState) => {
      state.hoveredTag = ""
    },
    addSelectedTag: (state: TagsState, action: PayloadAction<string>) => {
      state.selectedTags.push(action.payload)
    },
    removeSelectedTag: (state: TagsState, action: PayloadAction<string>) => {
      state.selectedTags.splice(state.selectedTags.indexOf(action.payload), 1)
    },
    setSelectedTags: (state: TagsState, action: PayloadAction<string[]>) => {
      state.selectedTags = action.payload
    },
    resetSelectedTags: (state: TagsState) => {
      state.selectedTags = []
    },
  },
})

export const {
  getTags,
  setHoveredTag,
  resetHoveredTag,
  setSelectedTags,
  resetSelectedTags,
  addSelectedTag,
  removeSelectedTag,
} = tagsSlice.actions

export default tagsSlice.reducer
