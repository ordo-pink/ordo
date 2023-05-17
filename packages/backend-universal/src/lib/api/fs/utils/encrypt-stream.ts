import type { Readable, Writable } from "stream"
import { Encrypter, FilePath } from "@ordo-pink/common-types"

export enum ENCRYPT_ACTION {
  ENCRYPT,
  DECRYPT,
}

export const processStream =
  ({ encryptStream, decryptStream }: Encrypter) =>
  (path: FilePath, input: Readable, output?: Writable, shouldEncrypt: ENCRYPT_ACTION = 0) =>
    path.endsWith(".metadata")
      ? shouldEncrypt === ENCRYPT_ACTION.ENCRYPT
        ? input
        : input.pipe(output as Writable)
      : shouldEncrypt === ENCRYPT_ACTION.ENCRYPT
      ? encryptStream(input)
      : input.pipe(decryptStream(output as Writable))
