import { randomBytes } from "crypto"
import { request } from "http"

const makeRequest =
  (url: string) =>
  (payload: string | Buffer): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
      const req = request(url, { method: "POST" }, (res) => {
        res.statusCode && res.statusCode >= 400 && reject(res.statusCode)

        const data: Buffer[] = []
        res.on("data", (chunk: Buffer) => data.push(chunk))
        res.on("end", () => resolve(Buffer.concat(data)))
        res.on("error", reject)
      })
      req.on("error", reject)
      req.write(payload)
      req.end()
    })
  }

const tap =
  <T>(fn: (data: T) => void) =>
  (data: T) => {
    fn(data)
    return data
  }
const payload = randomBytes(64 * 1024).toString("hex")
const getSlice = (data: Buffer) => data.toString().slice(0, 128)

const payloadSlice = getSlice(Buffer.from(payload))
let enryptedSlice
let enryptedLength

makeRequest("http://localhost:1337/encrypt")(payload)
  .then(
    tap((data) => {
      enryptedSlice = getSlice(data)
      enryptedLength = data.length
    }),
  )
  .then(makeRequest("http://localhost:1337/decrypt"))
  .then((data) => {
    const slice = getSlice(data)
    console.log("slices is equal", payloadSlice === slice)
    console.log("encrypted slice is equal with payload", enryptedSlice !== slice)
    console.log("payloads length is", payload.length, enryptedLength, data.toString().length)
  })
  .catch(console.error)
