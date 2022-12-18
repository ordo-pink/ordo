import { BsLock } from "react-icons/bs"

import { createLoadable } from "$core/extensions/create-loadable"
import { OrdoActivityExtension } from "$core/types"

type Props<T extends string> = Omit<OrdoActivityExtension<T>, "Component" | "Icon" | "name"> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: () => Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: () => Promise<any>
}

export const createActivityExtension = <T extends string>(
  name: T,
  props: Props<T>,
): OrdoActivityExtension<T> => ({
  ...props,
  name: `ordo-activity-${name}`,
  Component: createLoadable(props.Component),
  Icon: createLoadable(props.Icon, () => <BsLock />, 200),
})
