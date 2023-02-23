import type { Activity } from "@client/activity-bar/types"

import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export type ActivityBarState = {
  activities: Activity[]
  readonly requiredActivities: Activity[]
  currentActivity: Activity["name"]
}

const initialState: ActivityBarState = {
  activities: [{ name: "editor", icon: "BsLayoutTextWindow" }],
  requiredActivities: [
    // { icon: "BsBell", name: "notifications" },
    // { icon: "BsPerson", name: "account" },
    // { icon: "BsAward", name: "achievements" },
    // { icon: "BsPuzzle", name: "extensions" },
    { icon: "FaCogs", name: "settings" },
  ],
  currentActivity: "editor",
}

export const activityBarSlice = createSlice({
  name: "@activity-bar",
  initialState,
  reducers: {
    selectActivity: (state, action: PayloadAction<string>) => {
      state.currentActivity = action.payload
    },
    addActivity: (state, action: PayloadAction<Activity>) => {
      const hasProvidedActivity = state.activities.some(
        (activity) => activity.name === action.payload.name
      )

      if (hasProvidedActivity) return

      state.activities.push(action.payload)
    },
  },
})

export const { selectActivity, addActivity } = activityBarSlice.actions

export default activityBarSlice.reducer
