import { EqualityFn, useSelector } from "react-redux"
import { OrdoExtensionType } from "$core/constants/ordo-extension-type"
import { RootState } from "$core/state/types"
import { OrdoExtension } from "$core/types"

export const useAppSelector = <
  WithT extends OrdoExtension<string, OrdoExtensionType>,
  Selected = unknown,
>(
  selector: (
    state: RootState<
      WithT extends void
        ? Record<string, unknown>
        : Record<WithT["name"], ReturnType<WithT["storeSlice"]["getInitialState"]>>
    >,
  ) => Selected,
  equalityFn?: EqualityFn<Selected>,
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const result = useSelector(selector, equalityFn)

  return result
}
