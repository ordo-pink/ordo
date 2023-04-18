import { S3 } from "@aws-sdk/client-s3"
import { FSDriver } from "@ordo-pink/backend-universal"
import { OrdoDirectory, OrdoFile } from "@ordo-pink/fs-entity"
import { F, T } from "ramda"
import { func, toDirectoryPath, toFilePath, toPrefixD, toPrefixF } from "./utils"

type AWSS3Params = {
  accessKeyId: string
  secretAccessKey: string
  region: string
  bucketName: string
  endpoint: string
}

const filterBySamePathAnd =
  <T>(prop: keyof T, self: string, ignore: string[] = []) =>
  (data: T): boolean => {
    const needable = data[prop] as string
    return Boolean(needable && needable !== self && !ignore.some((p) => needable.endsWith(p)))
  }

const mapToFilePath = ({ Key = "" }) => OrdoFile.empty(toFilePath(Key)).path

const mapToDirectoryPath = ({ Prefix = "/" }) => OrdoDirectory.empty(toDirectoryPath(Prefix)).path

export const createDefaultS3Driver = ({
  accessKeyId,
  secretAccessKey,
  region,
  endpoint,
  bucketName,
}: AWSS3Params): FSDriver => {
  const client = new S3({ region, endpoint, credentials: { accessKeyId, secretAccessKey } })
  const { put, readdir, statD, move, readfile, remove, statF, write, rename } = func(
    client,
    bucketName,
  )

  return {
    checkDirectoryExists: (path) =>
      Promise.resolve(path)
        .then(toPrefixD)
        .then((Prefix) => statD({ Prefix }))
        .then(({ Contents }) => Array.isArray(Contents)),
    checkFileExists: (path) =>
      Promise.resolve(path)
        .then(toPrefixF)
        .then((Key) => statF({ Key }))
        .then(T, F),
    createDirectory: (path) =>
      Promise.resolve(path)
        .then((Key) => put({ Key: toPrefixF(`${Key}.fs.ignore`) }).then(() => Key))
        .then(toPrefixD)
        .then((Key) => put({ Key }))
        .then(() => path),
    createFile: ({ path, content }) =>
      Promise.resolve(path)
        .then(toPrefixF)
        .then((Key) => (content ? write({ Key }, content) : put({ Key })))
        .then(() => path),
    deleteDirectory: (path) =>
      Promise.resolve(path)
        .then(toPrefixD)
        .then((Key) => remove({ Key }))
        .then(() => path),
    deleteFile: (path) =>
      Promise.resolve(path)
        .then(toPrefixF)
        .then((Key) => remove({ Key }))
        .then(() => path),
    getDirectoryChildren: (path) =>
      Promise.resolve(path)
        .then(toPrefixD)
        .then((Prefix) =>
          readdir({ Prefix }).then(({ Contents = [], CommonPrefixes = [] }) =>
            Contents.filter(filterBySamePathAnd("Key", Prefix, [".fs.ignore"]))
              .map(mapToFilePath)
              .concat(CommonPrefixes.map(mapToDirectoryPath)),
          ),
        ),
    getFile: (path) =>
      Promise.resolve(path)
        .then(toPrefixF)
        .then((Key) => readfile({ Key })),
    getFileDescriptor: (path) =>
      Promise.resolve(path)
        .then(toPrefixF)
        .then((Key) =>
          statF({ Key }).then(({ LastModified, ContentLength = 0 }) => ({
            path,
            size: ContentLength,
            updatedAt: LastModified,
          })),
        ),
    moveDirectory: (params) =>
      Promise.resolve(params)
        .then(({ oldPath, newPath }) => ({
          Prefix: toPrefixD(oldPath),
          to: toPrefixD(newPath),
        }))
        .then(({ Prefix, to }) => move({ Prefix, Delimiter: undefined }, to))
        .then(() => params.newPath),
    moveFile: (params) =>
      Promise.resolve(params)
        .then(({ oldPath, newPath }) => ({
          Prefix: toPrefixF(oldPath),
          to: toPrefixF(newPath),
        }))
        .then(({ Prefix, to }) => rename({ Prefix }, to))
        .then(() => params.newPath),
    updateFile: ({ path, content }) =>
      Promise.resolve(path)
        .then(toPrefixF)
        .then((Key) => write({ Key }, content))
        .then(() => path),
  }
}
