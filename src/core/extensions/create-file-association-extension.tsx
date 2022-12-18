import { BsLock } from "react-icons/bs"

import { createLoadable } from "$core/extensions/create-loadable"
import { OrdoFileAssociationExtension } from "$core/types"

type Props<T extends string> = Omit<
  OrdoFileAssociationExtension<T>,
  "Component" | "Icon" | "name"
> & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Icon: () => Promise<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Component: () => Promise<any>
}

export const createFileAssociationExtension = <T extends string>(
  name: T,
  props: Props<T>,
): OrdoFileAssociationExtension<T> => ({
  ...props,
  name: `ordo-file-association-${name}`,
  Component: createLoadable(props.Component),
  Icon: createLoadable(props.Icon, () => <BsLock />, 200),
})
