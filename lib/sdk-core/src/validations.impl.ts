import type { Core } from "./sdk-core.types"
import { RX_UUID_V4 } from "./constants"

export const is_string = (x: unknown): x is string => typeof x === "string"
export const is_number = (x: unknown): x is number => typeof x === "number"
export const is_0 = (x: unknown): x is 0 => x === 0
export const is_positive_number = (x: unknown): x is number => is_number(x) && x > 0
export const is_non_negative_number = (x: unknown): x is number => is_0(x) || is_positive_number(x)
export const is_finite = (x: unknown): x is number => Number.isFinite(x)
export const is_int = (x: unknown): x is number => Number.isInteger(x)
export const is_finite_non_negative_int = (x: unknown): x is number => is_non_negative_number(x) && is_finite(x) && is_int(x)
export const is_uuid = (x: unknown): x is Core.UUIDv4 => is_string(x) && RX_UUID_V4.test(x)
export const is_array = Array.isArray
