import { applyPatches as apply, enablePatches, Patch } from "immer";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { initialState } from "@init/state";
import { OrdoEvents, WindowState } from "@init/types";

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

export const useInternalDispatch = () => useDispatch<AppDispatch>();
export const useAppDispatch =
	() =>
	<TReturn = void>(action: {
		[K in keyof Partial<OrdoEvents>]: OrdoEvents[K];
	}): TReturn => {
		const key = Object.keys(action)[0] as keyof OrdoEvents;
		return window.ordo.emit(key, action[key]) as unknown as TReturn;
	};
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
