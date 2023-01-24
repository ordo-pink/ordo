import { BsLock } from "react-icons/bs"

import { createLoadable } from "$core/extensions/create-loadable"
import { OrdoCommand } from "$core/types"

export const createOrdoCommand = <Prefix extends string = string>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Omit<OrdoCommand<Prefix>, "Icon"> & { Icon: () => Promise<any> },
): OrdoCommand<Prefix> =>
  ({
    ...props,
    Icon: createLoadable(props.Icon, () => <BsLock />, 200),
  } as OrdoCommand<Prefix>)
