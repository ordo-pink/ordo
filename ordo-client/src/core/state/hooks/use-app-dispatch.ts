import { useDispatch } from "react-redux"

import { AppDispatch } from "$core/state/types"

export const useAppDispatch = () => useDispatch<AppDispatch>()
