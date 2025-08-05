/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { result } from "@ordo-pink/oss-result"

import * as USER from "./user.constants"
import * as User from "./user.types"
import * as fns from "../fns/fns.impl"
import * as sem_ver from "../sem-ver/semver.impl"
import * as timestamp from "../timestamp/timestamp.impl"
import * as uuid from "../uuid/uuid.impl"

export const create_ref: User.CreateRef = (id, email) => email.split("@")[0].concat(id.split("-")[0])
export const create: User.Create = (email, ref, name = default_name(), sub = default_subscription(), ifs = [], p = null) =>
	result
		.of(uuid.create())
		.pipe(result.ops.chain(id => result.merge({ id, t: timestamp.create(), ref: ref ?? create_ref(id, email) })))
		.pipe(result.ops.map(({ ref, id, t }) => [id, ref, name, sub, t, t, email, ifs, [], p, []] satisfies User.Instance))
		.cata(result.catas.expect(fns.v)) // Never gonna happen

export const default_name: User.DefaultName = () => ""
export const default_subscription: User.DefaultSubscription = () => USER.SUBSCRIPTION.FREE

export const handle_guard: User.RefGuard = (x): x is User.Ref => fns.is_string(x) && USER.RX.HANDLE.test(x)
export const name_guard: User.NameGuard = (x): x is User.Name => fns.is_string(x) && fns.lt(256, x.length)
export const subscription_guard: User.SubscriptionGuard = (x): x is User.Subscription =>
	fns.is_non_negative_integer(x) && fns.lt(USER.SUBSCRIPTION.length, x)
export const email_guard: User.EmailGuard = (x): x is User.Email => fns.is_string(x) && USER.RX.EMAIL.test(x)
export const installed_function_guard: User.InstalledFunctionGuard = (x): x is User.InstalledFunction =>
	result
		.if(fns.is_string(x), { on_true: () => x as string })
		.pipe(result.ops.map(x => x.split(":")))
		.pipe(result.ops.chain(parts => result.if(parts.length === 2, { on_true: () => parts })))
		.pipe(result.ops.map(([name, version]) => USER.RX.FUNCTION_NAME.test(name) && sem_ver.is_sem_ver(version)))
		.cata(result.catas.or_else(() => false))

export const get_id: User.GetId = fns.prop(0)
export const get_handle: User.GetRef = fns.prop(1)
export const get_name: User.GetName = fns.prop(2)
export const get_subscription: User.GetSubscription = fns.prop(3)
export const get_created_at: User.GetCreatedAt = fns.prop(4)
export const get_updated_at: User.GetUpdatedAt = fns.prop(5)
export const get_email: User.GetEmail = fns.prop(6)
export const get_installed_functions: User.GetInstalledFunctions = fns.prop(7)
export const get_sessions: User.GetSessions = fns.prop(8)

export const has_the_name: User.HasTheName = (x, dto) => fns.eq(get_name(dto), x)
export const has_the_id: User.HasTheId = (x, dto) => fns.eq(get_id(dto), x)
export const has_the_handle: User.HasTheRef = (x, dto) => fns.eq(get_handle(dto), x)
export const has_the_subscription: User.HasTheSubscription = (x, dto) => fns.pipe(get_subscription).pipe(fns.eq(x))(dto)
export const has_the_email: User.HasTheEmail = (email, dto) => fns.eq(get_email(dto), email)

export const is_paid: User.IsPaid = fns.pipe(get_subscription).pipe(fns.gt(USER.SUBSCRIPTION.FREE))
export const is_free: User.IsFree = fns.pipe(get_subscription).pipe(fns.eq(USER.SUBSCRIPTION.FREE))
export const has_name: User.HasName = fns.pipe(get_name).pipe(fns.is_non_empty_string)

export const has_sessions: User.HasSessions = fns.pipe(get_sessions).pipe(fns.prop("length")).pipe(fns.gt(0))

export const has_installed_function: User.HasInstalledFunction = (f, dto) => get_installed_functions(dto).includes(f)
export const has_installed_functions: User.HasInstalledFunctions = fns
	.pipe(get_installed_functions)
	.pipe(fns.prop("length"))
	.pipe(fns.gt(0))
