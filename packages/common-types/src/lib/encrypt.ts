import type { Readable, Writable, Transform } from "stream"
import type { UnaryFn } from "./types"

/**
 * Encryption function.
 */
export type EncryptFn = UnaryFn<Readable, Transform>

/**
 * Decryption function.
 */
export type DecryptFn = UnaryFn<Writable, Transform>

/**
 * Stream encryption module.
 */
export type Encrypter = {
  encryptionType: string
  encryptStream: EncryptFn
  decryptStream: DecryptFn
}
