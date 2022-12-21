import { Slice } from "@reduxjs/toolkit"
import { BsLock } from "react-icons/bs"

import { createLoadable } from "$core/extensions/create-loadable"
import { OrdoFileAssociationExtension } from "$core/types"

type Props<Name extends string, State extends Record<string, unknown>> = Omit<
  OrdoFileAssociationExtension<Name>,
  "Component" | "Icon" | "name" | "storeSlice"
> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: () => Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: () => Promise<any>
  storeSlice?: Slice<State>
}

export const createFileAssociationExtension = <
  Name extends string,
  State extends Record<string, unknown>,
>(
  name: Name,
  props: Props<Name, State>,
): OrdoFileAssociationExtension<Name> => ({
  ...props,
  name: `ordo-file-association-${name}`,
  Component: createLoadable(props.Component),
  Icon: createLoadable(props.Icon, () => <BsLock />, 200),
  storeSlice:
    props.storeSlice ?? (null as unknown as OrdoFileAssociationExtension<Name>["storeSlice"]),
})
