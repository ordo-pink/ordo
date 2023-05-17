import { Readable } from "stream"

/**
 * Returns a Promise of reading a stream. Resolves with a UTF-8 string
 * contained in the stream. Rejects with an error if it occurs.
 */
export const promiseReadStream = (
  readable: Readable,
  encoding: BufferEncoding = "utf8",
): Promise<string> =>
  new Promise((resolve, reject) => {
    const body = [] as Buffer[]

    readable
      .on("data", (chunk) => body.push(chunk))
      .on("error", reject)
      .on("end", () => resolve(Buffer.concat(body).toString(encoding)))
  })
