// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { TDataService } from "@ordo-pink/backend-data-service"
import type { Unary } from "@ordo-pink/tau"
import type * as T from "@ordo-pink/backend-data-service"

import { randomUUID } from "crypto"
import { Oath } from "@ordo-pink/oath"
import { Readable } from "stream"
import { DirectoryUtils, FileUtils } from "@ordo-pink/datautil"
import { FSID } from "@ordo-pink/datautil/src/common"

type Params = {
	metadataRepository: T.MetadataRepository
	dataRepository: T.DataRepository<Readable>
}
type Fn = Unary<Params, TDataService<Readable>>

const service: Fn = ({ metadataRepository, dataRepository }) => ({
	getRoot: metadataRepository.directory.getRoot,
	createUserSpace: sub =>
		metadataRepository._internal.createUserSpace(
			DirectoryUtils.create({
				sub,
				fsid: randomUUID() as FSID,
				params: { path: "/" },
			}),
		),
	checkDirectoryExists: metadataRepository.directory.exists,
	getDirectory: metadataRepository.directory.read,
	// TODO: Create parent directory if it does not exist
	createDirectory: ({ params, sub }) =>
		service({ metadataRepository, dataRepository })
			.checkDirectoryExists({ path: params.path, sub })
			.chain(exists =>
				Oath.fromBoolean(
					() => !exists,
					() => ({ params, sub }),
					() => new Error("Directory already exists"),
				),
			)
			.map(({ params, sub }) => DirectoryUtils.create({ params, sub, fsid: randomUUID() as FSID }))
			.chain(directory =>
				metadataRepository.directory.create({ directory, sub, path: directory.path }),
			),
	removeDirectory: ({ path, sub }) =>
		Oath.fromBoolean(
			() => path !== "/",
			() => ({ path, sub }),
			() => new Error("Cannot remove root"),
		).chain(metadataRepository.directory.delete),
	// TODO: Create parent directory if new path is provided and new path parent directory does not exist
	updateDirectory: ({ path, params, sub, upsert = false }) =>
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
			.map(directory => DirectoryUtils.update({ directory, params, sub }))
			.chain(directory =>
				metadataRepository.directory.update({
					sub,
					path: directory.path,
					directory,
				}),
			),

	checkFileExists: dataRepository.exists,
	checkFileExistsByPath: metadataRepository.file.exists,
	// TODO: Create parent directory if it does not exist
	createFile: ({ params, sub, content, encryption = false }) =>
		metadataRepository.file
			.exists({ sub, path: params.path })
			.chain(exists =>
				Oath.fromBoolean(
					() => !exists,
					() => ({ params, sub, content, encryption }),
					() => new Error("File already exists"),
				),
			)
			.chain(({ sub }) => dataRepository.create({ sub }))
			.map(fsid => FileUtils.create({ params, sub, fsid }))
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
	// TODO: Create parent directory if new path is provided and new path parent directory does not exist
	setFileContent: ({ path, sub, content }) =>
		metadataRepository.file
			.read({ path, sub })
			.chain(Oath.fromNullable)
			.fix(() =>
				service({ dataRepository, metadataRepository }).createFile({ sub, params: { path } }),
			)
			.chain(file =>
				dataRepository.update({ sub, fsid: file.fsid, content }).map(size => ({ ...file, size })),
			)
			.chain(file => metadataRepository.file.update({ sub, file, path: file.path })),
	// TODO: Create parent directory if new path is provided and new path parent directory does not exist
	updateFile: ({ params, path, sub }) =>
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
			.map(file => FileUtils.update({ file, params, sub }))
			.chain(file => metadataRepository.file.update({ file, path, sub })),
})

export const BackendDataService = {
	of: service,
}
