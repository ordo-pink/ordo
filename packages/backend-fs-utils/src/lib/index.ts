import { Readable, Writable, pipeline } from "stream"

export const promiseWriteStream = (readable: Readable, writable: Writable) =>
  new Promise<void>((resolve, reject) =>
    pipeline(readable, writable, (error) => {
      if (error) return reject(error)
      resolve()
    }),
  )

export const promiseReadStream = (readable: Readable) =>
  new Promise<string>((resolve, reject) => {
    const body = []

    readable
      .on("data", (chunk) => body.push(chunk))
      .on("error", reject)
      .on("end", () => resolve(Buffer.concat(body).toString("utf8")))
  })
