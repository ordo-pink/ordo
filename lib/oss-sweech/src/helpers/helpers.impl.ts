import type * as T from "./helpers.types.ts"
import { match } from "../sweech.impl.ts"

export const of_true: T.OfTrue = () => match(true)

export const of_false: T.OfFalse = () => match(false)
