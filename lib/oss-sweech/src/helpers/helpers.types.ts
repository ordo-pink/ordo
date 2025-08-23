import type { Instance } from "../sweech.types.ts"

/**
 * Create an empty switch that compares provided values against `true`.
 */
export type OfTrue = <const $Result>() => Instance<true, $Result>

/**
 * Create an empty switch that compares provided values against `false`.
 */
export type OfFalse = <const $Result>() => Instance<false, $Result>
