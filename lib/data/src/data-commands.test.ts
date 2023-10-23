// import { test, expect, afterEach } from "bun:test"
// import { DataCommands } from "./data-commands.impl"
// import { DataRepository } from "./data-repository.types"
// import { ContentPersistenceStrategy } from "./content-persistence-strategy.types"
// import { SUB } from "@ordo-pink/wjwt"
// import { FSID, PlainData } from "./data.types"
// import { Oath } from "@ordo-pink/oath"
// import { Data } from "./data.impl"

// let data = [] as PlainData[]
// let contents = {} as Record<SUB, Record<FSID, string>>

// const dataRepository: DataRepository = {
// 	create: plain => {
// 		data.push(plain)
// 		return Oath.resolve(plain)
// 	},
// 	delete: (uid, fsid) => {
// 		const existingItemIndex = data.findIndex(d => d.createdBy === uid && d.fsid === fsid)
// 		data.splice(existingItemIndex, 1)
// 		return Oath.resolve("OK")
// 	},
// 	exists: (uid, fsid) => Oath.of(data.some(d => d.createdBy === uid && d.fsid === fsid)),
// 	find: (uid, name, parent) =>
// 		Oath.fromNullable(
// 			data.find(d => d.createdBy === uid && d.name === name && d.parent === parent),
// 		).rejectedMap(() => Data.Errors.DataNotFound),
// 	get: (uid, fsid) =>
// 		Oath.fromNullable(data.find(d => d.createdBy === uid && d.fsid === fsid)).rejectedMap(
// 			() => Data.Errors.DataNotFound,
// 		),
// 	getAll: uid => Oath.of(data.filter(d => d.createdBy === uid)),
// 	update: plain => {
// 		const existingItemIndex = data.findIndex(d => d.fsid === plain.fsid)
// 		data.splice(existingItemIndex, 1, plain)
// 		return Oath.resolve("OK")
// 	},
// }

// const contentRepository: ContentPersistenceStrategy<string> = {
// 	create: (uid, fsid) => {
// 		if (!contents[uid]) contents[uid] = {}
// 		if (contents[uid][fsid]) return Oath.reject(Data.Errors.DataAlreadyExists)
// 		contents[uid][fsid] = ""
// 		return Oath.of("OK")
// 	},
// 	delete: (uid, fsid) => {
// 		if (!contents[uid] || !contents[uid][fsid]) return Oath.reject(Data.Errors.DataNotFound)
// 		delete contents[uid][fsid]
// 		return Oath.of("OK")
// 	},
// 	read: (uid, fsid) => {
// 		if (!contents[uid] || !contents[uid][fsid]) return Oath.reject(Data.Errors.DataNotFound)
// 		return Oath.of(contents[uid][fsid])
// 	},
// 	write: (uid, fsid, content) => {
// 		if (!contents[uid] || !contents[uid][fsid]) return Oath.reject(Data.Errors.DataNotFound)
// 		contents[uid][fsid] = content
// 		return Oath.of(content.length)
// 	},
// }

// const dataCommands = DataCommands.of({ dataRepository, contentRepository })

// afterEach(() => {
// 	data = []
// 	contents = {}
// })

// test("DataCommands.create should create an item if it does not exist", async () => {
// 	const createdBy = crypto.randomUUID() as SUB
// 	const fsid = crypto.randomUUID() as FSID

// 	await dataCommands.create({ name: "child", createdBy, parent: null, fsid }).toPromise()

// 	const created = await dataCommands.dataRepository.get(createdBy, fsid).toPromise()

// 	expect(created.fsid).toEqual(fsid)
// })

// test("DataCommands.move should properly move the item", async () => {
// 	const createdBy = crypto.randomUUID() as SUB
// 	const oldParentFsid = crypto.randomUUID() as FSID
// 	const newParentFsid = crypto.randomUUID() as FSID
// 	const childFsid = crypto.randomUUID() as FSID

// 	await dataCommands
// 		.create({ name: "oldParent", createdBy, parent: null, fsid: oldParentFsid })
// 		.toPromise()

// 	await dataCommands
// 		.create({ name: "child", createdBy, parent: oldParentFsid, fsid: childFsid })
// 		.toPromise()

// 	await dataCommands
// 		.create({ name: "newParent", createdBy, parent: null, fsid: newParentFsid })
// 		.toPromise()

// 	await dataCommands
// 		.move({ createdBy, fsid: childFsid, parent: newParentFsid, updatedBy: createdBy })
// 		.toPromise()

// 	const child = await dataCommands.dataRepository.get(createdBy, childFsid).toPromise()
// 	const oldParent = await dataCommands.dataRepository.get(createdBy, oldParentFsid).toPromise()
// 	const newParent = await dataCommands.dataRepository.get(createdBy, newParentFsid).toPromise()

// 	expect(child).toBeDefined()
// 	expect(oldParent).toBeDefined()
// 	expect(newParent).toBeDefined()

// 	expect(child.parent).toEqual(newParentFsid)
// 	expect(newParent.children).toContain(child.fsid)
// 	expect(oldParent.children).not.toContain(child.fsid)
// })
