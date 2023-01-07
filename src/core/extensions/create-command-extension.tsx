import { Slice } from "@reduxjs/toolkit"
import { BsLock } from "react-icons/bs"

import { createLoadable } from "$core/extensions/create-loadable"
import { OrdoCommand, OrdoCommandExtension, ThunkFn } from "$core/types"

type Props<Name extends string, State extends Record<string, unknown>> = Omit<
  OrdoCommandExtension<Name>,
  "name" | "storeSlice" | "overlayComponents" | "commands"
> & {
  storeSlice?: Slice<State>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  overlayComponents: ThunkFn<Promise<any>>[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  commands: (Omit<OrdoCommand<string>, "Icon"> & { Icon?: () => Promise<any> })[]
}

export const createCommandExtension = <Name extends string, State extends Record<string, unknown>>(
  name: Name,
  props: Props<Name, State>,
): OrdoCommandExtension<Name> =>
  ({
    ...props,
    name: `ordo-command-${name}`,
    storeSlice: props.storeSlice ?? (null as unknown as OrdoCommandExtension<Name>["storeSlice"]),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    overlayComponents: props.overlayComponents.map((component: () => Promise<any>) =>
      createLoadable(component),
    ),
    commands: props.commands.map((command) => {
      if (command.Icon) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        command.Icon = createLoadable(command.Icon, () => <BsLock />, 200) as any
      }

      return command
    }),
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)
