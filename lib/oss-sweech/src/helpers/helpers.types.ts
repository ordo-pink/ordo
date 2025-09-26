import type { Instance } from "../sweech.types"

/**
 * Create an empty switch that compares provided values against `true`.
 */
export type OfTrue = () => Instance<boolean>

/**
 * Create an empty switch that compares provided values against `false`.
 */
export type OfFalse = () => Instance<boolean>
