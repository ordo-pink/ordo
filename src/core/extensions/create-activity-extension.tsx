import { Slice } from "@reduxjs/toolkit"
import { BsLock } from "react-icons/bs"

import { createLoadable } from "$core/extensions/create-loadable"
import { OrdoActivityExtension, OrdoCommand } from "$core/types"

type Props<Name extends string, Store extends Record<string, unknown>> = Omit<
  OrdoActivityExtension<Name>,
  "Component" | "Icon" | "name" | "storeSlice" | "commands"
> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: () => Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: () => Promise<any>
  storeSlice?: Slice<Store>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commands?: (Omit<OrdoCommand<string>, "Icon"> & { Icon?: () => Promise<any> })[]
}

export const createActivityExtension = <Name extends string, State extends Record<string, unknown>>(
  name: Name,
  props: Props<Name, State>,
): OrdoActivityExtension<Name> => ({
  ...props,
  name: `ordo-activity-${name}`,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: createLoadable(props.Component, () => null as any),
  Icon: createLoadable(props.Icon, () => <BsLock />, 200),
  storeSlice: props.storeSlice ?? (null as unknown as OrdoActivityExtension<Name>["storeSlice"]),
  commands:
    props.commands &&
    (props.commands.map((command) => {
      if (command.Icon) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        command.Icon = createLoadable(command.Icon as any, () => <BsLock />, 200) as any
      }

      return command
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any),
})
