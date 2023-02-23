import { Readable, Writable, pipeline } from "stream"

export const promiseWriteStream = (readable: Readable, writable: Writable) =>
  new Promise<void>((resolve, reject) =>
    pipeline(readable, writable, (error) => {
      if (error) return reject(error)
      resolve()
    }),
  )
