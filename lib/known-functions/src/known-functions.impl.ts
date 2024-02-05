// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Either, TEither } from "@ordo-pink/either"
import Null from "@ordo-pink/frontend-react-components/null"
import { isNonEmptyString } from "@ordo-pink/tau"

type KnownFunction = {
	name: string
	id: symbol
}

export const KnownFunctions = {
	validate: (id: symbol | null): boolean => findKnownFunctionByIdE(id).fold(False, True),
	exchange: (id: symbol | null): string | null =>
		findKnownFunctionByIdE(id).fold(Null, pickKnownFunctionName),
	register: (name: string | null): symbol | null =>
		Either.fromNullable(name)
			.chain(checkIsValidNameE)
			.chain(checkNameIsNotTakenE)
			.map(createKnownFunctionFromName)
			.chain(tapSaveKnownFunctionE)
			.fold(Null, pickKnownFunctionId),
	unregister: (name: string | null): boolean =>
		findKnownFunctionByNameE(name)
			.map(getKnownFunctionIndex)
			.map(removeKnownFunctionByIndex)
			.fold(False, True),
}

// --- Internal ---

const knownFunctions: KnownFunction[] = []

const checkIsValidNameE = (n: string) =>
	Either.fromBoolean(
		() => isNonEmptyString(n),
		() => n,
	)

const findKnownFunctionByIdE = (i: symbol | null) =>
	Either.fromNullable(knownFunctions.find(f => f.id === i))

const findKnownFunctionByNameE = (n: string | null) =>
	Either.fromNullable(knownFunctions.find(f => f.name === n))

const checkNameIsNotTakenE = (n: string): TEither<string, false> =>
	Either.fromBoolean(
		() => !knownFunctions.some(hasName(n)),
		() => n,
	)

const tapSaveKnownFunctionE = (f: KnownFunction): TEither<KnownFunction, unknown> =>
	Either.of(f)
		.map(() => knownFunctions.push(f))
		.map(() => f)

const getKnownFunctionIndex = (f: KnownFunction) => knownFunctions.indexOf(f)

const removeKnownFunctionByIndex = (i: number) => knownFunctions.splice(i, 1)

const False = () => false

const True = () => true

const hasName =
	(n: string) =>
	({ name }: KnownFunction): boolean =>
		name === n

const createKnownFunctionFromName = (name: string): KnownFunction => ({ name, id: Symbol(name) })

const pickKnownFunctionId = (f: KnownFunction) => f.id

const pickKnownFunctionName = (f: KnownFunction) => f.name
