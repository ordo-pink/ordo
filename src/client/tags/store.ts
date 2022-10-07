import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { OrdoFolder } from "@core/app/types"
import { collectTags } from "./collect-tags"
import { TagObject } from "./types"

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
    getTags: (state: TagsState, action: PayloadAction<OrdoFolder>) => {
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
