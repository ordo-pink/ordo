// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { FileModel, type TDataService } from "@ordo-pink/backend-data-service"
import type { Unary } from "@ordo-pink/tau"
import type { SUB } from "@ordo-pink/backend-token-service"
import type * as T from "@ordo-pink/backend-data-service"
import type { File } from "./types/file"

import { Oath } from "@ordo-pink/oath"
import { equals } from "ramda"
import { Readable } from "stream"

type Params = {
	metadataRepository: T.MetadataRepository
	dataRepository: T.DataRepository<Readable>
}
type Fn = Unary<Params, TDataService<Readable>>

const service: Fn = ({ metadataRepository, dataRepository }) => ({
	getRoot: metadataRepository.directory.getRoot,
	createUserSpace: metadataRepository._internal.createUserSpace,
	checkDirectoryExists: metadataRepository.directory.exists,
	getDirectory: metadataRepository.directory.read,
	createDirectory: ({ directory, sub }) =>
		service({ metadataRepository, dataRepository })
			.checkDirectoryExists({ path: directory.path, sub })
			.chain(exists =>
				Oath.fromBoolean(
					() => !exists,
					() => ({ directory, sub }),
					() => new Error("Directory already exists"),
				),
			)
			.map(({ directory, sub }) => {
				// TODO: Use Directory model to create a directory
				const date = new Date(Date.now())

				directory.createdAt = directory.updatedAt = date
				directory.createdBy = directory.updatedBy = sub

				return { directory, sub } as { directory: T.Directory; sub: SUB }
			})
			.chain(({ directory, sub }) =>
				metadataRepository.directory.create({ directory, sub, path: directory.path }),
			),
	getDirectoryChildren: metadataRepository.directory.readWithChildren,
	removeDirectory: metadataRepository.directory.delete,
	updateDirectory: ({ path, content, sub, upsert = false }) =>
		service({ metadataRepository, dataRepository })
			.getDirectory({ path, sub })
			.chain(directory =>
				Oath.fromNullable(directory).rejectedMap(() => new Error("Directory does not exist")),
			)
			.chain(directory =>
				Oath.fromBoolean(
					() => Boolean(directory) || upsert,
					() => directory,
					() => new Error("Directory does not exist"),
				),
			)
			.chain(directory => {
				const updatedDirectory = { ...directory, ...content }

				updatedDirectory.createdAt = directory.createdAt
				updatedDirectory.createdBy = directory.createdBy
				updatedDirectory.updatedAt = new Date(Date.now())
				updatedDirectory.updatedBy = sub

				return equals(updatedDirectory, content)
					? metadataRepository.directory.update({
							sub,
							path: directory.path,
							directory: updatedDirectory,
					  })
					: Oath.of(updatedDirectory)
			}),

	checkFileExists: dataRepository.exists,
	checkFileExistsByPath: metadataRepository.file.exists,
	createFile: ({ file, sub, content, encryption = false }) =>
		metadataRepository.file
			.exists({ sub, path: file.path })
			.chain(exists =>
				Oath.fromBoolean(
					() => !exists,
					() => ({ file, sub, content, encryption }),
					() => new Error("File already exists"),
				),
			)
			.chain(({ sub }) => dataRepository.create({ sub }))
			.map(fsid => {
				const createdFile = { ...file } as File

				const date = new Date(Date.now())

				createdFile.fsid = fsid
				createdFile.size = 0
				createdFile.createdAt = createdFile.updatedAt = date
				createdFile.createdBy = createdFile.updatedBy = sub
				createdFile.encryption = encryption
				createdFile.links = []
				createdFile.labels = []

				return createdFile
			})
			.chain(file =>
				content
					? dataRepository
							.update({ content, sub, fsid: file.fsid, upsert: true })
							.map(size => ({ ...file, size }))
					: Oath.of(file),
			)
			.chain(file => metadataRepository.file.create({ path: file.path, sub, file })),
	getFile: metadataRepository.file.read,
	getFileContent: ({ path, sub }) =>
		metadataRepository.file
			.read({ path, sub })
			.chain(Oath.fromNullable)
			.rejectedMap(() => new Error("File not found"))
			.chain(file => dataRepository.read({ sub, fsid: file.fsid })),
	removeFile: ({ path, sub }) =>
		metadataRepository.file
			.read({ path, sub })
			.chain(Oath.fromNullable)
			.rejectedMap(() => new Error("File not found"))
			.chain(file =>
				Oath.all([
					dataRepository.delete({ sub, fsid: file.fsid }),
					metadataRepository.file.delete({ sub, path: file.path }),
				]).map(() => file),
			),
	setFileContent: ({ path, sub, content }) =>
		metadataRepository.file
			.read({ path, sub })
			.chain(Oath.fromNullable)
			.rejectedMap(() => new Error("File not found"))
			.chain(file =>
				dataRepository.update({ sub, fsid: file.fsid, content }).map(size => ({ ...file, size })),
			)
			.chain(file => metadataRepository.file.update({ sub, file, path: file.path })),
	updateFile: ({ file, path, sub }) =>
		metadataRepository.file
			.exists({ path, sub })
			.chain(exists =>
				Oath.fromBoolean(
					() => exists,
					() => path,
					() => new Error("File not found"),
				),
			)
			.chain(path => metadataRepository.file.read({ path, sub }))
			.chain(file => Oath.fromNullable(file).rejectedMap(() => new Error("File not found")))
			.map(
				oldFile =>
					({
						createdAt: oldFile.createdAt,
						updatedAt: new Date(Date.now()),
						createdBy: oldFile.createdBy,
						updatedBy: sub,
						encryption: oldFile.encryption,
						fsid: oldFile.fsid,
						labels:
							file.labels && Array.isArray(file.labels)
								? Array.from(new Set(file.labels))
								: oldFile.labels,
						links:
							file.links && Array.isArray(file.links)
								? Array.from(new Set(file.links))
								: oldFile.links,
						path:
							file.path && file.path !== oldFile.path && FileModel.isValidPath(file.path)
								? file.path
								: oldFile.path,
						size: oldFile.size,
					}) satisfies File,
			)
			.chain(file => metadataRepository.file.update({ file, path, sub })),
})

export const BackendDataService = {
	of: service,
}
