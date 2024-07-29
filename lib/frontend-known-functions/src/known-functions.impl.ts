// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Either, type TEither } from "@ordo-pink/either"
import {
	F,
	N,
	T,
	is_array,
	is_empty_array,
	is_non_empty_string,
	is_object,
	prop,
} from "@ordo-pink/tau"
import { type TPermissions } from "@ordo-pink/core"

export const LIB_DIRECTORY_FSID = "1de21bf3-2277-4d3a-bbd3-d120eb8a49d0"

export const ORDO_PINK_APP_FUNCTION = "pink.ordo.app"

export const ORDO_PINK_USER_FUNCTION = "pink.ordo.user"
export const ORDO_PINK_ACHIEVEMENTS_FUNCTION = "pink.ordo.achievements"
export const ORDO_PINK_FILE_EXPLORER_FUNCTION = "pink.ordo.file-explorer"
export const ORDO_PINK_LINKS_FUNCTION = "pink.ordo.links"
export const ORDO_PINK_HOME_FUNCTION = "pink.ordo.home"
export const ORDO_PINK_EDITOR_FUNCTION = "pink.ordo.editor"
export const ORDO_PINK_GTD_FUNCTION = "pink.ordo.gtd"
export const ORDO_PINK_EXCALIDRAW_FUNCTION = "pink.ordo.excalidraw"
// export const ORDO_PINK_MEDIA_FUNCTION = "pink.ordo.media"
// export const ORDO_PINK_BOARDS_FUNCTION = "pink.ordo.boards"
// export const ORDO_PINK_DATABASES_FUNCTION = "pink.ordo.databases"
// export const ORDO_PINK_DEV_TOOLS_FUNCTION = "pink.ordo.dev-tools"
// export const ORDO_PINK_CALENDAR_FUNCTION = "pink.ordo.calendar"

const internal_apps = [
	ORDO_PINK_APP_FUNCTION,
	ORDO_PINK_USER_FUNCTION,
	ORDO_PINK_FILE_EXPLORER_FUNCTION,
	ORDO_PINK_LINKS_FUNCTION,
	ORDO_PINK_HOME_FUNCTION,
	ORDO_PINK_EDITOR_FUNCTION,
	ORDO_PINK_GTD_FUNCTION,
	ORDO_PINK_ACHIEVEMENTS_FUNCTION,
	ORDO_PINK_EXCALIDRAW_FUNCTION,
]

// TODO: Extend query list :: data, etc.
// TODO: Move to core

type TKnownFunction = {
	name: string
	fid: symbol
	permissions: TPermissions
}

// TODO: Return Options
// TODO: call_once
export const KnownFunctions = {
	validate: (fid: symbol | null) => find_known_function_by_fid(fid).fold(F, T),
	exchange: (fid: symbol | null) => find_known_function_by_fid(fid).fold(N, pickKnownFunctionName),
	check_is_internal: (fid: symbol | null) => is_ordo_pink_app_function(fid),
	check_permissions: (fid: symbol | null, permissions: Partial<TPermissions>) =>
		is_ordo_pink_app_function(fid) ||
		find_known_function_by_fid(fid)
			.map(prop("permissions"))
			.chain(validate_checked_permissions(permissions))
			.map(check_permissions(permissions))
			.fold(F, x => x),
	register: (name: string | null, permissions: TPermissions) =>
		Either.fromNullable(name)
			.chain(check_is_valid_permissions(permissions))
			.chain(check_is_valid_name)
			.chain(check_name_is_not_taken)
			.map(create_known_function_from_name(permissions))
			.chain(tap_save_known_function)
			.fold(N, pick_known_function_id),
	unregister: (name: string | null) =>
		find_known_function_by_name(name)
			.map(get_known_function_index)
			.map(remove_known_function_by_index)
			.fold(F, T),
}

// --- Internal ---

const known_functions: TKnownFunction[] = []

const is_ordo_pink_app_function = (fid: symbol | null) =>
	internal_apps.includes(KnownFunctions.exchange(fid)!)

const check_is_valid_name = (name: string) =>
	Either.fromBoolean(
		() => is_non_empty_string(name),
		() => name,
	)

const check_is_valid_permissions = (permissions: TPermissions) => (name: string) =>
	Either.fromBoolean(
		() => is_object(permissions) && is_array(permissions.commands) && is_array(permissions.queries),
		() => name,
	)

const find_known_function_by_fid = (fid: symbol | null) =>
	Either.fromNullable(known_functions.find(f => f.fid === fid))

const find_known_function_by_name = (name: string | null) =>
	Either.fromNullable(known_functions.find(f => f.name === name))

const check_name_is_not_taken = (name: string): TEither<string, false> =>
	Either.fromBoolean(
		() => !known_functions.some(hasName(name)),
		() => name,
	)

const tap_save_known_function = (func: TKnownFunction): TEither<TKnownFunction, unknown> =>
	Either.of(func)
		.map(() => known_functions.push(func))
		.map(() => func)

const get_known_function_index = (func: TKnownFunction) => known_functions.indexOf(func)

const remove_known_function_by_index = (index: number) => known_functions.splice(index, 1)

const hasName =
	(name: string) =>
	(func: TKnownFunction): boolean =>
		func.name === name

const create_known_function_from_name =
	(permissions: TPermissions) =>
	(name: string): TKnownFunction => ({
		name,
		fid: Symbol(name),
		permissions,
	})

const pick_known_function_id = (f: TKnownFunction) => f.fid

const pickKnownFunctionName = (f: TKnownFunction) => f.name

const check_permissions =
	(checked_permissions: Partial<TPermissions>) => (granted_permissions: TPermissions) =>
		(!!checked_permissions.commands &&
			checked_permissions.commands.every(p => granted_permissions.commands.includes(p))) ||
		(!!checked_permissions.queries &&
			checked_permissions.queries.every(p => granted_permissions.queries.includes(p)))

const validate_checked_permissions =
	(permissions: Partial<TPermissions>) => (granted_permissions: TPermissions) =>
		Either.fromBoolean(
			() =>
				is_object(permissions) &&
				((Array.isArray(permissions.commands) && !is_empty_array(permissions.commands)) ||
					(Array.isArray(permissions.queries) && !is_empty_array(permissions.queries))),
			() => granted_permissions,
		)
