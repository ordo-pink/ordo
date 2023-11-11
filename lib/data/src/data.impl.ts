// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Either } from "@ordo-pink/either"
import { validations } from "./data-validations.impl"
import { PlainData, TData, DataStatic, FSID } from "./data.types"
import { Errors } from "./errors.impl"
import { DataError } from "./errors.types"

const addUnique = <T>(array: T[], element: T) => Array.from(new Set([element, ...array]))
const drop = <T>(array: T[], element: T) => array.filter(item => item !== element)
const extend =
	<T extends Record<string, unknown>, N extends Record<string, unknown>>(f: (obj: T) => N) =>
	(obj: T) => ({ ...obj, ...f(obj) })

const setNameE =
	(plain: PlainData): TData["setName"] =>
	(name, updatedBy) =>
		validations
			.isValidNameE(name)
			.chain(name => validations.isValidSubE(updatedBy).map(updatedBy => ({ name, updatedBy })))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const updateE =
	(plain: PlainData): TData["update"] =>
	increment =>
		validations.isValidDataE(increment).map(increment =>
			Data.of({
				createdAt: plain.createdAt,
				createdBy: plain.createdBy,
				fsid: plain.fsid,
				labels: increment.labels,
				links: increment.links,
				name: increment.name,
				parent: increment.parent,
				size: increment.size,
				updatedAt: Date.now(),
				updatedBy: increment.updatedBy,
				contentType: plain.contentType,
			}),
		)

const setSizeE =
	(plain: PlainData): TData["setSize"] =>
	(size, updatedBy) =>
		validations
			.isValidSizeE(size)
			.chain(size => validations.isValidSubE(updatedBy).map(updatedBy => ({ size, updatedBy })))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const setParentE =
	(plain: PlainData): TData["setParent"] =>
	(parent, updatedBy) =>
		validations
			.isValidParentE(parent)
			.chain(parent => validations.isValidSubE(updatedBy).map(updatedBy => ({ parent, updatedBy })))
			.chain(({ parent, updatedBy }) =>
				Either.fromBoolean(
					() => parent !== plain.fsid,
					() => ({ parent, updatedBy }),
					() => Data.Errors.SelfReferencingParent,
				),
			)
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const addLinkE =
	(plain: PlainData): TData["addLink"] =>
	(link, updatedBy) =>
		validations
			.isValidFsidE(link)
			.chain(link => validations.isValidSubE(updatedBy).map(updatedBy => ({ link, updatedBy })))
			.chain(({ link, updatedBy }) =>
				Either.fromBoolean(
					() => link !== plain.fsid,
					() => ({ link, updatedBy }),
					() => Data.Errors.SelfReferencingLink,
				),
			)
			.map(({ link, updatedBy }) => ({ updatedBy, links: addUnique(plain.links, link) }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const removeLinkE =
	(plain: PlainData): TData["removeLink"] =>
	(link, updatedBy) =>
		validations
			.isValidFsidE(link)
			.chain(link => validations.isValidSubE(updatedBy).map(updatedBy => ({ link, updatedBy })))
			.map(({ link, updatedBy }) => ({ updatedBy, links: drop(plain.links, link) }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const dropLinksE =
	(plain: PlainData): TData["dropLinks"] =>
	updatedBy =>
		validations
			.isValidSubE(updatedBy)
			.map(updatedBy => ({ updatedBy, links: [] }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const addLabelE =
	(plain: PlainData): TData["addLabel"] =>
	(label, updatedBy) =>
		validations
			.isValidLabelE(label)
			.chain(label => validations.isValidSubE(updatedBy).map(updatedBy => ({ label, updatedBy })))
			.map(({ label, updatedBy }) => ({ updatedBy, labels: addUnique(plain.labels, label) }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const removeLabelE =
	(plain: PlainData): TData["removeLabel"] =>
	(label, updatedBy) =>
		validations
			.isValidLabelE(label)
			.chain(label => validations.isValidSubE(updatedBy).map(updatedBy => ({ label, updatedBy })))
			.map(({ label, updatedBy }) => ({ updatedBy, labels: drop(plain.labels, label) }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const dropLabelsE =
	(plain: PlainData): TData["dropLabels"] =>
	updatedBy =>
		validations
			.isValidSubE(updatedBy)
			.map(updatedBy => ({ updatedBy, labels: [] }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const of = (plain: PlainData): TData => ({
	plain: structuredClone(plain),
	setName: setNameE(plain),
	setSize: setSizeE(plain),
	setParent: setParentE(plain),
	addLink: addLinkE(plain),
	removeLink: removeLinkE(plain),
	dropLinks: dropLinksE(plain),
	addLabel: addLabelE(plain),
	removeLabel: removeLabelE(plain),
	dropLabels: dropLabelsE(plain),
	update: updateE(plain),
})

export const Data: DataStatic = {
	Validations: validations,
	Errors,
	of,
	new: ({ name, parent, createdBy, fsid, labels = [], contentType = "text/ordo" }) =>
		validations
			.isValidNameE(name)
			.chain(() => validations.isValidParentE(parent))
			.chain(() => validations.isValidSubE(createdBy))
			.chain(() =>
				labels.reduce(
					(acc, v) => acc.chain(() => validations.isValidLabelE(v)),
					Either.right<string, DataError>(""),
				),
			)
			.chain(() => validations.isValidFsidE(fsid ?? (crypto.randomUUID() as FSID)))
			.map(fsid =>
				Data.of({
					name,
					parent,
					createdBy,
					createdAt: Date.now(),
					updatedBy: createdBy,
					updatedAt: Date.now(),
					contentType,
					fsid,
					labels,
					links: [],
					size: 0,
				}),
			),
}
