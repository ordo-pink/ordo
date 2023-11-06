// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { TDataCommands } from "./data-commands.types"
import { Oath } from "@ordo-pink/oath"
import { Data } from "./data.impl"
import { DataPersistenceStrategy } from "./data-persistence-strategy.types"
import { Errors } from "./errors.impl"
import { ContentPersistenceStrategy } from "./content-persistence-strategy.types"

export type DataCommandsParams<T> = {
	dataPersistenceStrategy: DataPersistenceStrategy
	contentPersistenceStrategy: ContentPersistenceStrategy<T>
}

const of = <T>({
	dataPersistenceStrategy,
	contentPersistenceStrategy,
}: DataCommandsParams<T>): TDataCommands<T> => ({
	contentPersistenceStrategy,
	dataPersistenceStrategy,
	// TODO: Roll back on error
	create: params =>
		(params.name
			? dataPersistenceStrategy
					.find(params.createdBy, params.name, params.parent)
					.fix(() => false)
					.chain(Oath.ifElse(x => !x, { onFalse: () => Errors.DataAlreadyExists }))
			: Oath.all({
					child:
						params.fsid &&
						dataPersistenceStrategy
							.exists(params.createdBy, params.fsid)
							.chain(Oath.ifElse(x => !x, { onFalse: () => Errors.DataAlreadyExists })),
					parent:
						params.parent &&
						dataPersistenceStrategy
							.exists(params.createdBy, params.parent)
							.chain(Oath.ifElse(x => !!x, { onFalse: () => Errors.DataNotFound })),
			  })
		)
			.chain(() => Data.new(params).fold(Oath.reject, Oath.resolve))
			.chain(data =>
				dataPersistenceStrategy.count(data.plain.createdBy).chain(
					Oath.ifElse(length => length < params.fileLimit, {
						onTrue: () => data,
						onFalse: () => Errors.TooMuchData,
					}),
				),
			)
			.chain(child =>
				dataPersistenceStrategy
					.create(child.plain)
					.chain(() =>
						contentPersistenceStrategy
							.create(child.plain.createdBy, child.plain.fsid)
							.map(() => child.plain),
					),
			),
	fetch: ({ createdBy }) => dataPersistenceStrategy.getAll(createdBy),
	link: ({ createdBy, fsid, link, updatedBy }) =>
		dataPersistenceStrategy
			.get(createdBy, fsid)
			.chain(plain => Data.of(plain).addLink(link, updatedBy).fold(Oath.reject, Oath.resolve))
			.chain(data => dataPersistenceStrategy.update(data.plain)),
	unlink: ({ createdBy, fsid, link, updatedBy }) =>
		dataPersistenceStrategy
			.get(createdBy, fsid)
			.chain(plain => Data.of(plain).removeLink(link, updatedBy).fold(Oath.reject, Oath.resolve))
			.chain(data => dataPersistenceStrategy.update(data.plain)),
	addLabel: ({ createdBy, fsid, label, updatedBy }) =>
		dataPersistenceStrategy
			.get(createdBy, fsid)
			.chain(plain => Data.of(plain).addLabel(label, updatedBy).fold(Oath.reject, Oath.resolve))
			.chain(data => dataPersistenceStrategy.update(data.plain)),
	removeLabel: ({ createdBy, fsid, label, updatedBy }) =>
		dataPersistenceStrategy
			.get(createdBy, fsid)
			.chain(plain => Data.of(plain).removeLabel(label, updatedBy).fold(Oath.reject, Oath.resolve))
			.chain(data => dataPersistenceStrategy.update(data.plain)),
	update: ({ data, fsid, createdBy, updatedBy }) =>
		dataPersistenceStrategy
			.get(createdBy, fsid)
			.chain(plain => Data.of(plain).update(data).fold(Oath.reject, Oath.resolve))
			.chain(data => dataPersistenceStrategy.update(data.plain)),
	// TODO: Roll back on error
	move: ({ createdBy, fsid, parent, updatedBy }) =>
		Oath.all({
			parent:
				parent &&
				dataPersistenceStrategy
					.exists(createdBy, parent)
					.chain(Oath.ifElse(x => !!x, { onFalse: () => Errors.DataNotFound })),
			child: dataPersistenceStrategy
				.exists(createdBy, fsid)
				.chain(Oath.ifElse(x => !!x, { onFalse: () => Errors.DataNotFound })),
		})
			.chain(() => dataPersistenceStrategy.get(createdBy, fsid))
			.chain(plain => Data.of(plain).setParent(parent, updatedBy).fold(Oath.reject, Oath.resolve))
			.chain(data => dataPersistenceStrategy.update(data.plain)),
	// TODO: Roll back on error
	remove: ({ createdBy, fsid }) =>
		dataPersistenceStrategy
			.exists(createdBy, fsid)
			.chain(Oath.ifElse(x => !!x, { onFalse: () => Errors.DataNotFound }))
			.chain(() => dataPersistenceStrategy.getAll(createdBy))
			.chain(data =>
				Oath.all(
					data.map(async item => {
						const hasRemovedItemInLinks = item.links.includes(fsid)
						const hasRemovedItemInParent = item.parent === fsid

						if (hasRemovedItemInParent) {
							await DataCommands.of({
								dataPersistenceStrategy: dataPersistenceStrategy,
								contentPersistenceStrategy: contentPersistenceStrategy,
							})
								.remove({
									createdBy: item.createdBy,
									fsid: item.fsid,
								})
								.toPromise()
						}

						if (hasRemovedItemInLinks) {
							if (hasRemovedItemInLinks) item.links.splice(item.links.indexOf(fsid, 1))

							await dataPersistenceStrategy.update(item).toPromise()
						}

						return "OK"
					}),
				),
			)
			.chain(() =>
				dataPersistenceStrategy
					.delete(createdBy, fsid)
					.chain(() => contentPersistenceStrategy.delete(createdBy, fsid))
					.fix(() => "OK"),
			),
	rename: ({ fsid, createdBy, name, updatedBy }) =>
		dataPersistenceStrategy
			.get(createdBy, fsid)
			.chain(plain => Data.of(plain).setName(name, updatedBy).fold(Oath.reject, Oath.resolve))
			.chain(data => dataPersistenceStrategy.update(data.plain)),
	// TODO: Roll back on error
	updateContent: ({ content, createdBy, updatedBy, fsid }) =>
		dataPersistenceStrategy.get(createdBy, fsid).chain(plain =>
			contentPersistenceStrategy
				.write(createdBy, plain.fsid, content)
				.chain(size => Data.of(plain).setSize(size, updatedBy).fold(Oath.reject, Oath.resolve))
				.chain(data => dataPersistenceStrategy.update(data.plain).map(() => data.plain.size)),
		),
	// TODO: Roll back on error
	uploadContent: ({ content, createdBy, updatedBy, name, parent, fileLimit }) =>
		dataPersistenceStrategy
			.find(createdBy, name, parent)
			.fix(() => null)
			.chain(plain =>
				plain
					? Oath.of(plain)
					: of({
							dataPersistenceStrategy: dataPersistenceStrategy,
							contentPersistenceStrategy: contentPersistenceStrategy,
					  }).create({
							name,
							createdBy,
							parent,
							fileLimit,
					  }),
			)
			.chain(plain =>
				contentPersistenceStrategy
					.write(createdBy, plain.fsid, content)
					.chain(size => Data.of(plain).setSize(size, updatedBy).fold(Oath.reject, Oath.resolve))
					.chain(data => dataPersistenceStrategy.update(data.plain)),
			),
	getContent: ({ createdBy, fsid }) => contentPersistenceStrategy.read(createdBy, fsid),
})

export const DataCommands = { of }
