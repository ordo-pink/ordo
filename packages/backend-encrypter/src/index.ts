import { randomBytes, createCipheriv, createDecipheriv, CipherKey, createHash } from "crypto"
import { Transform, TransformOptions, Writable } from "stream"
import { DecryptFn, Encrypter, EncryptFn, UnaryFn } from "@ordo-pink/common-types"

// Public ---------------------------------------------------------------------

// Types ----------------------------------------------------------------------

export type Params = {
  /**
   * Algorithm to be used for encryption.
   *
   * @optional
   * @default "aes-256-cbc"
   */
  algorithm: string

  /**
   * Cipher key to be used for encryption and decryption.
   *
   * @required
   */
  encryptionKey: CipherKey

  /**
   * Initialisation vector size.
   *
   * @optional
   * @default 16
   */
  ivSize: number

  /**
   * Transform stream options.
   *
   * @optional
   * @default undefined
   */
  options?: TransformOptions
}

// Impl -----------------------------------------------------------------------

/**
 * Creates encryption module that applies aes-256-cbc encryption and decryption
 * on the stream of data.
 */
export const createEncryptionModule = (key: string) => {
  const hash = createHash("sha256")

  hash.update(key)

  const digest = hash.digest()
  const transform = encrypter("aes-256-cbc")

  return transform(digest)
}

// Internal -------------------------------------------------------------------

const encryptStream: UnaryFn<Params, EncryptFn> =
  ({ algorithm, encryptionKey, ivSize, options }) =>
  (input) => {
    const iv = randomBytes(ivSize)
    const cipher = createCipheriv(algorithm, encryptionKey, iv, options)

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
  }

const decryptStream: UnaryFn<Params, DecryptFn> =
  ({ algorithm, encryptionKey, ivSize }) =>
  (output: Writable) => {
    let iv: string

    return new Transform({
      transform(chunk, _, callback) {
        if (!iv) {
          iv = chunk.slice(0, ivSize)
          const cipher = createDecipheriv(algorithm, encryptionKey, iv)

          this.pipe(cipher).pipe(output)
          this.push(chunk.slice(ivSize))
        } else {
          this.push(chunk)
        }

        callback()
      },
    })
  }

const encrypter =
  (algorithm: string, options?: TransformOptions) =>
  (encryptionKey: CipherKey, ivSize = 16): Encrypter => ({
    encryptStream: encryptStream({ algorithm, encryptionKey, ivSize, options }),
    decryptStream: decryptStream({ algorithm, encryptionKey, ivSize, options }),
  })
