import { Slice } from "@reduxjs/toolkit"
import { BsLock } from "react-icons/bs"

import { createLoadable } from "$core/extensions/create-loadable"
import { OrdoActivityExtension } from "$core/types"

type Props<Name extends string, Store extends Record<string, unknown>> = Omit<
  OrdoActivityExtension<Name>,
  "Component" | "Icon" | "name" | "storeSlice"
> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: () => Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: () => Promise<any>
  storeSlice?: Slice<Store>
}

export const createActivityExtension = <Name extends string, State extends Record<string, unknown>>(
  name: Name,
  props: Props<Name, State>,
): OrdoActivityExtension<Name> => ({
  ...props,
  name: `ordo-activity-${name}`,
  Component: createLoadable(props.Component),
  Icon: createLoadable(props.Icon, () => <BsLock />, 200),
  storeSlice: props.storeSlice ?? (null as unknown as OrdoActivityExtension<Name>["storeSlice"]),
})
