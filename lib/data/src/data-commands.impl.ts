// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { TDataCommands } from "./data-commands.types"
import { Oath } from "@ordo-pink/oath"
import { Data } from "./data.impl"
import { DataRepository } from "./data-repository.types"
import { Errors } from "./errors.impl"
import { ContentRepository } from "./content-repository.types"

export type DataCommandsParams<T> = {
	dataRepository: DataRepository
	contentRepository: ContentRepository<T>
}

const of = <T>({ dataRepository, contentRepository }: DataCommandsParams<T>): TDataCommands<T> => ({
	contentRepository,
	dataRepository,
	// TODO: Roll back on error
	create: params =>
		(params.name
			? dataRepository
					.find(params.createdBy, params.name, params.parent)
					.fix(() => false)
					.chain(Oath.ifElse(x => !x, { onFalse: () => Errors.DataAlreadyExists }))
			: Oath.all({
					child:
						params.fsid &&
						dataRepository
							.exists(params.createdBy, params.fsid)
							.chain(Oath.ifElse(x => !x, { onFalse: () => Errors.DataAlreadyExists })),
					parent:
						params.parent &&
						dataRepository
							.exists(params.createdBy, params.parent)
							.chain(Oath.ifElse(x => !!x, { onFalse: () => Errors.DataNotFound })),
			  })
		)
			.chain(() => Data.new(params).fold(Oath.reject, Oath.resolve))
			.chain(child =>
				child.plain.parent
					? dataRepository
							.get(child.plain.createdBy, child.plain.parent)
							.chain(parent =>
								Data.of(parent)
									.addChild(child.plain.fsid, child.plain.updatedBy)
									.fold(Oath.reject, Oath.resolve),
							)
							.chain(parent => dataRepository.update(parent.plain).map(() => child))
					: Oath.resolve(child),
			)
			.chain(child =>
				dataRepository
					.create(child.plain)
					.chain(() =>
						contentRepository
							.create(child.plain.createdBy, child.plain.fsid)
							.map(() => child.plain),
					),
			),
	fetch: ({ createdBy }) => dataRepository.getAll(createdBy),
	link: ({ createdBy, fsid, link, updatedBy }) =>
		dataRepository
			.get(createdBy, fsid)
			.chain(plain => Data.of(plain).addLink(link, updatedBy).fold(Oath.reject, Oath.resolve))
			.chain(data => dataRepository.update(data.plain)),
	unlink: ({ createdBy, fsid, link, updatedBy }) =>
		dataRepository
			.get(createdBy, fsid)
			.chain(plain => Data.of(plain).removeLink(link, updatedBy).fold(Oath.reject, Oath.resolve))
			.chain(data => dataRepository.update(data.plain)),
	addLabel: ({ createdBy, fsid, label, updatedBy }) =>
		dataRepository
			.get(createdBy, fsid)
			.chain(plain => Data.of(plain).addLabel(label, updatedBy).fold(Oath.reject, Oath.resolve))
			.chain(data => dataRepository.update(data.plain)),
	removeLabel: ({ createdBy, fsid, label, updatedBy }) =>
		dataRepository
			.get(createdBy, fsid)
			.chain(plain => Data.of(plain).removeLabel(label, updatedBy).fold(Oath.reject, Oath.resolve))
			.chain(data => dataRepository.update(data.plain)),
	update: ({ data, fsid, createdBy, updatedBy }) =>
		dataRepository
			.get(createdBy, fsid)
			.chain(plain => Data.of(plain).update(data).fold(Oath.reject, Oath.resolve))
			.chain(data => dataRepository.update(data.plain)),
	// TODO: Roll back on error
	move: ({ createdBy, fsid, parent, updatedBy }) =>
		Oath.all({
			parent:
				parent &&
				dataRepository
					.exists(createdBy, parent)
					.chain(Oath.ifElse(x => !!x, { onFalse: () => Errors.DataNotFound })),
			child: dataRepository
				.exists(createdBy, fsid)
				.chain(Oath.ifElse(x => !!x, { onFalse: () => Errors.DataNotFound })),
		})
			.chain(() => dataRepository.get(createdBy, fsid))
			.chain(plain =>
				plain.parent
					? dataRepository.get(createdBy, plain.parent).chain(parent =>
							Data.of(parent)
								.removeChild(fsid, updatedBy)
								.fold(Oath.reject, Oath.resolve)
								.chain(data => dataRepository.update(data.plain))
								.map(() => plain),
					  )
					: Oath.resolve(plain),
			)
			.chain(plain => Data.of(plain).setParent(parent, updatedBy).fold(Oath.reject, Oath.resolve))
			.chain(data => dataRepository.update(data.plain))
			.chain(() =>
				parent
					? dataRepository.get(createdBy, parent).chain(plain =>
							Data.of(plain)
								.addChild(fsid, updatedBy)
								.fold(Oath.reject, Oath.resolve)
								.chain(data => dataRepository.update(data.plain)),
					  )
					: Oath.resolve("OK"),
			),
	// TODO: Roll back on error
	remove: ({ createdBy, fsid }) =>
		dataRepository
			.exists(createdBy, fsid)
			.chain(exists =>
				exists
					? dataRepository
							.delete(createdBy, fsid)
							.chain(() => contentRepository.delete(createdBy, fsid))
					: Oath.reject(Data.Errors.DataNotFound),
			),
	rename: ({ fsid, createdBy, name, updatedBy }) =>
		dataRepository
			.get(createdBy, fsid)
			.chain(plain => Data.of(plain).setName(name, updatedBy).fold(Oath.reject, Oath.resolve))
			.chain(data => dataRepository.update(data.plain)),
	// TODO: Roll back on error
	updateContent: ({ content, createdBy, updatedBy, fsid }) =>
		dataRepository.get(createdBy, fsid).chain(plain =>
			contentRepository
				.write(createdBy, plain.fsid, content)
				.chain(size => Data.of(plain).setSize(size, updatedBy).fold(Oath.reject, Oath.resolve))
				.chain(data => dataRepository.update(data.plain)),
		),
	// TODO: Roll back on error
	uploadContent: ({ content, createdBy, updatedBy, name, parent }) =>
		dataRepository
			.find(createdBy, name, parent)
			.fix(() => null)
			.chain(plain =>
				plain
					? Oath.of(plain)
					: of({ dataRepository, contentRepository }).create({
							name,
							createdBy,
							parent,
							updatedBy,
					  }),
			)
			.chain(plain =>
				contentRepository
					.write(createdBy, plain.fsid, content)
					.chain(size => Data.of(plain).setSize(size, updatedBy).fold(Oath.reject, Oath.resolve))
					.chain(data => dataRepository.update(data.plain)),
			),
	getContent: ({ createdBy, fsid }) => contentRepository.read(createdBy, fsid),
})

export const DataCommands = { of }