// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { F, T, identity, isEmpty, prop } from "ramda"

import { Either, TEither } from "@ordo-pink/either"
import { N, isNonEmptyString, isObject } from "@ordo-pink/tau"
import { ORDO_PINK_APP_FUNCTION, ORDO_PINK_USER_FUNCTION } from "@ordo-pink/core"

export type QueryPermission =
	| "fetch"
	| "auth.is-authenticated"
	| "user.id"
	| "user.email"
	| "user.createdAt"
	| "user.subscription"
	| "user.name"
	| "achievements"
	| "functions.current-activity"

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
	[ORDO_PINK_APP_FUNCTION, ORDO_PINK_USER_FUNCTION].includes(KnownFunctions.exchange(fid)!)

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
