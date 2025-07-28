import * as PERMISSION from "./permission.constants"
import type * as Permission from "./permission.types"
import * as fns from "../fns/fns.impl"

export const full: Permission.Full = () => PERMISSION.VALUE.SUWRX
export const empty: Permission.Empty = () => PERMISSION.VALUE._____

export const guard: Permission.Guard = (x): x is Permission.Instance =>
	fns.is_non_negative_integer(x) && fns.lt(x, PERMISSION.VALUE.length)

export const check_permission: Permission.CheckPermission = (a, p) => !!(p & PERMISSION.MASK & a)
