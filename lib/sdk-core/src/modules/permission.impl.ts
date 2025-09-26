/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import * as fns from "./fns.impl"
import * as validations from "./validations.impl"

// --- Constants ---

/** A Subaru WRX implementation of permissions. */
export enum VALUE {
	_____,
	____X,
	___R_,
	___RX,
	__W__,
	__W_X,
	__WR_,
	__WRX,
	_U___,
	_U__X,
	_U_R_,
	_U_RX,
	_UW__,
	_UW_X,
	_UWR_,
	_UWRX,
	S____,
	S___X,
	S__R_,
	S__RX,
	S_W__,
	S_W_X,
	S_WR_,
	S_WRX,
	SU___,
	SU__X,
	SU_R_,
	SU_RX,
	SUW__,
	SUW_X,
	SUWR_,
	SUWRX,
	length,
}

/** Permission mask for ugly counter-javascriptive bitwise stuff. */
export const MASK = VALUE.length - 1

/** Action to be applied on a file. */
export enum ACTION {
	EXECUTE = VALUE.____X,
	READ = VALUE.___R_,
	WRITE = VALUE.__W__,
	UNLINK = VALUE._U___,
	SHARE = VALUE.S____,
}

// --- Impl ---

export const guard: Ordo.Permission.Guard = (x): x is Ordo.Permission.Instance =>
	validations.is_non_negative_integer(x) && fns.lt(x, VALUE.length)

export const check: Ordo.Permission.Check = fns.curry((a, p) => !!(p & MASK & a))

// --- Types ---

declare global {
	namespace Ordo.Permission {
		export type Instance = VALUE
		export type Action = ACTION

		export type Guard = Ordo.GenericGuard<Instance>

		export type Check = Ordo.Fns.Curried<(action: ACTION, permission: Instance) => boolean>
	}
}
