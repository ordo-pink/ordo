import { applyPatches as apply, enablePatches, Patch } from "immer";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { WindowState } from "@core/types";
import { initialState } from "@init/state";

enablePatches();

const state = createSlice({
	name: "state",
	initialState,
	reducers: {
		setState: (_, action: PayloadAction<WindowState>) => action.payload,
		applyStatePatches: (state, action: PayloadAction<Patch[]>) => apply(state, action.payload),
	},
});

export const store = configureStore({
	reducer: state.reducer,
	middleware: (d) => d({ serializableCheck: false }),
});

export const { setState, applyStatePatches } = state.actions;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
