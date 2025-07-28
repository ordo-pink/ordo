import type * as Session from "./session.types"
import * as fns from "../fns/fns.impl"
import * as timestamp from "../timestamp/timestamp.impl"

export const create: Session.Create = n => [timestamp.create(), n]

export const guard: Session.Guard = (x): x is Session.Instance =>
	fns.is_array(x) && timestamp.guard(x[0]) && fns.is_non_empty_string(x[1])

export const get_issued_at: Session.GetIssuedAt = fns.prop(0)
export const get_name: Session.GetName = fns.prop(1)

export const was_active_in: Session.WasActiveIn = (t, s) => timestamp.create() - s[0] <= t * 1000
