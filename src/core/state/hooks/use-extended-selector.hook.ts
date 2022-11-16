import { EqualityFn, useSelector } from "react-redux"
import { RootState } from "../types"

export const useExtendedSelector =
  <WithT extends Record<string, unknown>>() =>
  <Selected>(
    selector: (state: RootState<WithT>) => Selected,
    equalityFn?: EqualityFn<Selected>,
  ) => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const result = useSelector(selector, equalityFn)

    return result
  }
