import { useDispatch } from "react-redux"
import { AppDispatch } from "../types"

export const useAppDispatch = () => useDispatch<AppDispatch>()
