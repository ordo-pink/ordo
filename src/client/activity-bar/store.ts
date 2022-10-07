import type { Activity } from "@client/activity-bar/types"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { topActivities } from "@client/activity-bar/activities"

export type ActivityBarState = {
  activities: Activity[]
  currentActivity: Activity["name"]
}

const initialState: ActivityBarState = {
  activities: topActivities,
  currentActivity: "editor",
}

export const activityBarSlice = createSlice({
  name: "@activity-bar",
  initialState,
  reducers: {
    selectActivity: (state: ActivityBarState, action: PayloadAction<string>) => {
      state.currentActivity = action.payload
    },
  },
})

export const { selectActivity } = activityBarSlice.actions

export default activityBarSlice.reducer
