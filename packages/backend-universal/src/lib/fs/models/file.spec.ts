/* eslint-disable @typescript-eslint/no-explicit-any */
import { FSID, FileDriver, IOrdoFile, MetadataDriver, StatsDriver } from "@ordo-pink/common-types"
import uuid from "uuid"
import { OrdoFileModel } from "./file"

let files = [] as { fsid: FSID; content: string }[]
let metadata = [] as IOrdoFile[]

const fileDriver: FileDriver<string> = {
  exists: (fsid) => Promise.resolve(files.some((file) => file.fsid === fsid)),
  create: () =>
    Promise.resolve(uuid.v4()).then((fsid) => {
      files.push({ fsid, content: "" })

      return fsid
    }),
  update: (fsid, content) =>
    Promise.resolve(files.find((file) => file.fsid === fsid)).then((file) => {
      if (!file) return null

      file.content = content

      return content.length
    }),
  read: (fsid) =>
    Promise.resolve(files.find((file) => file.fsid === fsid)).then((file) => file?.content ?? null),
  delete: (fsid) =>
    Promise.resolve(files.find((file) => file.fsid === fsid)).then((file) => {
      if (!file) return null

      files.splice(files.indexOf(file), 1)

      return fsid
    }),
}

const metadataDriver: MetadataDriver = {
  createFile: (file) =>
    Promise.resolve(file).then((file) => {
      metadata.push(file)
      return file
    }),
  createDirectory: () => void 0 as any,
  readFile: (path) => Promise.resolve(metadata.find((file) => file.path === path) ?? null),
  readDirectory: () => void 0 as any,
  checkFileExists: (path) => Promise.resolve(metadata.some((file) => file.path === path)),
  checkDirectoryExists: () => void 0 as any,
  deleteFile: (path) =>
    Promise.resolve(metadata.find((file) => file.path === path)).then((file) => {
      if (!file) return null

      metadata.splice(metadata.indexOf(file), 1)

      return file
    }),
  deleteDirectory: () => void 0 as any,
  updateFile: (path, file) =>
    Promise.resolve(metadata.find((item) => item.path === path)).then((item) => {
      if (!item) return null

      metadata.splice(metadata.indexOf(item), 1, file)

      return file
    }),
  updateDirectory: () => void 0 as any,
}

const statsDriver: StatsDriver = {
  fileContentFetched: () => void 0 as any,
  fileContentUpdated: () => void 0 as any,
  fileCreated: () => void 0 as any,
  fileFetched: () => void 0 as any,
  fileRemoved: () => void 0 as any,
  fileUpdated: () => void 0 as any,
  directoryCreated: () => void 0 as any,
  directoryFetched: () => void 0 as any,
  directoryRemoved: () => void 0 as any,
  directoryUpdated: () => void 0 as any,
}

describe(OrdoFileModel, () => {
  beforeEach(() => {
    files = []
    metadata = []
  })

  describe(OrdoFileModel.of, () => {
    it("should create an OrdoFileModel", () => {
      expect(OrdoFileModel.of(fileDriver, metadataDriver, statsDriver)).toBeInstanceOf(
        OrdoFileModel,
      )
    })
  })
})
