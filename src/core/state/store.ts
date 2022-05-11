import { applyPatches as apply, enablePatches, Patch } from "immer";
import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

import { initialState } from "@init/state";
import { OrdoEvents, WindowState } from "@init/types";

enablePatches();

/**
 * The frontend mirror of the application state stored in the backend. Uses ReduxJS Toolkit.
 */
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

export type Action<TKey extends keyof OrdoEvents = keyof OrdoEvents> = {
	type: TKey;
};

export type ActionWithPayload<TKey extends keyof OrdoEvents = keyof OrdoEvents> = {
	type: TKey;
	payload: OrdoEvents[TKey];
};

export const useInternalDispatch = () => useDispatch<AppDispatch>();
export const useAppDispatch =
	() =>
	<TReturn = void, TKey extends keyof OrdoEvents = keyof OrdoEvents>(
		action: OrdoEvents[TKey] extends null ? Action<TKey> : ActionWithPayload<TKey>,
	): TReturn =>
		window.ordo.emit(action.type, (action as any).payload != null ? (action as any).payload : null) as unknown as TReturn;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
