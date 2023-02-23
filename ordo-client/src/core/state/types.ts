import { store } from "$core/state"

export type RootState<WithT extends Record<string, unknown> = Record<string, unknown>> =
  | ReturnType<typeof store.getState> & WithT

export type AppDispatch = typeof store.dispatch
