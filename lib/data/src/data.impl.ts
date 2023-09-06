// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { validations } from "./data-validations.impl"
import { PlainData, TData, DataStatic, FSID } from "./data.types"
import { Errors } from "./errors.impl"

const addUnique = <T>(array: T[], element: T) => Array.from(new Set([...array, element]))
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
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const addChildE =
	(plain: PlainData): TData["addChild"] =>
	(child, updatedBy) =>
		validations
			.isValidFsidE(child)
			.chain(child => validations.isValidSubE(updatedBy).map(updatedBy => ({ child, updatedBy })))
			.map(({ child, updatedBy }) => ({ updatedBy, children: addUnique(plain.children, child) }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const removeChildE =
	(plain: PlainData): TData["removeChild"] =>
	(child, updatedBy) =>
		validations
			.isValidFsidE(child)
			.chain(child => validations.isValidSubE(updatedBy).map(updatedBy => ({ child, updatedBy })))
			.map(({ child, updatedBy }) => ({ updatedBy, children: drop(plain.children, child) }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const dropChildrenE =
	(plain: PlainData): TData["dropChildren"] =>
	updatedBy =>
		validations
			.isValidSubE(updatedBy)
			.map(updatedBy => ({ updatedBy, children: [] }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const addLinkE =
	(plain: PlainData): TData["addLink"] =>
	(link, updatedBy) =>
		validations
			.isValidFsidE(link)
			.chain(link => validations.isValidSubE(updatedBy).map(updatedBy => ({ link, updatedBy })))
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

export const Data: DataStatic = {
	Validations: validations,
	Errors,
	of,
	new: ({ name, parent, createdBy, fsid }) =>
		validations
			.isValidNameE(name)
			.chain(() => validations.isValidParentE(parent))
			.chain(() => validations.isValidSubE(createdBy))
			.chain(() => validations.isValidFsidE(fsid ?? (crypto.randomUUID() as FSID)))
			.map(fsid =>
				Data.of({
					name,
					parent,
					createdBy,
					createdAt: Date.now(),
					updatedBy: createdBy,
					updatedAt: Date.now(),
					fsid,
					children: [],
					labels: [],
					links: [],
					size: 0,
				}),
			),
}
