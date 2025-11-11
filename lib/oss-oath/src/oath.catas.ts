/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Oath from "./oath.types"

export const if_ok: Oath.IfOk = resolve => ({ reject: () => void 0, resolve })
export const noop: Oath.Noop = () => ({ reject: () => void 0, resolve: () => void 0 })
export const or_else: Oath.OrElse = reject => ({ reject, resolve: x => x })
export const to_promise: Oath.ToPromise = () => ({ reject: x => Promise.reject(x) as never, resolve: x => x })
export const unwrap: Oath.Unwrap = () => ({ reject: x => x, resolve: x => x })
