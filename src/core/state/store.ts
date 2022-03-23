import { activityBarReducer, activityBarSlice, ActivityBarState } from "@modules/activity-bar/activity-bar-slice";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { applyPatches as apply, enablePatches, Patch } from "immer";

enablePatches();

export type State = {
	activityBar: ActivityBarState;
};

// export const initialState: State = {
// 	activityBar: acitivityBarInitialState,
// };

// const state = createSlice({
// 	name: "state",
// 	initialState,
// 	reducers: {
// 		setState: (_, action: PayloadAction<State>) => action.payload,
// 		applyPatches: (state, action: PayloadAction<Patch[]>) => apply(state, action.payload),
// 	},
// });

export const store = configureStore({
	reducer: {
		activityBar: activityBarReducer,
	},
	middleware: (d) => d({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
