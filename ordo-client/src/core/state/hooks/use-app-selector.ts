import { EqualityFn, useSelector } from "react-redux"

import { RootState } from "$core/state/types"

export const useAppSelector = <
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  WithT extends Record<string, any> = Record<string, any>,
  Selected = unknown,
>(
  selector: (state: RootState<WithT>) => Selected,
  equalityFn?: EqualityFn<Selected>,
): Selected => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const result = useSelector(selector, equalityFn)

  return result
}
