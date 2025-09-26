export const is_nan = Number.isNaN

export const is_non_empty_string = (x: any): x is string => is_string(x) && x.trim() !== ""

export const is_0 = (x: any): x is 0 => x === 0
export const is_number = (x: any): x is number => typeof x === "number"
export const is_finite = (x: any): x is number => Number.isFinite(x)

export const is_positive_number = (x: any): x is number => is_number(x) && x > 0
export const is_negative_number = (x: any): x is number => is_number(x) && x >= 0
export const is_non_negative_number = (x: any): x is number => is_number(x) && (is_0(x) || is_positive_number(x))

export const is_float = (x: any): x is number => is_number(x) && is_finite(x) && x % 1 !== 0
export const is_positive_float = (x: any): x is number => is_positive_number(x) && is_float(x)
export const is_negative_float = (x: any): x is number => is_negative_number(x) && is_float(x)
export const is_non_negative_float = (x: any): x is number => is_float(x) && (is_0(x) || is_positive_number(x))

export const is_integer = (x: any): x is number => Number.isInteger(x)
export const is_positive_integer = (x: any): x is number => is_positive_number(x) && is_integer(x)
export const is_negative_integer = (x: any): x is number => is_negative_number(x) && is_integer(x)
export const is_non_negative_integer = (x: any): x is number => is_integer(x) && (is_0(x) || is_positive_number(x))

export const is_undefined = (x: any): x is undefined => typeof x === "undefined"
export const is_null = (x: any): x is null => typeof x === "object" && !x
export const is_string = (x: any): x is string => typeof x === "string"
export const is_array = Array.isArray
export const is_fn = (x: any): x is (...args: any[]) => any => typeof x === "function"
export const is_object = (x: any): x is Record<string, any> => x != null && typeof x === "object" && !is_array(x)
