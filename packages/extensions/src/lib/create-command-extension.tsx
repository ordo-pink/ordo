import { ThunkFn } from "@ordo-pink/common-types"
import { Slice } from "@reduxjs/toolkit"
import { createLoadable } from "./create-loadable"
import { OrdoCommandExtension } from "./types"

type Props<
  Name extends string,
  MemoryState extends Record<string, unknown>,
  PersistedState extends Record<string, unknown>,
> = Omit<
  OrdoCommandExtension<Name, MemoryState, PersistedState>,
  "name" | "storeSlice" | "overlayComponents"
> & {
  storeSlice?: Slice<MemoryState>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overlayComponents: ThunkFn<Promise<any>>[]
}

export const createCommandExtension = <
  Name extends string,
  MemoryState extends Record<string, unknown>,
  PersistedState extends Record<string, unknown>,
>(
  name: Name,
  props: Props<Name, MemoryState, PersistedState>,
): OrdoCommandExtension<Name, Record<`ordo-command-${Name}`, MemoryState>, PersistedState> => ({
  ...props,
  name: `ordo-command-${name}`,
  storeSlice:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props.storeSlice as any) ??
    (null as unknown as OrdoCommandExtension<Name, MemoryState, PersistedState>["storeSlice"]),
  overlayComponents: props.overlayComponents.map((component) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createLoadable(component, () => null as any, 200),
  ),
})
