/* eslint-disable @typescript-eslint/ban-ts-comment */
import {
  PassThrough,
  Readable,
  ReadableOptions,
  Stream,
  Transform,
  TransformCallback,
} from "stream"
import {
  DeleteObjectCommandInput,
  GetObjectCommandInput,
  ListObjectsV2CommandInput,
  PutObjectCommandInput,
  S3,
} from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"
import { OrdoDirectoryPath, OrdoFilePath, UnaryFn } from "@ordo-pink/common-types"
import {
  pipe,
  ifElse,
  startsWith,
  endsWith,
  slice,
  concat,
  identity,
  props,
  find,
  prop,
  empty,
  __,
} from "ramda"

const DEFAULT_CHUNK_SIZE = 512 * 1024

export const statF = (client: S3, bucket: string) => (params: Partial<GetObjectCommandInput>) =>
  client.headObject({ Key: "", ...params, Bucket: bucket })

export const statD = (client: S3, bucket: string) => (params: Partial<ListObjectsV2CommandInput>) =>
  client.listObjectsV2({ ...params, Bucket: bucket, MaxKeys: 1 })

export const readdir =
  (client: S3, bucket: string) => async (params: Partial<ListObjectsV2CommandInput>) => {
    const result = await client.listObjectsV2({ Delimiter: "/", ...params, Bucket: bucket })

    if (result.NextContinuationToken) {
      const next = await readdir(
        client,
        bucket,
      )({ ...params, ContinuationToken: result.NextContinuationToken })

      if (!Array.isArray(result.Contents)) {
        result.Contents = []
      }

      if (Array.isArray(next.Contents) && next.Contents.length) {
        result.Contents.push(...next.Contents)
      }

      if (!Array.isArray(result.CommonPrefixes)) {
        result.CommonPrefixes = []
      }

      if (Array.isArray(next.CommonPrefixes) && next.CommonPrefixes.length) {
        result.CommonPrefixes.push(...next.CommonPrefixes)
      }
    }

    return result
  }

export const readfile = (client: S3, bucket: string) => (params: Partial<GetObjectCommandInput>) =>
  new S3DownloadStream({ client, bucket, key: params.Key || "" })

export const put = (client: S3, bucket: string) => (params: Partial<PutObjectCommandInput>) =>
  client.putObject({ Key: "", ...params, Bucket: bucket })

export const write =
  (client: S3, bucket: string) =>
  (params: Partial<PutObjectCommandInput>, readableStream: Readable) => {
    const passThroughStream = new PassThrough()

    const parallelUploads3 = new Upload({
      client,
      params: {
        Key: "",
        Bucket: bucket,
        ...params,
        Body: passThroughStream,
      },
      queueSize: 4,
      partSize: DEFAULT_CHUNK_SIZE * 10,
      leavePartsOnError: false,
    })

    readableStream.pipe(passThroughStream)
    return parallelUploads3.done()
  }

export const move =
  (client: S3, bucket: string) =>
  async (params: Partial<ListObjectsV2CommandInput>, newPrefix: string) => {
    const { Contents } = await readdir(client, bucket)(params)
    if (Contents?.length) {
      Contents.sort((a, b) => ((a.Key || "") > (b.Key || "") ? 1 : -1))
      const directories = Contents.filter(isDirectory)
      const files = Contents.filter((c) => !isDirectory(c))
      for (const obj of [...directories, ...files]) {
        await client.copyObject({
          CopySource: `/${bucket}/${obj.Key}`,
          Key: obj.Key?.replace(params.Prefix || "", newPrefix),
          Bucket: bucket,
        })
      }
      for (const obj of [...directories.reverse(), ...files]) {
        await remove(client, bucket)({ Key: obj.Key })
      }
    }
  }

export const rename =
  (client: S3, bucket: string) =>
  async (params: Partial<ListObjectsV2CommandInput>, newPrefix: string) =>
    client
      .copyObject({
        CopySource: `/${bucket}/${params.Prefix}`,
        Key: newPrefix,
        Bucket: bucket,
      })
      .then(() => remove(client, bucket)({ Key: params.Prefix }))

export const remove =
  (client: S3, bucket: string) => async (params: Partial<DeleteObjectCommandInput>) => {
    if (isDirectory(params)) {
      const { Contents } = await readdir(
        client,
        bucket,
      )({ Prefix: params.Key, Delimiter: undefined })
      if (Array.isArray(Contents)) {
        for (const Key of Contents.map((c) => c.Key)
          .filter((k) => k && k !== params.Key)
          .sort((a = "", b = "") => (a > b ? -1 : 1))) {
          await remove(client, bucket)({ Key })
        }
      }
    }
    return client.deleteObject({ Bucket: bucket, Key: "", ...params })
  }

export const func = (client: S3, bucket: string) => ({
  statF: statF(client, bucket),
  statD: statD(client, bucket),
  readdir: readdir(client, bucket),
  put: put(client, bucket),
  move: move(client, bucket),
  remove: remove(client, bucket),
  readfile: readfile(client, bucket),
  write: write(client, bucket),
  rename: rename(client, bucket),
})

export const toPrefixD = pipe(
  ifElse(startsWith("/"), slice(1, Infinity), identity),
  ifElse(endsWith("/"), identity, concat(__, "/")),
) as UnaryFn<string, OrdoDirectoryPath>

export const toPrefixF = pipe(
  ifElse(startsWith("/"), slice(1, Infinity), identity),
  ifElse(endsWith("/"), slice(0, -1), identity),
) as UnaryFn<string, OrdoFilePath>

export const toFilePath = ifElse(startsWith("/"), identity, concat("/")) as UnaryFn<
  string,
  OrdoFilePath
>
export const toDirectoryPath = pipe(
  toFilePath,
  ifElse(endsWith("/"), identity, concat(__, "/")),
) as UnaryFn<string, OrdoDirectoryPath>

export const isDirectory = pipe(
  props(["Key", "Prefix"]),
  // @ts-ignore
  filter(is(String)),
  find(Boolean),
  endsWith("/"),
) as UnaryFn<Partial<DeleteObjectCommandInput>, boolean>

export const isEmpty = pipe(prop("Contents"), empty)

type S3DownloadStreamOptions = {
  readonly client: S3
  readonly bucket: string
  readonly key: string
  readonly rangeSize?: number
}

export class S3DownloadStream extends Transform {
  private options: S3DownloadStreamOptions
  private _currentCursorPosition = 0
  private _maxContentLength = -1

  constructor(options: S3DownloadStreamOptions, nodeReadableStreamOptions?: ReadableOptions) {
    super(nodeReadableStreamOptions)
    this.options = options
    this.init()
  }

  async init() {
    try {
      const res = await this.options.client.headObject({
        Bucket: this.options.bucket,
        Key: this.options.key,
      })
      this._maxContentLength = res.ContentLength || 0
    } catch (e) {
      this.destroy(e as Error)
      return
    }
    await this.fetchAndEmitNextRange()
  }

  async fetchAndEmitNextRange() {
    if (this._currentCursorPosition >= this._maxContentLength) {
      this.end()
      return
    }

    // Calculate the range of bytes we want to grab
    const range = this._currentCursorPosition + (this.options.rangeSize ?? DEFAULT_CHUNK_SIZE)

    // If the range is greater than the total number of bytes in the file
    // We adjust the range to grab the remaining bytes of data
    const adjustedRange = range < this._maxContentLength ? range : this._maxContentLength

    // Set the Range property on our s3 stream parameters
    const rangeParam = `bytes=${this._currentCursorPosition}-${adjustedRange}`

    // Update the current range beginning for the next go
    this._currentCursorPosition = adjustedRange + 1

    // Grab the range of bytes from the file
    this.options.client.getObject(
      { Bucket: this.options.bucket, Key: this.options.key, Range: rangeParam },
      (error, res) => {
        if (error) {
          // If we encounter an error grabbing the bytes
          // We destroy the stream, NodeJS ReadableStream will emit the 'error' event
          this.destroy(error)
          return
        }

        const data = res?.Body || ""

        if (!(data instanceof Stream.Readable)) {
          // never encountered this error, but you never know
          this.destroy(new Error(`unsupported data representation: ${data}`))
          return
        }

        data.pipe(this, { end: false })

        let streamClosed = false

        data.on("end", async () => {
          if (streamClosed) {
            return
          }
          streamClosed = true
          await this.fetchAndEmitNextRange()
        })
      },
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  override _transform(chunk: any, _: BufferEncoding, callback: TransformCallback) {
    callback(null, chunk)
  }
}
