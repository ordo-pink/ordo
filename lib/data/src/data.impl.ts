// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Nullable } from "@ordo-pink/tau"
import { FSID } from "./common"
import { SUB } from "@ordo-pink/wjwt"
import { Either, TEither } from "@ordo-pink/either"

export type PlainData = {
	fsid: FSID
	name: string
	parent: Nullable<FSID>
	children: FSID[]
	links: FSID[]
	labels: string[]
	createdAt: number
	createdBy: SUB
	updatedAt: number
	updatedBy: SUB
	size: number
}

const Errors = {
	InvalidName: "Name must be a non-empty string",
	InvalidSize: "Size must be a non-negative finite integer",
	InvalidTimestamp: "Timestamp must be a non-negative finite integer",
	InvalidFSID: "FSID must be a valid UUIDv4",
	InvalidSUB: "SUB must be a valid UUIDv4",
	InvalidLabel: "Label must be a non-empty string",
} as const

const UUID_RX = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/

type UUID = `${string}-${string}-${string}-${string}-${string}`

const isString = (x: unknown): x is string => typeof x === "string"
const isNonEmptyString = (x: unknown): x is string => isString(x) && x.trim() !== ""
const isNumber = (x: unknown): x is number => typeof x === "number"
const isNegativeNumber = (x: unknown): x is number => isNumber(x) && x < 0
const isZero = (x: unknown): x is 0 => x === 0
const isPositiveNumber = (x: unknown): x is number => isNumber(x) && x > 0
const isNonNegativeNumber = (x: unknown): x is number => isZero(x) || isPositiveNumber(x)
const isFiniteNumber = (x: unknown): x is number => Number.isFinite(x)
const isInteger = (x: unknown): x is number => Number.isInteger(x)
const isNaN = (x: unknown): x is number => Number.isNaN(x)
const isInfinite = (x: unknown): x is number => isNumber(x) && !isFiniteNumber(x)
const isNonNegativeFiniteInteger = (x: unknown): x is number =>
	isNonNegativeNumber(x) && isFiniteNumber(x) && isInteger(x)
const isUUID = (x: unknown): x is UUID => isString(x) && UUID_RX.test(x)

type Validation<Expected> = (x: Expected) => TEither<Expected, DataError>

type Validations = {
	isValidNameE: Validation<string>
	isValidSizeE: Validation<number>
	isValidTimestampE: Validation<number>
	isValidFsidE: Validation<FSID>
	isValidSubE: Validation<SUB>
	isValidLabelE: Validation<string>
}

const validations: Validations = {
	isValidNameE: x =>
		Either.fromBoolean(
			() => isNonEmptyString(x),
			() => x,
			() => Data.Errors.InvalidName,
		),
	isValidSizeE: x =>
		Either.fromBoolean(
			() => isNonNegativeFiniteInteger(x),
			() => x,
			() => Data.Errors.InvalidSize,
		),
	isValidTimestampE: x =>
		Either.fromBoolean(
			() => isNonNegativeFiniteInteger(x),
			() => x,
			() => Data.Errors.InvalidTimestamp,
		),
	isValidFsidE: x =>
		Either.fromBoolean(
			() => isUUID(x),
			() => x,
			() => Data.Errors.InvalidFSID,
		),
	isValidSubE: x =>
		Either.fromBoolean(
			() => isUUID(x),
			() => x,
			() => Data.Errors.InvalidSUB,
		),
	isValidLabelE: x =>
		Either.fromBoolean(
			() => isNonEmptyString(x),
			() => x,
			() => Data.Errors.InvalidLabel,
		),
}

type DataEntry = {
	plain: PlainData
	setName: (name: string, updatedBy: SUB) => TEither<DataEntry, DataError>
	setSize: (size: number, updatedBy: SUB) => TEither<DataEntry, DataError>
	setParent: (parent: FSID, updatedBy: SUB) => TEither<DataEntry, DataError>
	addChild: (child: FSID, updatedBy: SUB) => TEither<DataEntry, DataError>
	removeChild: (child: FSID, updatedBy: SUB) => TEither<DataEntry, DataError>
	dropChildren: (updatedBy: SUB) => TEither<DataEntry, DataError>
	addLink: (link: FSID, updatedBy: SUB) => TEither<DataEntry, DataError>
	removeLink: (link: FSID, updatedBy: SUB) => TEither<DataEntry, DataError>
	dropLinks: (updatedBy: SUB) => TEither<DataEntry, DataError>
	addLabel: (link: string, updatedBy: SUB) => TEither<DataEntry, DataError>
	removeLabel: (link: string, updatedBy: SUB) => TEither<DataEntry, DataError>
	dropLabels: (updatedBy: SUB) => TEither<DataEntry, DataError>
}

const addUnique = <T>(array: T[], element: T) => Array.from(new Set([...array, element]))
const drop = <T>(array: T[], element: T) => array.filter(item => item !== element)
const extend =
	<T extends Record<string, unknown>, N extends Record<string, unknown>>(f: (obj: T) => N) =>
	(obj: T) => ({ ...obj, ...f(obj) })

const setNameE =
	(plain: PlainData): DataEntry["setName"] =>
	(name, updatedBy) =>
		validations
			.isValidNameE(name)
			.chain(name => validations.isValidSubE(updatedBy).map(updatedBy => ({ name, updatedBy })))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const setSizeE =
	(plain: PlainData): DataEntry["setSize"] =>
	(size, updatedBy) =>
		validations
			.isValidSizeE(size)
			.chain(size => validations.isValidSubE(updatedBy).map(updatedBy => ({ size, updatedBy })))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const setParentE =
	(plain: PlainData): DataEntry["setParent"] =>
	(parent, updatedBy) =>
		validations
			.isValidFsidE(parent)
			.chain(parent => validations.isValidSubE(updatedBy).map(updatedBy => ({ parent, updatedBy })))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const addChildE =
	(plain: PlainData): DataEntry["addChild"] =>
	(child, updatedBy) =>
		validations
			.isValidFsidE(child)
			.chain(child => validations.isValidSubE(updatedBy).map(updatedBy => ({ child, updatedBy })))
			.map(({ child, updatedBy }) => ({ updatedBy, children: addUnique(plain.children, child) }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const removeChildE =
	(plain: PlainData): DataEntry["removeChild"] =>
	(child, updatedBy) =>
		validations
			.isValidFsidE(child)
			.chain(child => validations.isValidSubE(updatedBy).map(updatedBy => ({ child, updatedBy })))
			.map(({ child, updatedBy }) => ({ updatedBy, children: drop(plain.children, child) }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const dropChildrenE =
	(plain: PlainData): DataEntry["dropChildren"] =>
	updatedBy =>
		validations
			.isValidSubE(updatedBy)
			.map(updatedBy => ({ updatedBy, children: [] }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const addLinkE =
	(plain: PlainData): DataEntry["addLink"] =>
	(link, updatedBy) =>
		validations
			.isValidFsidE(link)
			.chain(link => validations.isValidSubE(updatedBy).map(updatedBy => ({ link, updatedBy })))
			.map(({ link, updatedBy }) => ({ updatedBy, links: addUnique(plain.links, link) }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const removeLinkE =
	(plain: PlainData): DataEntry["removeLink"] =>
	(link, updatedBy) =>
		validations
			.isValidFsidE(link)
			.chain(link => validations.isValidSubE(updatedBy).map(updatedBy => ({ link, updatedBy })))
			.map(({ link, updatedBy }) => ({ updatedBy, links: drop(plain.links, link) }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const dropLinksE =
	(plain: PlainData): DataEntry["dropLinks"] =>
	updatedBy =>
		validations
			.isValidSubE(updatedBy)
			.map(updatedBy => ({ updatedBy, links: [] }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const addLabelE =
	(plain: PlainData): DataEntry["addLabel"] =>
	(label, updatedBy) =>
		validations
			.isValidLabelE(label)
			.chain(label => validations.isValidSubE(updatedBy).map(updatedBy => ({ label, updatedBy })))
			.map(({ label, updatedBy }) => ({ updatedBy, labels: addUnique(plain.labels, label) }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const removeLabelE =
	(plain: PlainData): DataEntry["removeLabel"] =>
	(label, updatedBy) =>
		validations
			.isValidLabelE(label)
			.chain(label => validations.isValidSubE(updatedBy).map(updatedBy => ({ label, updatedBy })))
			.map(({ label, updatedBy }) => ({ updatedBy, labels: drop(plain.labels, label) }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const dropLabelsE =
	(plain: PlainData): DataEntry["dropLabels"] =>
	updatedBy =>
		validations
			.isValidSubE(updatedBy)
			.map(updatedBy => ({ updatedBy, labels: [] }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const of = (plain: PlainData): DataEntry => ({
	plain,
	setName: setNameE(plain),
	setSize: setSizeE(plain),
	setParent: setParentE(plain),
	addChild: addChildE(plain),
	removeChild: removeChildE(plain),
	dropChildren: dropChildrenE(plain),
	addLink: addLinkE(plain),
	removeLink: removeLinkE(plain),
	dropLinks: dropLinksE(plain),
	addLabel: addLabelE(plain),
	removeLabel: removeLabelE(plain),
	dropLabels: dropLabelsE(plain),
})

type DataStatic = {
	Validations: Validations
	Errors: typeof Errors
	of: (plain: PlainData) => DataEntry
	new: (params: Pick<PlainData, "name" | "parent" | "createdBy">) => DataEntry
}

const Data: DataStatic = {
	Validations: validations,
	Errors,
	of,
	new: ({ name, parent, createdBy }) =>
		Data.of({
			name,
			parent,
			createdBy,
			createdAt: Date.now(),
			updatedBy: createdBy,
			updatedAt: Date.now(),
			fsid: crypto.randomUUID() as UUID,
			children: [],
			labels: [],
			links: [],
			size: 0,
		}),
}

type DataErrorName = keyof typeof Data.Errors
type DataError = (typeof Data.Errors)[DataErrorName]
