import { Slice } from "@reduxjs/toolkit"
import { BsLock } from "react-icons/bs"
import { createLoadable } from "./create-loadable"
import { OrdoActivityExtension, OrdoCommand } from "./types"

type Props<
  Name extends string,
  MemoryState extends Record<string, unknown>,
  PersistedState extends Record<string, unknown>,
> = Omit<
  OrdoActivityExtension<string, MemoryState, PersistedState>,
  "Component" | "Icon" | "name" | "storeSlice" | "commands"
> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: () => Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: () => Promise<any>
  storeSlice?: Slice<MemoryState>
  commands?: OrdoCommand<`ordo-activity-${Name}`>[]
}

export const createActivityExtension = <
  Name extends string,
  MemoryState extends Record<string, unknown>,
  PersistedState extends Record<string, unknown>,
>(
  name: Name,
  props: Props<Name, MemoryState, PersistedState>,
): OrdoActivityExtension<Name, MemoryState, PersistedState> => ({
  ...props,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commands: props.commands as any,
  name: `ordo-activity-${name}`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: createLoadable(props.Component, () => null as any),
  Icon: createLoadable(props.Icon, () => <BsLock />, 200),
  routes: props.routes.map((route) => (route.startsWith("/") ? route.slice(1) : route)),
  storeSlice:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props.storeSlice as any) ??
    (null as unknown as OrdoActivityExtension<Name, MemoryState, PersistedState>["storeSlice"]),
})
