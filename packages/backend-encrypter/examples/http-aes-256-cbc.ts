import { generateKey } from "crypto"
import { createServer } from "http"
import { promisify } from "util"
import { encrypter } from "../src"

const generateKeyAsync = promisify(generateKey)

generateKeyAsync("aes", { length: 256 })
  .then(encrypter("aes-256-cbc"))
  .then(({ encryptStream, decryptStream }) => {
    createServer((req, res) => {
      if (req.url?.includes("encrypt")) {
        encryptStream(req).pipe(res)
      } else if (req.url?.includes("decrypt")) {
        req.pipe(decryptStream(res))
      } else {
        req.pipe(res)
      }
    }).listen(1337)
  })
