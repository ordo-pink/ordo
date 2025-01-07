/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import * as tau from "@ordo-pink/tau"
import { Result, type TResult } from "@ordo-pink/result"
import { Option } from "@ordo-pink/option"
import { ordo_app_state } from "../app.state"

// TODO: Extend query list :: data, etc.
export const init_known_functions = tau.call_once((): OrdoInternal.KnownFunctions => {
	const app_fn = ordo_app_state.zags.select("constants.app_fn")

	const known_functions: OrdoInternal.KnownFunction[] = [app_fn]

	const find_by_fid = (fid: symbol | null) => Result.FromNullable(known_functions.find(f => f.fid === fid))

	const find_by_name = (name: string | null) => Result.FromNullable(known_functions.find(f => f.name === name))

	const check_name_is_not_taken = (name: string): TResult<string, false> =>
		Result.If(!known_functions.some(has_name(name)), { T: () => name })

	const save = (func: OrdoInternal.KnownFunction): TResult<OrdoInternal.KnownFunction, unknown> =>
		Result.Ok(func).pipe(Result.ops.tap(() => known_functions.push(func)))

	const get_index = (func: OrdoInternal.KnownFunction) => known_functions.indexOf(func)

	const remove_known_f_by_index = (index: number) => known_functions.splice(index, 1)

	const is_internal = (fid: symbol | null) => fid === app_fn.fid

	const known_functions_manager = {
		validate: (fid: symbol | null) => find_by_fid(fid).cata({ Err: tau.F, Ok: tau.T }),
		exchange: (fid: symbol | null) =>
			find_by_fid(fid)
				.pipe(Result.ops.map(pick_known_f_name))
				.cata({ Err: () => Option.None(), Ok: name => Option.Some(name) }),
		is_internal: (fid: symbol | null) => is_internal(fid),
		has_permissions: (fid: symbol | null, permissions: Partial<Ordo.CreateFunction.Permissions>) =>
			is_internal(fid) ||
			find_by_fid(fid)
				.pipe(Result.ops.map(tau.prop("permissions")))
				.pipe(Result.ops.chain(validate_checked_permissions(permissions)))
				.pipe(Result.ops.map(check_permissions(permissions)))
				.cata({ Err: tau.F, Ok: x => x }),
		register: (name: string | null, permissions: Ordo.CreateFunction.Permissions) =>
			Result.FromNullable(name)
				.pipe(Result.ops.chain(check_is_valid_permissions(permissions)))
				.pipe(Result.ops.chain(check_is_valid_name))
				.pipe(Result.ops.chain(check_name_is_not_taken))
				.pipe(Result.ops.map(create_known_f_from_name(permissions)))
				.pipe(Result.ops.chain(save))
				.cata({ Err: tau.N, Ok: pick_known_f_id }),
		unregister: (name: string | null) =>
			find_by_name(name)
				.pipe(Result.ops.map(get_index))
				.pipe(Result.ops.map(remove_known_f_by_index))
				.cata({ Err: tau.F, Ok: tau.T }),
	}

	ordo_app_state.zags.update("known_functions", () => known_functions_manager)

	return known_functions_manager
})

// --- Internal ---

const check_is_valid_name = (name: string) => Result.If(tau.is_non_empty_string(name), { T: () => name })

const check_is_valid_permissions = (permissions: Ordo.CreateFunction.Permissions) => (name: string) =>
	Result.If(tau.is_object(permissions) && tau.is_array(permissions.commands) && tau.is_array(permissions.queries), {
		T: () => name,
	})

const has_name =
	(name: string) =>
	(func: OrdoInternal.KnownFunction): boolean =>
		func.name === name

const create_known_f_from_name =
	(permissions: Ordo.CreateFunction.Permissions) =>
	(name: string): OrdoInternal.KnownFunction => ({
		name,
		fid: Symbol(name),
		permissions,
	})

const pick_known_f_id = (f: OrdoInternal.KnownFunction) => f.fid

const pick_known_f_name = (f: OrdoInternal.KnownFunction) => f.name

const check_permissions =
	(checked_permissions: Partial<Ordo.CreateFunction.Permissions>) => (granted_permissions: Ordo.CreateFunction.Permissions) =>
		(!!checked_permissions.commands && checked_permissions.commands.every(p => granted_permissions.commands.includes(p))) ||
		(!!checked_permissions.queries && checked_permissions.queries.every(p => granted_permissions.queries.includes(p)))

const validate_checked_permissions =
	(permissions: Partial<Ordo.CreateFunction.Permissions>) => (granted_permissions: Ordo.CreateFunction.Permissions) =>
		Result.If(
			tau.is_object(permissions) &&
				((Array.isArray(permissions.commands) && !tau.is_empty_array(permissions.commands)) ||
					(Array.isArray(permissions.queries) && !tau.is_empty_array(permissions.queries))),
			{ T: () => granted_permissions },
		)
