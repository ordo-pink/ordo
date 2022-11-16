import { store } from "."

export type RootState<WithT extends Record<string, unknown> = Record<string, never>> = ReturnType<
  typeof store.getState
> &
  WithT

export type AppDispatch = typeof store.dispatch
