import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { enablePatches, applyPatches as apply, Patch } from "immer";

import application from "@modules/application/initial-state";
import commander from "@containers/commander/initial-state";
import activities from "@containers/activity-bar/initial-state";
import sidebar from "@containers/sidebar/initial-state";
import workspace from "@containers/workspace/initial-state";
import { WindowState } from "@core/types";

enablePatches();

const initialState: WindowState = {
	application,
	commander,
	activities,
	sidebar,
	workspace,
	components: {},
};

const state = createSlice({
	name: "state",
	initialState,
	reducers: {
		setState: (_, action: PayloadAction<WindowState>) => action.payload,
		applyPatches: (state, action: PayloadAction<Patch[]>) => apply(state, action.payload),
	},
});

export const store = configureStore({
	reducer: state.reducer,
	middleware: (d) => d({ serializableCheck: false }),
});

export const { setState, applyPatches } = state.actions;

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
