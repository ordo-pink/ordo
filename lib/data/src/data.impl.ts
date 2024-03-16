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

import { Either } from "@ordo-pink/either"

import { DataStatic, FSID, PlainData, TData } from "./data.types"
import { DataError } from "./errors.types"
import { Errors } from "./errors.impl"
import { validations } from "./data-validations.impl"

const addUnique = <T>(array: T[], ...elements: T[]) => Array.from(new Set([...elements, ...array]))
const drop = <T>(array: T[], ...elements: T[]) => array.filter(item => !elements.includes(item))
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
		Either.of<string[], DataError>(Array.isArray(label) ? label : [label])
			.chain(labels =>
				labels.reduce(
					(acc, v) => acc.chain(() => validations.isValidStringE(v)),
					Either.right<string, DataError>(""),
				),
			)
			.chain(() =>
				validations
					.isValidSubE(updatedBy)
					.map(updatedBy => ({ labels: Array.isArray(label) ? label : [label], updatedBy })),
			)
			.map(({ labels, updatedBy }) => ({ updatedBy, labels: addUnique(plain.labels, ...labels) }))
			.map(extend(() => ({ updatedAt: Date.now() })))
			.map(increment => Data.of({ ...plain, ...increment }))

const removeLabelE =
	(plain: PlainData): TData["removeLabel"] =>
	(label, updatedBy) =>
		Either.of<string[], DataError>(Array.isArray(label) ? label : [label])
			.chain(labels =>
				labels.reduce(
					(acc, v) => acc.chain(() => validations.isValidStringE(v)),
					Either.right<string, DataError>(""),
				),
			)
			.chain(() =>
				validations
					.isValidSubE(updatedBy)
					.map(updatedBy => ({ labels: Array.isArray(label) ? label : [label], updatedBy })),
			)
			.map(({ labels, updatedBy }) => ({ updatedBy, labels: drop(plain.labels, ...labels) }))
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
	setProperty: (key, value, updatedBy) =>
		validations
			.isValidSubE(updatedBy)
			.chain(updatedBy => validations.isValidStringE(key).map(key => ({ updatedBy, key })))
			.map(
				extend(({ key, updatedBy }) => ({
					updatedAt: Date.now(),
					updatedBy,
					properties: { ...plain.properties, ...{ [key]: value } },
				})),
			)
			.map(increment => Data.of({ ...plain, ...increment })) as any,
})

export const Data: DataStatic = {
	Validations: validations,
	Errors,
	of,
	as: x => x as any,
	new: ({
		name,
		parent,
		createdBy,
		fsid,
		labels = [],
		contentType = "text/ordo",
		properties = {},
	}) =>
		validations
			.isValidNameE(name)
			.chain(() => validations.isValidParentE(parent))
			.chain(() => validations.isValidSubE(createdBy))
			.chain(() =>
				labels.reduce(
					(acc, v) => acc.chain(() => validations.isValidStringE(v)),
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
					properties,
				}),
			),
}
