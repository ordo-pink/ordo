import { Slice } from "@reduxjs/toolkit"
import React from "react"
import { BsLock } from "react-icons/bs"
import { createLoadable } from "./create-loadable"
import { OrdoFileAssociationExtension } from "./types"

type Props<
  Name extends string,
  MemoryState extends Record<string, unknown>,
  PersistedState extends Record<string, unknown>,
> = Omit<
  OrdoFileAssociationExtension<Name, MemoryState, PersistedState>,
  "Component" | "Icon" | "name" | "storeSlice"
> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: () => Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: () => Promise<any>
  storeSlice?: Slice<MemoryState>
}

export const createFileAssociationExtension = <
  Name extends string,
  MemoryState extends Record<string, unknown>,
  PersistedState extends Record<string, unknown>,
>(
  name: Name,
  props: Props<Name, Record<`ordo-file-association-${Name}`, MemoryState>, PersistedState>,
): OrdoFileAssociationExtension<Name, MemoryState, PersistedState> => ({
  ...props,
  name: `ordo-file-association-${name}`,
  Component: createLoadable(props.Component),
  Icon: createLoadable(props.Icon, () => <BsLock />, 200),
  storeSlice:
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (props.storeSlice as any) ??
    (null as unknown as OrdoFileAssociationExtension<
      Name,
      MemoryState,
      PersistedState
    >["storeSlice"]),
})
