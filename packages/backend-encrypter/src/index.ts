import { randomBytes, createCipheriv, createDecipheriv, CipherKey, createHash } from "crypto"
import { Transform, TransformOptions, Writable } from "stream"
import { DecryptFn, Encrypter, EncryptFn, UnaryFn } from "@ordo-pink/common-types"

// Public ---------------------------------------------------------------------

// Types ----------------------------------------------------------------------

export type CreateEncryptionModuleParams = {
  /**
   * Algorithm to be used for encryption.
   *
   * @optional
   * @default "aes-256-cbc"
   */
  cipherAlgorithm?: string

  /**
   * Hashing algorithm.
   *
   * @optional
   * @default sha256
   */
  hashAlgorithm?: string

  /**
   * Key to be used for encryption and decryption.
   *
   * @required
   */
  encryptionKey: string

  /**
   * Initialisation vector size.
   *
   * @optional
   * @default 16
   */
  ivSize?: number

  /**
   * Transform stream options.
   *
   * @optional
   * @default undefined
   */
  options?: TransformOptions
}

export type EncryptDecryptParams = {
  /**
   * Cipher key for creating cipher initialisation vector.
   */
  cipherKey: CipherKey

  /**
   * @see CreateEncryptionModuleParams.ivSize
   */
  ivSize: number

  /**
   * @see CreateEncryptionModuleParams.options
   */
  options?: TransformOptions

  /**
   * @see CreateEncryptionModuleParams.cipherAlgorithm
   */
  cipherAlgorithm: string
}

// Impl -----------------------------------------------------------------------

/**
 * Creates encryption module that applies AES-256-CBC encryption and decryption
 * on the stream of data.
 */
export const createEncryptionModule = ({
  cipherAlgorithm = "aes-256-cbc",
  hashAlgorithm = "sha256",
  ivSize = 16,
  options,
  encryptionKey,
}: CreateEncryptionModuleParams): Encrypter => {
  const hash = createHash(hashAlgorithm).update(encryptionKey)
  const cipherKey = hash.digest()

  return {
    encryptStream: encryptStream({ cipherAlgorithm, cipherKey, ivSize, options }),
    decryptStream: decryptStream({ cipherAlgorithm, cipherKey, ivSize, options }),
  }
}

// Internal -------------------------------------------------------------------

const encryptStream: UnaryFn<EncryptDecryptParams, EncryptFn> =
  ({ cipherAlgorithm, cipherKey, ivSize, options }) =>
  (input) => {
    const iv = randomBytes(ivSize)
    const cipher = createCipheriv(cipherAlgorithm, cipherKey, iv, options)

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

const decryptStream: UnaryFn<EncryptDecryptParams, DecryptFn> =
  ({ cipherAlgorithm, cipherKey, ivSize }) =>
  (output: Writable) => {
    let iv: string

    return new Transform({
      transform(chunk, _, callback) {
        if (!iv) {
          iv = chunk.slice(0, ivSize)
          const cipher = createDecipheriv(cipherAlgorithm, cipherKey, iv)

          this.pipe(cipher).pipe(output)
          this.push(chunk.slice(ivSize))
        } else {
          this.push(chunk)
        }

        callback()
      },
    })
  }
