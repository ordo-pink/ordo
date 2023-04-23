import { randomBytes, createCipheriv, createDecipheriv, CipherKey, createHash } from "crypto"
import { Readable, Transform, Writable } from "stream"

/**
 * Encryption module that applies aes-256-cbc encryption and decryption on the
 * stream of data.
 */
export const createEncryptionModule = (key: string) => {
  const hash = createHash("sha256")
  hash.update(key)
  const digest = hash.digest()
  const transform = encrypter("aes-256-cbc")

  return transform(digest)
}

const encrypter =
  (algorythm: string, options?: unknown) =>
  (encryptionKey: CipherKey, ivSize = 16) => ({
    encryptStream: (input: Readable) => {
      const iv = randomBytes(ivSize)
      const cipher = createCipheriv(algorythm, encryptionKey, iv, options)

      let initialised = false

      return input.pipe(cipher).pipe(
        new Transform({
          transform(chunk, _, callback) {
            if (!initialised) {
              initialised = true
              this.push(Buffer.concat([iv, chunk]))
            } else {
              this.push(chunk)
            }

            callback()
          },
        }),
      )
    },
    decryptStream: (output: Writable) => {
      let iv: string

      return new Transform({
        transform(chunk, _, callback) {
          if (!iv) {
            iv = chunk.slice(0, ivSize)
            const cipher = createDecipheriv(algorythm, encryptionKey, iv)

            this.pipe(cipher).pipe(output)
            this.push(chunk.slice(ivSize))
          } else {
            this.push(chunk)
          }

          callback()
        },
      })
    },
  })
