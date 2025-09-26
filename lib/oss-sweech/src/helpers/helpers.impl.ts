import type * as T from "./helpers.types"
import { match } from "../sweech.impl"

export const of_true: T.OfTrue = () => match(true)

export const of_false: T.OfFalse = () => match(false)
