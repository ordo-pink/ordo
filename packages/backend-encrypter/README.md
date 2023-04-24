# Backend Encrypter

[![CI](https://github.com/ordo-pink/ordo/actions/workflows/ci.yml/badge.svg)](https://github.com/ordo-pink/ordo/actions/workflows/ci.yml)

[![gitmoji](https://img.shields.io/badge/gitmoji-%20😜%20😍-FFDD67.svg)](https://gitmoji.carloscuesta.me/)
[![nx](https://img.shields.io/badge/generated%20with-nx-blue)](https://nx.dev)
[![license](https://img.shields.io/github/license/ordo-pink/ordo)](https://github.com/ordo-pink/ordo)

This is the default encrypter for Ordo. It applies AES-256-CBC block encryption on file creation and
update, and applies decryption on reading files. Metadata files are not encrypted.

## Examples

In the following example, the client application sends a request to the server asking it to return
encrypted data on request to `/encrypt` and to return decrypted data on request to `/decrypt`. The
payload for encryption/decryption is the body of the HTTP message. If the endpoint is neither
`/encrypt` nor `/decrypt`, the backend returns the data untouched.

### Client

```typescript
import { randomBytes } from "crypto"
import { request } from "http"
import { tap } from "ramda"

const makeRequest =
  (url: string) =>
  (payload: string | Buffer): Promise<Buffer> =>
    new Promise((resolve, reject) => {
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

const payload = randomBytes(64 * 1024).toString("hex")
const getSlice = (data: Buffer) => data.toString().slice(0, 128)
const payloadSlice = getSlice(Buffer.from(payload))

let encryptedSlice: string
let encryptedLength: number

makeRequest("http://localhost:1337/encrypt")(payload)
  .then(
    tap((data) => {
      encryptedSlice = getSlice(data)
      encryptedLength = data.length
    }),
  )
  .then(makeRequest("http://localhost:1337/decrypt"))
  .then((data) => {
    const slice = getSlice(data)

    console.log("slices is equal", payloadSlice === slice)
    console.log("encrypted slice is equal with payload", encryptedSlice !== slice)
    console.log("payloads length is", payload.length, encryptedLength, data.toString().length)
  })
  .catch(console.error)
```

### Server

```typescript
import { createServer } from "http"
import { Switch } from "@ordo-pink/switch"
import { createEncryptionModule } from "../src"

const { encryptStream, decryptStream } = createEncryptionModule({ encryptionKey: "some-key" })

const server = createServer((req, res) => {
  Switch.of(req.url)
    .case(
      (url) => url === "/encrypt",
      () => encryptStream(req).pipe(res),
    )
    .case(
      (url) => url === "/decrypt",
      () => req.pipe(decryptStream(res)),
    )
    .default(() => req.pipe(res))
})

server.listen(1337)
```
