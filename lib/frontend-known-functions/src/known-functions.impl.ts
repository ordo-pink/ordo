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

import { F, T, identity, isEmpty, prop } from "ramda"

import { Either, TEither } from "@ordo-pink/either"
import { N, isNonEmptyString, isObject } from "@ordo-pink/tau"
import { internalApps } from "@ordo-pink/core"

// TODO: Extend query list :: data, etc.
export type QueryPermission =
	| "fetch"
	| "auth.is-authenticated"
	| "user.id"
	| "user.email"
	| "user.createdAt"
	| "user.subscription"
	| "user.name"
	| "user.achievements"
	| "achievements"
	| "functions.current-activity"
	| "functions.current-file-association"
	| "data.read"

// TODO: Add support for command intellisense
export type CommandPermission = Client.Commands.CommandName

export type Permissions = {
	queries: QueryPermission[]
	commands: CommandPermission[]
}

type KnownFunction = {
	name: string
	fid: symbol
	permissions: Permissions
}

export const KnownFunctions = {
	validate: (fid: symbol | null) => findKnownFunctionByFIDE(fid).fold(F, T),
	exchange: (fid: symbol | null) => findKnownFunctionByFIDE(fid).fold(N, pickKnownFunctionName),
	checkPermissions: (fid: symbol | null, permissions: Partial<Permissions>) =>
		isOrdoPinkAppFunction(fid) ||
		findKnownFunctionByFIDE(fid)
			.map(prop("permissions"))
			.chain(validateCheckedPermissionsE(permissions))
			.map(checkPermissions(permissions))
			.fold(F, identity),
	register: (name: string | null, permissions: Permissions) =>
		Either.fromNullable(name)
			.chain(checkIsValidPermissionsE(permissions))
			.chain(checkIsValidNameE)
			.chain(checkNameIsNotTakenE)
			.map(createKnownFunctionFromName(permissions))
			.chain(tapSaveKnownFunctionE)
			.fold(N, pickKnownFunctionId),
	unregister: (name: string | null) =>
		findKnownFunctionByNameE(name)
			.map(getKnownFunctionIndex)
			.map(removeKnownFunctionByIndex)
			.fold(F, T),
}

// --- Internal ---

const knownFunctions: KnownFunction[] = []

const isOrdoPinkAppFunction = (fid: symbol | null) =>
	internalApps.includes(KnownFunctions.exchange(fid)!)

const checkIsValidNameE = (name: string) =>
	Either.fromBoolean(
		() => isNonEmptyString(name),
		() => name,
	)

const checkIsValidPermissionsE = (permissions: Permissions) => (name: string) =>
	Either.fromBoolean(
		() =>
			isObject(permissions) &&
			Array.isArray(permissions.commands) &&
			Array.isArray(permissions.queries),
		() => name,
	)

const findKnownFunctionByFIDE = (fid: symbol | null) =>
	Either.fromNullable(knownFunctions.find(f => f.fid === fid))

const findKnownFunctionByNameE = (name: string | null) =>
	Either.fromNullable(knownFunctions.find(f => f.name === name))

const checkNameIsNotTakenE = (name: string): TEither<string, false> =>
	Either.fromBoolean(
		() => !knownFunctions.some(hasName(name)),
		() => name,
	)

const tapSaveKnownFunctionE = (func: KnownFunction): TEither<KnownFunction, unknown> =>
	Either.of(func)
		.map(() => knownFunctions.push(func))
		.map(() => func)

const getKnownFunctionIndex = (func: KnownFunction) => knownFunctions.indexOf(func)

const removeKnownFunctionByIndex = (index: number) => knownFunctions.splice(index, 1)

const hasName =
	(name: string) =>
	(func: KnownFunction): boolean =>
		func.name === name

const createKnownFunctionFromName =
	(permissions: Permissions) =>
	(name: string): KnownFunction => ({
		name,
		fid: Symbol(name),
		permissions,
	})

const pickKnownFunctionId = (f: KnownFunction) => f.fid

const pickKnownFunctionName = (f: KnownFunction) => f.name

const checkPermissions =
	(checkedPermissions: Partial<Permissions>) => (grantedPermissions: Permissions) =>
		(!!checkedPermissions.commands &&
			checkedPermissions.commands.every(p => grantedPermissions.commands.includes(p))) ||
		(!!checkedPermissions.queries &&
			checkedPermissions.queries.every(p => grantedPermissions.queries.includes(p)))

const validateCheckedPermissionsE =
	(permissions: Partial<Permissions>) => (grantedPermissions: Permissions) =>
		Either.fromBoolean(
			() =>
				isObject(permissions) &&
				((Array.isArray(permissions.commands) && !isEmpty(permissions.commands)) ||
					(Array.isArray(permissions.queries) && !isEmpty(permissions.queries))),
			() => grantedPermissions,
		)
