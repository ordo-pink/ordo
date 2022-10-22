import { AppDispatch, RootState } from "@client/store"
import { EqualityFn, TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"

export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useExtensionSelector =
  <WithT>() =>
  <TSelected>(
    selector: (state: RootState<WithT>) => TSelected,
    equalityFn?: EqualityFn<TSelected>
  ) =>
    useSelector(selector, equalityFn)
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
