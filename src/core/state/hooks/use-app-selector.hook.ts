import { EqualityFn, useSelector } from "react-redux"
import { RootState } from "$core/state/types"

export const useAppSelector = <
  WithT extends Record<string, unknown> = Record<string, unknown>,
  Selected = unknown,
>(
  selector: (state: RootState<WithT>) => Selected,
  equalityFn?: EqualityFn<Selected>,
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const result = useSelector(selector, equalityFn)

  return result
}
